// Server-only SMS notifications via Twilio. If Twilio env vars aren't set,
// sendSms() no-ops (logs and returns false) so the app works without SMS.
//
// Env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER, ADMIN_PHONE.

// Normalize a North-American phone to E.164 (+1XXXXXXXXXX).
export function normalizePhone(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  if (s.startsWith("+")) return s;
  const d = s.replace(/\D/g, "");
  if (d.length === 10) return "+1" + d;
  if (d.length === 11 && d.startsWith("1")) return "+" + d;
  return null;
}

export function smsConfigured() {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_NUMBER
  );
}

export async function sendSms(to, body) {
  const dest = normalizePhone(to);
  if (!smsConfigured()) {
    console.log("[sms] not configured — would send to", dest, ":", body?.slice(0, 60));
    return false;
  }
  if (!dest) {
    console.warn("[sms] invalid destination:", to);
    return false;
  }
  try {
    const twilio = (await import("twilio")).default;
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );
    await client.messages.create({
      to: dest,
      from: process.env.TWILIO_FROM_NUMBER,
      body,
    });
    return true;
  } catch (err) {
    console.error("[sms] send failed:", err.message);
    return false;
  }
}
