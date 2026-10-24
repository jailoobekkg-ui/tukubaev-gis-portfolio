"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import { useI18n } from "@/components/I18nProvider";
import { tr } from "@/lib/i18n";
import type { Contacts, I18n } from "@/lib/types";

function contactLinks(c: Contacts) {
  const digits = (v: string) => v.replace(/[^\d+]/g, "");
  const links: { key: "contact.email" | "contact.phone" | "contact.whatsapp" | "contact.telegram" | "contact.linkedin" | "contact.github"; icon: string; label: string; href: string }[] = [];
  if (c.email) links.push({ key: "contact.email", icon: "mail", label: c.email, href: `mailto:${c.email}` });
  if (c.phone) links.push({ key: "contact.phone", icon: "phone", label: c.phone, href: `tel:${digits(c.phone)}` });
  if (c.whatsapp) links.push({ key: "contact.whatsapp", icon: "whatsapp", label: c.whatsapp, href: `https://wa.me/${digits(c.whatsapp).replace("+", "")}` });
  if (c.telegram) {
    const handle = c.telegram.replace(/^https?:\/\/t\.me\//, "").replace(/^@/, "");
    links.push({ key: "contact.telegram", icon: "telegram", label: `@${handle}`, href: `https://t.me/${handle}` });
  }
  if (c.linkedin) links.push({ key: "contact.linkedin", icon: "linkedin", label: c.linkedin.replace(/^https?:\/\/(www\.)?/, ""), href: c.linkedin.startsWith("http") ? c.linkedin : `https://${c.linkedin}` });
  if (c.github) links.push({ key: "contact.github", icon: "github", label: c.github.replace(/^https?:\/\/(www\.)?/, ""), href: c.github.startsWith("http") ? c.github : `https://github.com/${c.github}` });
  return links;
}

export default function Contact({ contacts, location, services }: { contacts: Contacts; location: I18n; services: string[] }) {
  const { locale, t } = useI18n();
  const [topic, setTopic] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  useEffect(() => {
    const onReq = (e: Event) => setTopic((e as CustomEvent<string>).detail);
    window.addEventListener("request-service", onReq);
    return () => window.removeEventListener("request-service", onReq);
  }, []);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setState("ok");
      form.reset();
      setTopic("");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <div className="space-y-3">
        <p className="text-muted">{t("contact.intro")}</p>
        <ul className="space-y-3 pt-2">
          {contactLinks(contacts).map((l) => (
            <li key={l.key}>
              <a href={l.href} target={l.href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer" className="card card-hover flex items-center gap-4 p-4">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent/10 text-accent">
                  <Icon name={l.icon} />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-muted">{t(l.key)}</span>
                  <span className="block truncate font-medium">{l.label}</span>
                </span>
              </a>
            </li>
          ))}
          <li className="card flex items-center gap-4 p-4">
            <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-accent2/10 text-accent2">
              <Icon name="pin" />
            </span>
            <span>
              <span className="block text-xs text-muted">{t("contact.location")}</span>
              <span className="block font-medium">{tr(location, locale)}</span>
            </span>
          </li>
        </ul>
      </div>

      <form onSubmit={submit} className="card space-y-4 p-5 md:p-6" noValidate={false}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-name" className="label">{t("form.name")}</label>
            <input id="cf-name" name="name" required maxLength={120} autoComplete="name" className="input" />
          </div>
          <div>
            <label htmlFor="cf-email" className="label">{t("form.email")}</label>
            <input id="cf-email" name="email" type="email" required maxLength={160} autoComplete="email" className="input" />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-org" className="label">{t("form.organization")}</label>
            <input id="cf-org" name="organization" maxLength={160} autoComplete="organization" className="input" />
          </div>
          <div>
            <label htmlFor="cf-topic" className="label">{t("form.service")}</label>
            <select id="cf-topic" name="service" value={topic} onChange={(e) => setTopic(e.target.value)} className="input">
              <option value="">{t("form.general")}</option>
              {services.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="cf-msg" className="label">{t("form.message")}</label>
          <textarea id="cf-msg" name="message" required minLength={10} maxLength={5000} rows={6} className="input resize-y" />
        </div>
        {/* Honeypot: real visitors never see or fill this field. */}
        <div className="hidden" aria-hidden="true">
          <label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted">{t("form.privacy")}</p>
          <button type="submit" className="btn-primary" disabled={state === "sending"}>
            <Icon name="mail" className="h-4 w-4" />
            {state === "sending" ? t("form.sending") : t("form.send")}
          </button>
        </div>
        <p aria-live="polite" className="text-sm">
          {state === "ok" && <span className="text-accent2">{t("form.success")}</span>}
          {state === "error" && (
            <span className="text-red-400">
              {t("form.error")} {contacts.email && <a className="underline" href={`mailto:${contacts.email}`}>{contacts.email}</a>}
            </span>
          )}
        </p>
      </form>
    </div>
  );
}
