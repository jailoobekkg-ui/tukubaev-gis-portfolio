"use client";

import { useState } from "react";
import Icon from "@/components/Icon";
import Modal from "@/components/ui/Modal";
import { useI18n } from "@/components/I18nProvider";
import { Reveal } from "./Section";
import { tr } from "@/lib/i18n";
import type { Education } from "@/lib/types";

export default function EducationCards({ items }: { items: Education[] }) {
  const { locale, t } = useI18n();
  const [open, setOpen] = useState<Education | null>(null);

  return (
    <div className="grid gap-5">
      {items.map((e) => (
        <Reveal key={e.id}>
          <article className="card relative overflow-hidden p-6 md:p-8">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-accent/10 blur-3xl" aria-hidden />
            <div className="flex flex-col gap-6 md:flex-row md:items-start">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-accent/15 text-accent">
                <Icon name="graduation" className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <p className="font-mono text-sm text-accent">{e.period}</p>
                <h3 className="mt-1 font-display text-xl font-bold leading-snug md:text-2xl">{tr(e.institution, locale)}</h3>
                <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-muted">{t("education.specialty")}</dt>
                    <dd className="font-medium">{tr(e.specialty, locale)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">{t("education.qualification")}</dt>
                    <dd className="font-medium">{tr(e.qualification, locale)}</dd>
                  </div>
                  {tr(e.faculty, locale) && (
                    <div>
                      <dt className="text-muted">{t("education.faculty")}</dt>
                      <dd className="font-medium">{tr(e.faculty, locale)}</dd>
                    </div>
                  )}
                  <div className="sm:col-span-2">
                    <dt className="text-muted">{t("education.thesis")}</dt>
                    <dd className="font-medium italic">“{tr(e.thesis, locale)}”</dd>
                  </div>
                </dl>
                {e.image && (
                  <button type="button" onClick={() => setOpen(e)} className="btn-ghost mt-5">
                    <Icon name="eye" className="h-4 w-4" /> {t("education.viewDiploma")}
                  </button>
                )}
              </div>
            </div>
          </article>
        </Reveal>
      ))}
      <Modal open={!!open} onClose={() => setOpen(null)} title={open ? tr(open.institution, locale) : ""} closeLabel={t("common.close")} wide>
        {open?.image && (
          <figure>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={open.image} alt={`${t("education.viewDiploma")} — ${tr(open.institution, locale)}`} className="mx-auto max-h-[75vh] w-auto rounded-lg" />
            <figcaption className="mt-3 text-center text-xs text-muted">{t("education.redacted")}</figcaption>
          </figure>
        )}
      </Modal>
    </div>
  );
}
