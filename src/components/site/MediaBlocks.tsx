"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import Modal from "@/components/ui/Modal";
import { useI18n } from "@/components/I18nProvider";
import { tr } from "@/lib/i18n";
import type { MapSettings, PageDocument } from "@/lib/types";

const pageUrl = (doc: PageDocument, n: number, thumb = false) => `${doc.base}/page-${String(n).padStart(2, "0")}${thumb ? "-thumb" : ""}.jpg`;

/** Multi-page publications (atlases): covers grid + page-by-page viewer. */
export function DocumentsBlock({ documents, title }: { documents: PageDocument[]; title: string }) {
  const { locale, t } = useI18n();
  const [doc, setDoc] = useState<PageDocument | null>(null);
  const [page, setPage] = useState(1);

  const go = (delta: number) => doc && setPage((p) => Math.min(doc.pages, Math.max(1, p + delta)));

  useEffect(() => {
    if (!doc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doc]);

  return (
    <section className="card p-4">
      <h2 className="mb-3 flex items-center gap-2 px-1 font-display font-semibold">
        <Icon name="file" className="h-4 w-4 text-accent" /> {title}
      </h2>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {documents.map((d) => (
          <li key={d.id}>
            <button
              type="button"
              onClick={() => {
                setDoc(d);
                setPage(1);
              }}
              className="group block w-full overflow-hidden rounded-xl border border-line/15 text-left transition hover:border-accent/50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pageUrl(d, 1, true)} alt="" loading="lazy" className="aspect-[1.414] w-full object-cover transition group-hover:scale-[1.03]" />
              <span className="block px-3 py-2">
                <span className="block text-sm font-medium leading-snug">{tr(d.title, locale)}</span>
                <span className="block text-xs text-muted">{t("docs.pages", { n: d.pages })}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <Modal open={!!doc} onClose={() => setDoc(null)} title={doc ? tr(doc.title, locale) : ""} closeLabel={t("common.close")} wide>
        {doc && (
          <div>
            <div className="flex items-center gap-2">
              <button type="button" className="btn-ghost px-2" disabled={page === 1} onClick={() => go(-1)} aria-label={t("common.previous")}>
                <Icon name="chevron-left" />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={pageUrl(doc, page)} alt={`${tr(doc.title, locale)} — ${t("docs.page", { n: page, total: doc.pages })}`} className="mx-auto max-h-[72vh] min-w-0 flex-1 rounded-lg bg-white object-contain" />
              <button type="button" className="btn-ghost px-2" disabled={page === doc.pages} onClick={() => go(1)} aria-label={t("common.next")}>
                <Icon name="chevron-right" />
              </button>
            </div>
            {/* preload the next page */}
            {page < doc.pages && <link rel="prefetch" as="image" href={pageUrl(doc, page + 1)} />}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-muted" aria-live="polite">{t("docs.page", { n: page, total: doc.pages })}</span>
              <a href={pageUrl(doc, page)} target="_blank" rel="noopener" className="inline-flex items-center gap-1 text-accent hover:underline">
                <Icon name="external" className="h-4 w-4" /> {t("docs.fullSize")}
              </a>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}

/**
 * A heavy ready-made web map: loaded only when the visitor asks for it.
 * "{lang}" in the URL is replaced with the site language (en / ru / ky).
 */
function EmbeddedMap({ src: template, title }: { src: string; title: string }) {
  const { locale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const src = template.replace("{lang}", locale);
  if (!open) {
    return (
      <div className="grid-bg flex h-[360px] flex-col items-center justify-center gap-3 rounded-xl border border-line/15 p-6 text-center">
        <Icon name="layers" className="h-10 w-10 text-accent" />
        <button type="button" onClick={() => setOpen(true)} className="btn-primary">
          <Icon name="map" className="h-4 w-4" /> {t("map.load")}
        </button>
        <p className="max-w-sm text-xs text-muted">{t("map.loadNote")}</p>
      </div>
    );
  }
  return (
    <div>
      <iframe src={src} title={title} className="h-[70vh] min-h-[420px] w-full rounded-xl border border-line/15 bg-white" loading="lazy" />
      <a href={src} target="_blank" rel="noopener" className="mt-2 inline-flex items-center gap-1 text-sm text-accent hover:underline">
        <Icon name="external" className="h-4 w-4" /> {t("map.fullscreen")}
      </a>
    </div>
  );
}

/** Project map: shown only for a ready-made web map (embedUrl); there is no generic fallback map. */
export function MapBlock({ settings, title }: { settings: MapSettings; title: string }) {
  if (!settings.embedUrl) return null;
  return (
    <section className="card p-4">
      <h2 className="mb-3 flex items-center gap-2 px-1 font-display font-semibold">
        <Icon name="map" className="h-4 w-4 text-accent" /> {title}
      </h2>
      <EmbeddedMap src={settings.embedUrl} title={title} />
    </section>
  );
}

export function Gallery({ images, title, emptyText }: { images: string[]; title: string; emptyText: string }) {
  const { t } = useI18n();
  const [index, setIndex] = useState<number | null>(null);
  const isPdf = (s: string) => s.toLowerCase().endsWith(".pdf");

  return (
    <section className="card p-4">
      <h2 className="mb-3 flex items-center gap-2 px-1 font-display font-semibold">
        <Icon name="image" className="h-4 w-4 text-accent" /> {title}
      </h2>
      {images.length === 0 ? (
        <p className="rounded-xl border border-dashed border-line/25 p-8 text-center text-sm text-muted">{emptyText}</p>
      ) : (
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
          {images.map((src, i) => (
            <li key={src}>
              {isPdf(src) ? (
                <a href={src} target="_blank" rel="noopener" className="grid aspect-[4/3] place-items-center rounded-xl border border-line/15 text-sm text-accent hover:border-accent/50">
                  <span className="flex flex-col items-center gap-2"><Icon name="file" className="h-8 w-8" /> PDF</span>
                </a>
              ) : (
                <button type="button" onClick={() => setIndex(i)} className="block aspect-[4/3] w-full overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" loading="lazy" className="h-full w-full object-cover transition hover:scale-105" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
      <Modal open={index !== null} onClose={() => setIndex(null)} title={title} closeLabel={t("common.close")} wide>
        {index !== null && (
          <div className="flex items-center gap-2">
            <button type="button" className="btn-ghost px-2" onClick={() => setIndex((index - 1 + images.length) % images.length)} aria-label={t("common.previous")}>
              <Icon name="chevron-left" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={images[index]} alt="" className="mx-auto max-h-[75vh] min-w-0 flex-1 rounded-lg object-contain" />
            <button type="button" className="btn-ghost px-2" onClick={() => setIndex((index + 1) % images.length)} aria-label={t("common.next")}>
              <Icon name="chevron-right" />
            </button>
          </div>
        )}
      </Modal>
    </section>
  );
}
