"use client";

import { createContext, useContext } from "react";
import type { Dict, DictKey } from "@/lib/i18n";
import { format } from "@/lib/i18n";
import type { Locale } from "@/lib/types";

type Ctx = { locale: Locale; dict: Dict };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({ locale, dict, children }: Ctx & { children: React.ReactNode }) {
  return <I18nContext.Provider value={{ locale, dict }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  const t = (key: DictKey, vars?: Record<string, string | number>) => format(ctx.dict[key] ?? key, vars);
  return { locale: ctx.locale, t };
}
