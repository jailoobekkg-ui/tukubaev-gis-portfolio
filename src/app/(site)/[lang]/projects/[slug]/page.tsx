import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { DocumentsBlock, Gallery, MapBlock } from "@/components/site/MediaBlocks";
import { getPublicContent } from "@/lib/content";
import { getDictionary, isLocale, tr, trList } from "@/lib/i18n";
import { LOCALES } from "@/lib/types";
import { hasOwnMap } from "@/lib/utils";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams() {
  const c = await getPublicContent();
  return LOCALES.flatMap((lang) => c.projects.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const p = (await getPublicContent()).projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: tr(p.title, lang),
    description: tr(p.summary, lang),
    alternates: { canonical: `/${lang}/projects/${slug}`, languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/projects/${slug}`])) },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const content = await getPublicContent();
  const p = content.projects.find((x) => x.slug === slug);
  if (!p) notFound();
  const t = getDictionary(lang, content.uiOverrides);
  const others = content.projects.filter((x) => x.slug !== slug).slice(0, 3);
  const related = content.portfolio.filter((x) => x.projectSlug === slug);

  const facts = [
    { k: t["projects.client"], v: tr(p.client, lang), icon: "building" },
    { k: t["projects.organization"], v: tr(p.organization, lang), icon: "briefcase" },
    { k: t["projects.role"], v: tr(p.role, lang), icon: "user" },
    { k: t["projects.period"], v: p.period, icon: "calendar" },
    { k: t["projects.location"], v: tr(p.location, lang), icon: "pin" },
  ].filter((f) => f.v);

  return (
    <article className="pb-20 pt-28">
      <div className="container">
        <Link href={`/${lang}#projects`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent">
          <Icon name="arrow-left" className="h-4 w-4" /> {t["projects.back"]}
        </Link>
        <p className="kicker mt-6">{t["projects.kicker"]}</p>
        <h1 className="mt-3 max-w-4xl font-display text-3xl font-bold leading-tight md:text-5xl">{tr(p.title, lang)}</h1>
        <p className="mt-5 max-w-3xl text-lg text-muted">{tr(p.summary, lang)}</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <section className="card p-6">
              <h2 className="mb-4 font-display text-lg font-semibold">{t["projects.activities"]}</h2>
              <ul className="space-y-2.5">
                {trList(p.activities, lang).map((a) => (
                  <li key={a} className="flex gap-3">
                    <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent2" />
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </section>
            {p.documents && p.documents.length > 0 && <DocumentsBlock documents={p.documents} title={t["projects.basinMaps"]} kind="maps" />}
            {p.images.length > 0 && <Gallery images={p.images} title={t["projects.gallery"]} emptyText={t["projects.noImages"]} />}
            {hasOwnMap(p.map) && <MapBlock settings={p.map} title={t["projects.map"]} />}
          </div>

          <aside className="space-y-6">
            <dl className="card space-y-4 p-6">
              {facts.map((f) => (
                <div key={f.k} className="flex gap-3">
                  <Icon name={f.icon} className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <div>
                    <dt className="text-xs text-muted">{f.k}</dt>
                    <dd className="text-sm font-medium">{f.v}</dd>
                  </div>
                </div>
              ))}
            </dl>
            {p.technologies.length > 0 && (
              <div className="card p-6">
                <h2 className="mb-3 text-sm font-semibold">{t["projects.technologies"]}</h2>
                <div className="flex flex-wrap gap-2">
                  {p.technologies.map((x) => <span key={x} className="chip">{x}</span>)}
                </div>
              </div>
            )}
            {related.length > 0 && (
              <div className="card p-6">
                <h2 className="mb-3 text-sm font-semibold">{t["portfolio.title"]}</h2>
                <ul className="space-y-2 text-sm">
                  {related.map((r) => (
                    <li key={r.id}>
                      <Link href={`/${lang}/portfolio/${r.slug}`} className="text-accent hover:underline">{tr(r.title, lang)}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-xs text-muted">{t["projects.disclaimer"]}</p>
          </aside>
        </div>

        {others.length > 0 && (
          <section className="mt-16">
            <h2 className="mb-5 font-display text-xl font-semibold">{t["projects.other"]}</h2>
            <ul className="grid gap-4 md:grid-cols-3">
              {others.map((o) => (
                <li key={o.id}>
                  <Link href={`/${lang}/projects/${o.slug}`} className="card card-hover block h-full p-5">
                    <p className="font-mono text-xs text-accent">{o.period}</p>
                    <p className="mt-1 font-medium leading-snug">{tr(o.title, lang)}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  );
}
