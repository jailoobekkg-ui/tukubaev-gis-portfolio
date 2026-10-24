import en, { type Dict, type DictKey } from "./en";
import ru from "./ru";
import ky from "./ky";
import { LOCALES, type I18n, type I18nList, type Locale } from "../types";

export type { Dict, DictKey };

const dictionaries: Record<Locale, Dict> = { en, ru, ky };

/** Labels shown in the language switcher (KG is the familiar label for Kyrgyz). */
export const LOCALE_LABELS: Record<Locale, string> = { ky: "KG", ru: "RU", en: "EN" };
export const LOCALE_NAMES: Record<Locale, string> = { ky: "Кыргызча", ru: "Русский", en: "English" };
export const HTML_LANG: Record<Locale, string> = { en: "en", ru: "ru", ky: "ky" };
export const OG_LOCALE: Record<Locale, string> = { en: "en_US", ru: "ru_RU", ky: "ky_KG" };

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

export function getDictionary(locale: Locale, overrides?: Partial<Record<Locale, Record<string, string>>>): Dict {
  const base = { ...en, ...dictionaries[locale] };
  const extra = overrides?.[locale] ?? {};
  for (const [k, v] of Object.entries(extra)) {
    if (v && k in base) base[k as DictKey] = v;
  }
  return base;
}

export function format(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => (k in vars ? String(vars[k]) : `{${k}}`));
}

/** Pick a translated field, falling back to English, then Russian. */
export function tr(value: I18n | undefined | null, locale: Locale): string {
  if (!value) return "";
  return value[locale]?.trim() || value.en?.trim() || value.ru?.trim() || "";
}

export function trList(value: I18nList | undefined | null, locale: Locale): string[] {
  if (!value) return [];
  const list = value[locale]?.filter(Boolean);
  if (list && list.length) return list;
  return (value.en?.length ? value.en : value.ru ?? []).filter(Boolean);
}
