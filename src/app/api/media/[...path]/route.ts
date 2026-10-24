import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getRawContent, UPLOAD_DIR } from "@/lib/content";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DOCS_DIR = path.join(process.cwd(), "data", "documents");

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".pdf": "application/pdf",
  ".geojson": "application/geo+json",
  ".json": "application/json",
  ".kml": "application/vnd.google-earth.kml+xml",
  ".gpx": "application/gpx+xml",
};

/** A scanned document is public only after the owner approved it in the admin panel. */
async function documentApproved(url: string) {
  const base = url.replace(/-thumb\.jpg$/, ".jpg");
  const c = await getRawContent();
  const items = [...c.certificates, ...c.education];
  return items.some((x) => x.published && x.imageApproved && x.image === base);
}

export async function GET(_req: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const parts = (await params).path ?? [];
  if (parts.length !== 2 || parts.some((p) => !/^[\w.-]+$/.test(p) || p.startsWith("."))) {
    return new NextResponse("Not found", { status: 404 });
  }
  const [area, file] = parts;
  const root = area === "documents" ? DOCS_DIR : area === "u" ? UPLOAD_DIR : null;
  if (!root) return new NextResponse("Not found", { status: 404 });

  const full = path.join(root, file);
  if (!full.startsWith(root + path.sep)) return new NextResponse("Not found", { status: 404 });

  if (area === "documents" && !(await documentApproved(`/api/media/documents/${file}`)) && !(await isAdmin())) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const data = await fs.readFile(full);
    const type = TYPES[path.extname(file).toLowerCase()] ?? "application/octet-stream";
    return new NextResponse(new Uint8Array(data), {
      headers: {
        "Content-Type": type,
        // Documents are re-checked on every request so withdrawing approval takes effect at once.
        "Cache-Control": area === "documents" ? "private, no-cache" : "public, max-age=86400",
        "X-Content-Type-Options": "nosniff",
        ...(type === "application/pdf" ? {} : { "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'" }),
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
