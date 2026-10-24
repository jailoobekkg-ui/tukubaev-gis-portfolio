import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdmin, sameOrigin } from "@/lib/auth";
import { getRawContent, saveContent } from "@/lib/content";
import type { SiteContent } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ARRAYS: (keyof SiteContent)[] = ["experience", "projects", "education", "certificates", "skills", "portfolio", "services"];

function validate(c: unknown): c is SiteContent {
  if (!c || typeof c !== "object") return false;
  const x = c as Record<string, unknown>;
  if (!x.profile || typeof x.profile !== "object" || !x.contacts || typeof x.contacts !== "object") return false;
  if (!ARRAYS.every((k) => Array.isArray(x[k]))) return false;
  const slugs = (arr: unknown) => (arr as { slug?: string }[]).map((i) => i.slug ?? "");
  const okSlug = (s: string) => /^[a-z0-9][a-z0-9-]{0,79}$/.test(s);
  const projectSlugs = slugs(x.projects);
  const portfolioSlugs = slugs(x.portfolio);
  return (
    projectSlugs.every(okSlug) &&
    portfolioSlugs.every(okSlug) &&
    new Set(projectSlugs).size === projectSlugs.length &&
    new Set(portfolioSlugs).size === portfolioSlugs.length
  );
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getRawContent(), { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const text = await req.text();
  if (text.length > 5_000_000) return NextResponse.json({ error: "Content too large" }, { status: 413 });
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!validate(data)) {
    return NextResponse.json({ error: "Invalid content: check required sections and that slugs are unique, lowercase, a-z 0-9 -" }, { status: 422 });
  }
  await saveContent(data);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true, savedAt: new Date().toISOString() });
}
