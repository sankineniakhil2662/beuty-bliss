import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

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
