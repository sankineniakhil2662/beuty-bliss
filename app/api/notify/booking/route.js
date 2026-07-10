import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { sendSms } from "@/lib/notify";

// Verify the caller is the signed-in admin (Bearer ID token with admin claim).
async function requireAdmin(request) {
  const authz = request.headers.get("authorization") || "";
  const token = authz.startsWith("Bearer ") ? authz.slice(7) : null;
  if (!token) return null;
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return decoded.admin === true ? decoded : null;
  } catch {
    return null;
  }
}

function messageFor(event, name, reviewLink) {
  switch (event) {
    case "confirmed":
      return `Hi ${name}, your Beauty Bliss appointment is confirmed. Sruthi will call to lock in the exact time. See you soon! 💛`;
    case "completed":
      return `Thank you for visiting Beauty Bliss, ${name}! We'd love your feedback — leave a review here: ${reviewLink}`;
    case "cancelled":
      return `Hi ${name}, your Beauty Bliss appointment request has been cancelled. Questions? Call 306-241-5599.`;
    default:
      return null;
  }
}

// POST /api/notify/booking — { bookingId, event, reviewLink? }
// Sends the customer an SMS for confirmed / completed / cancelled events.
export async function POST(request) {
  const admin = await requireAdmin(request);
  if (!admin) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { bookingId, event, reviewLink } = await request.json().catch(() => ({}));
  if (!bookingId || !event) {
    return Response.json({ error: "Missing bookingId or event" }, { status: 400 });
  }

  const snap = await adminDb.collection("bookings").doc(bookingId).get();
  if (!snap.exists) return Response.json({ error: "Booking not found" }, { status: 404 });

  const b = snap.data();
  const name = b.details?.name?.split(" ")[0] || "there";
  const message = messageFor(event, name, reviewLink);
  if (!message) return Response.json({ ok: true, skipped: true });

  const sent = await sendSms(b.details?.phone, message);
  return Response.json({ ok: true, sent });
}
