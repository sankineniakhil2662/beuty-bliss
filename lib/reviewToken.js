// One-time review-token helpers. Uses the Web Crypto API, which is available
// both in the browser (admin generates the token) and in Node/route handlers
// (server hashes the URL token to look up the booking). Only the SHA-256 hash
// is ever stored in Firestore — the raw token lives only in the review link.

export function makeRawToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  // URL-safe base64, no padding.
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function hashToken(raw) {
  const data = new TextEncoder().encode(raw);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
