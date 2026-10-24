import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { clientIp, rateLimit } from "@/lib/auth";
import { addMessage } from "@/lib/content";

export const runtime = "nodejs";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  if (!rateLimit(`contact:${clientIp(req.headers)}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  // Honeypot filled in -> pretend success, store nothing.
  if (clean(body.website, 200)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 160);
  const message = clean(body.message, 5000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10) {
    return NextResponse.json({ error: "Invalid input" }, { status: 422 });
  }

  await addMessage({
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    name,
    email,
    organization: clean(body.organization, 160),
    service: clean(body.service, 160),
    message,
    locale: clean(body.locale, 5),
    read: false,
  });
  return NextResponse.json({ ok: true });
}
