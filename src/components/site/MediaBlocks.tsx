"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import Icon from "@/components/Icon";
import Modal from "@/components/ui/Modal";
import { useI18n } from "@/components/I18nProvider";
import type { MapSettings } from "@/lib/types";

const ProjectMap = dynamic(() => import("@/components/map/ProjectMap"), {
  ssr: false,
  loading: () => <div className="h-[360px] w-full animate-pulse rounded-xl bg-bg2" />,
});

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

export function MapBlock({ settings, title }: { settings: MapSettings; title: string }) {
  return (
    <section className="card p-4">
      <h2 className="mb-3 flex items-center gap-2 px-1 font-display font-semibold">
        <Icon name="map" className="h-4 w-4 text-accent" /> {title}
      </h2>
      {settings.embedUrl ? <EmbeddedMap src={settings.embedUrl} title={title} /> : <ProjectMap settings={settings} />}
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
