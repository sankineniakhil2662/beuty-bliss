import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, getFirebaseAuth } from "./firebase";
import { withTimeout } from "./withTimeout";
import { hashToken, makeRawToken } from "./reviewToken";

// Human-friendly booking reference, e.g. "#BB-2026-0418".
// NOTE: random 4-digit suffix — fine for MVP volume but not collision-proof.
// Move to a Firestore counter/transaction if bookings scale up.
function makeRef(year) {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `#BB-${year}-${n}`;
}

// Create a booking request in the `bookings` collection.
// payload: { services:[{name,price,qty}], total, details:{name,email,phone,age},
//            consultation:{...}, preferredDate:"YYYY-MM-DD" }
// Returns { id, ref }.
export async function createBooking(payload) {
  const year = (payload.preferredDate || "").slice(0, 4) || String(new Date().getFullYear());
  const ref = makeRef(year);

  const docRef = await addDoc(collection(db, "bookings"), {
    services: payload.services,
    total: payload.total,
    details: payload.details,
    consultation: payload.consultation,
    preferredDate: payload.preferredDate,
    status: "requested",
    ref,
    createdAt: serverTimestamp(),
  });

  return { id: docRef.id, ref };
}

// ---- Admin (authenticated as admin; gated by Firestore rules) ----

// Read all bookings newest-first, mapped to the admin table shape
// ({ id, name, service, preferredDate, status, total, ref }).
export async function fetchAllBookings() {
  const snap = await withTimeout(
    getDocs(query(collection(db, "bookings"), orderBy("createdAt", "desc"))),
    7000,
    "Loading bookings"
  );
  return snap.docs.map((d) => {
    const b = d.data();
    return {
      id: d.id,
      name: b.details?.name ?? "—",
      service: Array.isArray(b.services)
        ? b.services.map((s) => s.name).join(", ")
        : "—",
      preferredDate: b.preferredDate ?? "",
      status: b.status ?? "requested",
      total: b.total ?? 0,
      ref: b.ref ?? "",
    };
  });
}

export async function updateBookingStatus(id, status) {
  await updateDoc(doc(db, "bookings", id), { status });
}

// Mark a booking completed AND mint a one-time review token. Only the SHA-256
// hash is stored; the returned raw token is used to build the review link
// (shown to the admin now; emailed automatically in Phase 5).
export async function completeBookingAndMakeToken(id) {
  const raw = makeRawToken();
  const hash = await hashToken(raw);
  await updateDoc(doc(db, "bookings", id), {
    status: "completed",
    reviewTokenHash: hash,
    reviewTokenUsed: false,
    reviewTokenCreatedAt: serverTimestamp(),
  });
  return raw;
}

// Re-issue a fresh review token for an already-completed booking (the raw one
// can't be recovered from the stored hash, so "resend" regenerates).
export async function regenerateReviewToken(id) {
  const raw = makeRawToken();
  const hash = await hashToken(raw);
  await updateDoc(doc(db, "bookings", id), {
    reviewTokenHash: hash,
    reviewTokenUsed: false,
    reviewTokenCreatedAt: serverTimestamp(),
  });
  return raw;
}

// Client-only: ask the server to text the customer about a status change.
// Best-effort — never throws (SMS failures must not break the admin flow).
export async function notifyBooking(bookingId, event, reviewLink) {
  try {
    const auth = getFirebaseAuth();
    const token = await auth?.currentUser?.getIdToken?.();
    if (!token) return;
    await fetch("/api/notify/booking", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ bookingId, event, reviewLink }),
    });
  } catch {
    /* best-effort */
  }
}
