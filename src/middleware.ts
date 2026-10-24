import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "./lib/session";

const LOCALES = ["en", "ru", "ky"];

function preferredLocale(req: NextRequest) {
  const saved = req.cookies.get("lang")?.value;
  if (saved && LOCALES.includes(saved)) return saved;
  const header = req.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const code = part.split(";")[0].trim().slice(0, 2).toLowerCase();
    if (code === "ky" || code === "kg") return "ky";
    if (code === "ru") return "ru";
    if (code === "en") return "en";
  }
  return "en";
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Admin area: everything except the login page and the login API needs a valid session.
  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin/");
  if (isAdminPage || isAdminApi) {
    if (pathname === "/admin/login" || pathname === "/api/admin/login") return NextResponse.next();
    const ok = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
    if (ok) {
      const res = NextResponse.next();
      res.headers.set("X-Robots-Tag", "noindex, nofollow");
      res.headers.set("Cache-Control", "no-store");
      return res;
    }
    if (isAdminApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  // Root -> language version.
  if (pathname === "/") {
    const url = req.nextUrl.clone();
    url.pathname = `/${preferredLocale(req)}`;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/admin", "/admin/:path*", "/api/admin/:path*"],
};
