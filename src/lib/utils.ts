import type { Locale, MapSettings } from "./types";

export function cn(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function yearsOfExperience(startYear: number, now = new Date()) {
  return Math.max(0, now.getFullYear() - startYear);
}

/** "2020-07" -> fractional year 2020.5 ; "2016" -> 2016.0 (start) or 2017.0 (end) */
export function toYearFraction(value: string, isEnd: boolean): number {
  const [y, m] = value.split("-").map(Number);
  if (!y) return NaN;
  if (!m) return isEnd ? y + 1 : y;
  return y + (isEnd ? m : m - 1) / 12;
}

const MONTHS: Record<Locale, string[]> = {
  en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
  ru: ["янв.", "февр.", "март", "апр.", "май", "июнь", "июль", "авг.", "сент.", "окт.", "нояб.", "дек."],
  ky: ["янв.", "фев.", "март", "апр.", "май", "июнь", "июль", "авг.", "сент.", "окт.", "нояб.", "дек."],
};

export function formatYm(value: string, locale: Locale) {
  const [y, m] = value.split("-");
  if (!m) return y;
  return `${MONTHS[locale][Number(m) - 1] ?? m} ${y}`;
}

export function formatRange(start: string, end: string, locale: Locale) {
  if (start === end) return formatYm(start, locale);
  return `${formatYm(start, locale)} – ${formatYm(end, locale)}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

export function siteUrl() {
  // Strip a BOM or stray whitespace that some shells add when the value is piped in.
  const raw = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/^﻿/, "").trim().replace(/\/$/, "");
  try {
    return new URL(raw).origin;
  } catch {
    return "http://localhost:3000";
  }
}

/** True when a page has a ready-made web map to show (the only kind of project map on the site). */
export function hasOwnMap(map: MapSettings | undefined) {
  return Boolean(map?.embedUrl);
}

/** Bundled document scans ship with a "-thumb.jpg" preview; other images are used as-is. */
export function thumbOf(src: string) {
  return src.startsWith("/api/media/documents/") && src.endsWith(".jpg") && !src.endsWith("-thumb.jpg")
    ? src.replace(/\.jpg$/, "-thumb.jpg")
    : src;
}
