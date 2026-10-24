import { NextResponse } from "next/server";
import { authConfigured, checkCredentials, clientIp, rateLimit, sameOrigin } from "@/lib/auth";
import { createSessionToken, SESSION_COOKIE, SESSION_TTL_SECONDS } from "@/lib/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  if (!authConfigured()) {
    return NextResponse.json({ error: "Admin login is not configured. Set ADMIN_PASSWORD_HASH and AUTH_SECRET in .env.local." }, { status: 503 });
  }
  if (!rateLimit(`login:${clientIp(req.headers)}`, 8, 15 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }
  let username = "";
  let password = "";
  try {
    const body = await req.json();
    username = String(body.username ?? "").slice(0, 100);
    password = String(body.password ?? "").slice(0, 200);
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  if (!(await checkCredentials(username, password))) {
    await new Promise((r) => setTimeout(r, 600));
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, await createSessionToken(username), {
    httpOnly: true,
    sameSite: "strict",
    // Secure whenever the site is reached over HTTPS (directly or behind a proxy).
    secure: req.headers.get("x-forwarded-proto") === "https" || new URL(req.url).protocol === "https:",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return res;
}
