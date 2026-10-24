"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@/components/Icon";
import { useI18n } from "@/components/I18nProvider";
import { Reveal } from "./Section";
import { tr, trList } from "@/lib/i18n";
import type { Experience } from "@/lib/types";
import { formatRange, toYearFraction } from "@/lib/utils";

export default function ExperienceTimeline({ items }: { items: Experience[] }) {
  const { locale, t } = useI18n();
  const [open, setOpen] = useState<string | null>(null);

  const sorted = [...items].sort((a, b) => toYearFraction(b.start, false) - toYearFraction(a.start, false));
  const overlaps = (e: Experience) =>
    sorted.some(
      (o) =>
        o.id !== e.id &&
        toYearFraction(o.start, false) < toYearFraction(e.end, true) &&
        toYearFraction(e.start, false) < toYearFraction(o.end, true),
    );

  return (
    <ol className="relative ml-3 border-l border-line/20 md:ml-0 md:border-none">
      {sorted.map((e, i) => {
        const details = trList(e.details, locale);
        const isOpen = open === e.id;
        const parallel = overlaps(e);
        return (
          <li key={e.id} className="relative mb-6 pl-7 md:grid md:grid-cols-[180px_1fr] md:gap-8 md:pl-0">
            <span className="absolute -left-[7px] top-6 h-3.5 w-3.5 rounded-full border-2 border-accent bg-bg md:hidden" aria-hidden />
            <div className="hidden pt-5 text-right md:block">
              <p className="font-mono text-sm text-accent">{formatRange(e.start, e.end, locale)}</p>
            </div>
            <Reveal delay={Math.min(i * 0.04, 0.2)} className="relative md:border-l md:border-line/20 md:pl-8">
              <span className="absolute -left-[8px] top-6 hidden h-4 w-4 rounded-full border-2 border-accent bg-bg md:block" aria-hidden />
              <article className="card card-hover p-5">
                <p className="mb-1 font-mono text-xs text-accent md:hidden">{formatRange(e.start, e.end, locale)}</p>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold leading-snug">{tr(e.position, locale)}</h3>
                  {parallel && <span className="chip border-accent2/40 text-accent2">{t("experience.parallel")}</span>}
                </div>
                <p className="mt-1 text-sm text-fg/85">{tr(e.organization, locale)}</p>
                {tr(e.location, locale) && (
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-muted">
                    <Icon name="pin" className="h-3.5 w-3.5" /> {tr(e.location, locale)}
                  </p>
                )}
                {(details.length > 0 || e.projectSlug) && (
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : e.id)}
                    aria-expanded={isOpen}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                  >
                    {isOpen ? t("experience.hide") : t("experience.details")}
                    <Icon name="chevron-down" className={`h-3.5 w-3.5 transition ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                )}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <ul className="mt-3 space-y-1.5 text-sm text-muted">
                        {details.map((d) => (
                          <li key={d} className="flex gap-2">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                            {d}
                          </li>
                        ))}
                      </ul>
                      {e.projectSlug && (
                        <Link href={`/${locale}/projects/${e.projectSlug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline">
                          {t("experience.relatedProject")} <Icon name="arrow-right" className="h-4 w-4" />
                        </Link>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </article>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
