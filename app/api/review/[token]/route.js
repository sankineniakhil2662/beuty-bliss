import { FieldValue } from "firebase-admin/firestore";
import { getAdminDb } from "@/lib/firebaseAdmin";
import { hashToken } from "@/lib/reviewToken";

// Find the booking whose stored reviewTokenHash matches this raw token,
// as long as the token hasn't been used yet.
async function findBookingByToken(token) {
  if (!token) return null;
  const adminDb = getAdminDb();
  if (!adminDb) return null;
  const hash = await hashToken(token);
  const snap = await adminDb
    .collection("bookings")
    .where("reviewTokenHash", "==", hash)
    .limit(1)
    .get();
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

function serviceLabel(b) {
  return Array.isArray(b.services) ? b.services.map((s) => s.name).join(", ") : "";
}

// GET /api/review/[token] — validate the link (used by the review page).
export async function GET(_request, { params }) {
  const { token } = await params;
  try {
    const b = await findBookingByToken(token);
    if (!b || b.reviewTokenUsed) return Response.json({ valid: false });
    return Response.json({
      valid: true,
      name: b.details?.name ?? "",
      service: serviceLabel(b),
      ref: b.ref ?? "",
    });
  } catch (err) {
    console.error("review token GET failed:", err);
    return Response.json({ valid: false }, { status: 500 });
  }
}

// POST /api/review/[token] — submit the verified review, then burn the token.
export async function POST(request, { params }) {
  const { token } = await params;
  try {
    const b = await findBookingByToken(token);
    if (!b || b.reviewTokenUsed) {
      return Response.json(
        { error: "This review link is invalid or has already been used." },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const rating = Number(body.rating) || 5;
    const text = (body.text || "").trim();
    const photos = Array.isArray(body.photoUrls) ? body.photoUrls.slice(0, 4) : [];
    if (!text) {
      return Response.json({ error: "Please write a review." }, { status: 400 });
    }

    const adminDb = getAdminDb();
    if (!adminDb) {
      return Response.json({ error: "Admin backend not configured" }, { status: 503 });
    }

    await adminDb.collection("reviews").add({
      name: b.details?.name ?? "Verified client",
      service: serviceLabel(b),
      rating,
      text,
      photos,
      status: "pending",
      verified: true,
      bookingRef: b.ref ?? "",
      bookingId: b.id,
      createdAt: FieldValue.serverTimestamp(),
    });

    // One-time use: burn the token.
    await adminDb.collection("bookings").doc(b.id).update({ reviewTokenUsed: true });

    return Response.json({ ok: true });
  } catch (err) {
    console.error("review token POST failed:", err);
    return Response.json(
      { error: "Couldn't submit your review. Please try again." },
      { status: 500 }
    );
  }
}
