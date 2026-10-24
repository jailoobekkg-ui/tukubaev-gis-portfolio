import { randomBytes } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { isAdmin, sameOrigin } from "@/lib/auth";
import { UPLOAD_DIR } from "@/lib/content";

export const runtime = "nodejs";

const ALLOWED = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".geojson", ".json", ".kml", ".gpx"]);
const MAX_BYTES = 15 * 1024 * 1024;

/** Checks the first bytes so a renamed file cannot pass as an image or PDF. */
function signatureOk(ext: string, buf: Buffer) {
  const hex = buf.subarray(0, 12).toString("hex");
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return hex.startsWith("ffd8ff");
    case ".png":
      return hex.startsWith("89504e47");
    case ".gif":
      return hex.startsWith("47494638");
    case ".webp":
      return hex.startsWith("52494646") && buf.subarray(8, 12).toString() === "WEBP";
    case ".pdf":
      return buf.subarray(0, 5).toString() === "%PDF-";
    case ".geojson":
    case ".json":
      try {
        JSON.parse(buf.toString("utf8"));
        return true;
      } catch {
        return false;
      }
    case ".kml":
    case ".gpx":
      return buf.subarray(0, 512).toString("utf8").includes("<");
    default:
      return false;
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!sameOrigin(req)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File larger than 15 MB" }, { status: 413 });

  const ext = path.extname(file.name).toLowerCase();
  if (!ALLOWED.has(ext)) return NextResponse.json({ error: `File type ${ext || "?"} not allowed` }, { status: 415 });
  const buf = Buffer.from(await file.arrayBuffer());
  if (!signatureOk(ext, buf)) return NextResponse.json({ error: "File content does not match its extension" }, { status: 415 });

  const base = path.basename(file.name, ext).toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "file";
  const name = `${base}-${randomBytes(4).toString("hex")}${ext === ".jpeg" ? ".jpg" : ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), buf);
  return NextResponse.json({ ok: true, url: `/api/media/u/${name}` });
}
