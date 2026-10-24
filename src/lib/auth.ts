import "server-only";
import { scrypt, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { SESSION_COOKIE, verifySessionToken } from "./session";

function scryptAsync(password: string, salt: string, keylen: number) {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(password, salt, keylen, (err, key) => (err ? reject(err) : resolve(key))),
  );
}

export function authConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD_HASH && (process.env.AUTH_SECRET?.length ?? 0) >= 32);
}

export async function checkCredentials(username: string, password: string): Promise<boolean> {
  const expectedUser = process.env.ADMIN_USERNAME || "admin";
  const stored = process.env.ADMIN_PASSWORD_HASH || "";
  const [scheme, salt, hashHex] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scryptAsync(password, salt, expected.length);
  const userOk = username.length === expectedUser.length && timingSafeEqual(Buffer.from(username), Buffer.from(expectedUser));
  return timingSafeEqual(actual, expected) && userOk;
}

/** Second line of defence for API routes (middleware already checks). */
export async function isAdmin() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

// Simple in-memory rate limiter (per server process).
const buckets = new Map<string, { count: number; reset: number }>();
export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    return true;
  }
  b.count += 1;
  return b.count <= limit;
}

/** Blocks cross-site form posts to admin endpoints (in addition to SameSite=Strict cookies). */
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export function clientIp(headers: Headers) {
  return headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "local";
}
