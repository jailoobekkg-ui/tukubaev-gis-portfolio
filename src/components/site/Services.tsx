"use client";

import Icon from "@/components/Icon";
import { useI18n } from "@/components/I18nProvider";
import { Reveal } from "./Section";
import { tr } from "@/lib/i18n";
import type { Service } from "@/lib/types";

/** Selecting a service pre-fills the topic of the contact form below. */
export function requestService(title: string) {
  window.dispatchEvent(new CustomEvent("request-service", { detail: title }));
  document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
}

export default function Services({ items }: { items: Service[] }) {
  const { locale, t } = useI18n();
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {items.map((s, i) => (
        <Reveal key={s.id} delay={Math.min(i * 0.04, 0.3)}>
          <article className="card card-hover group flex h-full flex-col p-5">
            <span className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-accent/20 to-accent2/20 text-accent">
              <Icon name={s.icon} />
            </span>
            <h3 className="font-display font-semibold leading-snug">{tr(s.title, locale)}</h3>
            <p className="mt-2 flex-1 text-sm text-muted">{tr(s.description, locale)}</p>
            <button type="button" onClick={() => requestService(tr(s.title, locale))} className="mt-4 inline-flex items-center gap-1 self-start text-xs font-semibold text-accent hover:underline">
              {t("services.request")} <Icon name="arrow-right" className="h-3.5 w-3.5" />
            </button>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
