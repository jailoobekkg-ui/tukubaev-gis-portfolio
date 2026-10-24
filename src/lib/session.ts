// Signed session tokens using Web Crypto, so the same code runs in middleware (Edge) and route handlers (Node).
export const SESSION_COOKIE = "gp_admin";
export const SESSION_TTL_SECONDS = 8 * 60 * 60;

const encoder = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array) {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const b of arr) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromB64url(value: string) {
  const s = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from(s, (c) => c.charCodeAt(0));
}

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) return null;
  return secret;
}

async function hmacKey(secret: string) {
  return crypto.subtle.importKey("raw", encoder.encode(secret) as BufferSource, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function createSessionToken(username: string): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error("AUTH_SECRET is not configured (min. 32 characters)");
  const payload = b64url(encoder.encode(JSON.stringify({ u: username, exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS })));
  const sig = await crypto.subtle.sign("HMAC", await hmacKey(secret), encoder.encode(payload) as BufferSource);
  return `${payload}.${b64url(sig)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  const secret = getSecret();
  if (!secret || !token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;
  try {
    const ok = await crypto.subtle.verify(
      "HMAC",
      await hmacKey(secret),
      fromB64url(sig) as BufferSource,
      encoder.encode(payload) as BufferSource,
    );
    if (!ok) return false;
    const data = JSON.parse(new TextDecoder().decode(fromB64url(payload))) as { exp?: number };
    return typeof data.exp === "number" && data.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
