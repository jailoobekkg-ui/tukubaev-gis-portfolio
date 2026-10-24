"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@/components/Icon";
import Modal from "@/components/ui/Modal";
import { useI18n } from "@/components/I18nProvider";
import { tr, type DictKey } from "@/lib/i18n";
import type { Certificate } from "@/lib/types";
import { cn, thumbOf } from "@/lib/utils";

export default function Certificates({ items }: { items: Certificate[] }) {
  const { locale, t } = useI18n();
  const [topic, setTopic] = useState<string>("all");
  const [year, setYear] = useState<number | "all">("all");
  const [index, setIndex] = useState<number | null>(null);

  const topics = useMemo(() => Array.from(new Set(items.flatMap((c) => c.topics))), [items]);
  const years = useMemo(() => Array.from(new Set(items.map((c) => c.year))).sort((a, b) => b - a), [items]);
  const filtered = items
    .filter((c) => (topic === "all" || c.topics.includes(topic)) && (year === "all" || c.year === year))
    .sort((a, b) => b.year - a.year);
  const current = index !== null ? filtered[index] : null;
  const topicLabel = (k: string) => t(`topic.${k}` as DictKey);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("certs.topic")}>
          <span className="mr-1 text-xs text-muted">{t("certs.topic")}:</span>
          {["all", ...topics].map((k) => (
            <button key={k} type="button" onClick={() => setTopic(k)} aria-pressed={topic === k} className={cn("chip transition hover:border-accent/50", topic === k && "chip-active")}>
              {k === "all" ? t("certs.all") : topicLabel(k)}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2" role="group" aria-label={t("certs.year")}>
          <span className="mr-1 text-xs text-muted">{t("certs.year")}:</span>
          {(["all", ...years] as (number | "all")[]).map((y) => (
            <button key={y} type="button" onClick={() => setYear(y)} aria-pressed={year === y} className={cn("chip transition hover:border-accent/50", year === y && "chip-active")}>
              {y === "all" ? t("certs.all") : y}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-4 text-xs text-muted" aria-live="polite">{t("certs.count", { n: filtered.length })}</p>

      <motion.ul layout className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((c, i) => (
            <motion.li key={c.id} layout initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}>
              <button type="button" onClick={() => setIndex(i)} className="card card-hover group flex h-full w-full flex-col overflow-hidden text-left">
                <div className="relative grid h-48 place-items-center overflow-hidden bg-fg/[0.03]">
                  {c.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={thumbOf(c.image)} alt="" loading="lazy" className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex flex-col items-center gap-2 px-6 text-center text-xs text-muted">
                      <Icon name="award" className="h-10 w-10 text-accent/70" />
                      <span>{t("certs.pending")}</span>
                    </div>
                  )}
                  <span className="absolute right-3 top-3 rounded-md bg-bg/85 px-2 py-0.5 font-mono text-xs text-accent">{c.year}</span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="font-display font-semibold leading-snug">{tr(c.title, locale)}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-muted">{tr(c.issuer, locale)}</p>
                  <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                    {c.topics.map((k) => (
                      <span key={k} className="chip">{topicLabel(k)}</span>
                    ))}
                  </div>
                </div>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {filtered.length === 0 && <p className="py-10 text-center text-muted">{t("certs.empty")}</p>}

      <Modal open={!!current} onClose={() => setIndex(null)} title={current ? tr(current.title, locale) : ""} closeLabel={t("common.close")} wide>
        {current && (
          <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
            <div className="grid min-h-[200px] place-items-center rounded-xl bg-fg/[0.03] p-2">
              {current.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={current.image} alt={tr(current.title, locale)} className="max-h-[70vh] w-auto rounded-lg" />
              ) : (
                <p className="p-8 text-center text-sm text-muted">{t("certs.pending")}</p>
              )}
            </div>
            <div className="space-y-3 text-sm">
              <p><span className="text-muted">{t("projects.organization")}: </span>{tr(current.issuer, locale)}</p>
              <p><span className="text-muted">{t("projects.period")}: </span>{tr(current.date, locale)}</p>
              {tr(current.location, locale) && <p><span className="text-muted">{t("projects.location")}: </span>{tr(current.location, locale)}</p>}
              <div className="flex flex-wrap gap-1.5">
                {current.topics.map((k) => <span key={k} className="chip">{topicLabel(k)}</span>)}
              </div>
              {tr(current.description, locale) && <p className="leading-relaxed text-fg/85">{tr(current.description, locale)}</p>}
              <div className="flex gap-2 pt-2">
                <button type="button" className="btn-ghost px-3" disabled={index === 0} onClick={() => setIndex((v) => (v ? v - 1 : v))} aria-label={t("common.previous")}>
                  <Icon name="chevron-left" className="h-4 w-4" />
                </button>
                <button type="button" className="btn-ghost px-3" disabled={index === filtered.length - 1} onClick={() => setIndex((v) => (v !== null && v < filtered.length - 1 ? v + 1 : v))} aria-label={t("common.next")}>
                  <Icon name="chevron-right" className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
