import { NextResponse } from "next/server";
import { isAdmin, sameOrigin } from "@/lib/auth";
import { getMessages, saveMessages } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getMessages(), { headers: { "Cache-Control": "no-store" } });
}

/** body: { id, read } marks a message; body: { id, delete: true } removes it. */
export async function PATCH(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const body = (await req.json().catch(() => ({}))) as { id?: string; read?: boolean; delete?: boolean };
  if (!body.id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  let all = await getMessages();
  if (body.delete) all = all.filter((m) => m.id !== body.id);
  else all = all.map((m) => (m.id === body.id ? { ...m, read: Boolean(body.read) } : m));
  await saveMessages(all);
  return NextResponse.json({ ok: true });
}
