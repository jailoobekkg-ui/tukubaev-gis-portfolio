import "server-only";
import { promises as fs } from "node:fs";
import path from "node:path";
import type { ContactMessage, SiteContent } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const CONTENT_FILE = path.join(DATA_DIR, "content.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const BACKUP_DIR = path.join(DATA_DIR, "backups");
export const UPLOAD_DIR = path.join(DATA_DIR, "uploads");

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(file, "utf8")) as T;
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return fallback;
    throw err;
  }
}

/** Write via a temp file + rename so a crash never leaves half-written JSON. */
async function writeJson(file: string, data: unknown) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, file);
}

/** Full content including unpublished items (admin use). */
export async function getRawContent(): Promise<SiteContent> {
  return readJson<SiteContent>(CONTENT_FILE, null as unknown as SiteContent);
}

/** Content as the public sees it: hidden items removed, unapproved document images stripped. */
export async function getPublicContent(): Promise<SiteContent> {
  const c = await getRawContent();
  return {
    ...c,
    experience: c.experience.filter((x) => x.published),
    projects: c.projects.filter((x) => x.published),
    education: c.education
      .filter((x) => x.published)
      .map((x) => (x.imageApproved ? x : { ...x, image: "" })),
    certificates: c.certificates
      .filter((x) => x.published)
      .map((x) => (x.imageApproved ? x : { ...x, image: "" })),
    skills: c.skills.filter((x) => x.published),
    portfolio: c.portfolio.filter((x) => x.published),
    services: c.services.filter((x) => x.published),
  };
}

export async function saveContent(content: SiteContent) {
  const previous = await readJson<SiteContent | null>(CONTENT_FILE, null);
  if (previous) {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    await writeJson(path.join(BACKUP_DIR, `content-${stamp}.json`), previous);
    await pruneBackups(30);
  }
  await writeJson(CONTENT_FILE, content);
}

async function pruneBackups(keep: number) {
  try {
    const files = (await fs.readdir(BACKUP_DIR)).filter((f) => f.startsWith("content-")).sort();
    await Promise.all(files.slice(0, Math.max(0, files.length - keep)).map((f) => fs.unlink(path.join(BACKUP_DIR, f))));
  } catch {
    /* backups are best-effort */
  }
}

export async function getMessages(): Promise<ContactMessage[]> {
  return readJson<ContactMessage[]>(MESSAGES_FILE, []);
}

export async function saveMessages(messages: ContactMessage[]) {
  await writeJson(MESSAGES_FILE, messages);
}

export async function addMessage(message: ContactMessage) {
  const all = await getMessages();
  all.unshift(message);
  await saveMessages(all.slice(0, 2000));
}
