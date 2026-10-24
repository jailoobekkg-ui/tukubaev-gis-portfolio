"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@/components/Icon";
import { useI18n } from "@/components/I18nProvider";
import { TopoArt } from "./ProjectCard";
import { tr, type DictKey } from "@/lib/i18n";
import { PORTFOLIO_CATEGORIES, type PortfolioItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const CAT_ICON: Record<string, string> = {
  "gis-mapping": "map",
  "land-surveying": "target",
  cadastral: "land",
  "remote-sensing": "satellite",
  uav: "drone",
  "web-gis": "globe",
  water: "layers",
};

export default function PortfolioGrid({ items, limit, initialCategory = "all" }: { items: PortfolioItem[]; limit?: number; initialCategory?: string }) {
  const { locale, t } = useI18n();
  const [cat, setCat] = useState(initialCategory);
  const filtered = items.filter((x) => cat === "all" || x.category === cat);
  const shown = limit ? filtered.slice(0, limit) : filtered;

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Categories">
        {["all", ...PORTFOLIO_CATEGORIES].map((c) => (
          <button key={c} type="button" onClick={() => setCat(c)} aria-pressed={cat === c} className={cn("chip gap-1.5 transition hover:border-accent/50", cat === c && "chip-active")}>
            {c !== "all" && <Icon name={CAT_ICON[c]} className="h-3.5 w-3.5" />}
            {c === "all" ? t("portfolio.all") : t(`cat.${c}` as DictKey)}
          </button>
        ))}
      </div>

      <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {shown.map((p, i) => (
            <motion.li key={p.id} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }}>
              <Link href={`/${locale}/portfolio/${p.slug}`} className="card card-hover group flex h-full flex-col overflow-hidden">
                <div className="relative h-40 overflow-hidden">
                  {p.images[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.images[0]} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  ) : (
                    <TopoArt seed={i + 11} className="h-full w-full" />
                  )}
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-md bg-bg/85 px-2 py-1 text-xs text-accent backdrop-blur">
                    <Icon name={CAT_ICON[p.category] ?? "map"} className="h-3.5 w-3.5" />
                    {t(`cat.${p.category}` as DictKey)}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="font-mono text-xs text-muted">{p.year}</p>
                  <h3 className="mt-1 font-display font-semibold leading-snug">{tr(p.title, locale)}</h3>
                  <p className="mt-2 line-clamp-3 text-sm text-muted">{tr(p.summary, locale)}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-semibold text-accent">
                    {t("portfolio.open")} <Icon name="arrow-right" className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {shown.length === 0 && <p className="py-10 text-center text-muted">{t("portfolio.empty")}</p>}
    </div>
  );
}
