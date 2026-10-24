import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PrintButton from "@/components/site/PrintButton";
import { getPublicContent } from "@/lib/content";
import { getDictionary, isLocale, tr, trList } from "@/lib/i18n";
import { formatRange, toYearFraction } from "@/lib/utils";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const c = await getPublicContent();
  return { title: `CV — ${tr(c.profile.name, lang)}`, alternates: { canonical: `/${lang}/cv` } };
}

/** Printable CV generated from site content (no date of birth, address or document numbers). */
export default async function CvPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const c = await getPublicContent();
  const t = getDictionary(lang, c.uiOverrides);
  const p = c.profile;
  const exp = [...c.experience].sort((a, b) => toYearFraction(b.start, false) - toYearFraction(a.start, false));

  const H = ({ children }: { children: React.ReactNode }) => (
    <h2 className="mb-3 mt-8 border-b border-line/20 pb-1 font-display text-sm font-bold uppercase tracking-widest text-accent print:text-black">{children}</h2>
  );

  return (
    <div className="container max-w-4xl pb-20 pt-28 print:max-w-none print:p-0">
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-muted">{t["cv.note"]}</p>
        <PrintButton label={t["cv.print"]} />
      </div>
      <div className="card p-6 md:p-10 print:border-0 print:bg-white print:p-0 print:text-black print:shadow-none">
        <header>
          <h1 className="font-display text-3xl font-extrabold">{tr(p.fullName, lang)}</h1>
          <p className="mt-1 text-lg font-semibold text-accent print:text-black">{tr(p.headline, lang)}</p>
          <p className="mt-2 text-sm text-muted print:text-black">
            {p.roles.join(" · ")}
          </p>
          <p className="mt-2 text-sm">
            {c.contacts.email}
            {c.contacts.phone && ` · ${c.contacts.phone}`}
            {c.contacts.linkedin && ` · ${c.contacts.linkedin}`} · {tr(p.location, lang)}
          </p>
        </header>

        <H>{t["nav.about"]}</H>
        {tr(p.bio, lang).split(/\n\s*\n/).filter(Boolean).map((para, i) => (
          <p key={i} className="mb-2 text-sm leading-relaxed">{para}</p>
        ))}

        <H>{t["experience.title"]}</H>
        <ul className="space-y-3 text-sm">
          {exp.map((e) => (
            <li key={e.id} className="grid gap-1 sm:grid-cols-[150px_1fr] print:grid-cols-[150px_1fr]">
              <span className="font-mono text-xs text-muted print:text-black">{formatRange(e.start, e.end, lang)}</span>
              <span>
                <strong>{tr(e.position, lang)}</strong> — {tr(e.organization, lang)}
              </span>
            </li>
          ))}
        </ul>

        <H>{t["projects.kicker"]}</H>
        <ul className="space-y-4 text-sm">
          {c.projects.map((pr) => (
            <li key={pr.id} className="break-inside-avoid">
              <p>
                <strong>{tr(pr.title, lang)}</strong> ({pr.period})
              </p>
              <p className="text-muted print:text-black">
                {t["projects.client"]}: {tr(pr.client, lang)} · {t["projects.role"]}: {tr(pr.role, lang)}
              </p>
              <ul className="ml-5 mt-1 list-disc">
                {trList(pr.activities, lang).map((a) => <li key={a}>{a}</li>)}
              </ul>
            </li>
          ))}
        </ul>

        <H>{t["education.title"]}</H>
        {c.education.map((e) => (
          <p key={e.id} className="text-sm">
            <strong>{tr(e.institution, lang)}</strong>, {e.period}. {tr(e.specialty, lang)} — {tr(e.qualification, lang)}.{" "}
            {t["education.thesis"]}: “{tr(e.thesis, lang)}”.
          </p>
        ))}

        <H>{t["cv.training"]}</H>
        <ul className="ml-5 list-disc space-y-1 text-sm">
          {[...c.certificates].sort((a, b) => b.year - a.year).map((x) => (
            <li key={x.id}>
              {tr(x.title, lang)} — {tr(x.issuer, lang)}, {tr(x.date, lang)}
            </li>
          ))}
        </ul>

        <H>{t["skills.title"]}</H>
        <ul className="space-y-1 text-sm">
          {c.skills.map((s) => (
            <li key={s.id}>
              <strong>{tr(s.title, lang)}:</strong> {trList(s.items, lang).join(", ")}
            </li>
          ))}
        </ul>

        <H>{t["cv.languages"]}</H>
        <p className="text-sm">{p.languages.map((l) => `${tr(l.name, lang)} — ${tr(l.level, lang)}`).join(" · ")}</p>
      </div>
    </div>
  );
}
