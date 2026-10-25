import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Icon from "@/components/Icon";
import { DocumentsBlock, Gallery, MapBlock } from "@/components/site/MediaBlocks";
import { getPublicContent } from "@/lib/content";
import { getDictionary, isLocale, tr, type DictKey } from "@/lib/i18n";
import { LOCALES } from "@/lib/types";

type Props = { params: Promise<{ lang: string; slug: string }> };

export async function generateStaticParams() {
  const c = await getPublicContent();
  return LOCALES.flatMap((lang) => c.portfolio.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return {};
  const p = (await getPublicContent()).portfolio.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: tr(p.title, lang),
    description: tr(p.summary, lang),
    alternates: { canonical: `/${lang}/portfolio/${slug}`, languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/portfolio/${slug}`])) },
  };
}

export default async function PortfolioItemPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const content = await getPublicContent();
  const item = content.portfolio.find((x) => x.slug === slug);
  if (!item) notFound();
  const t = getDictionary(lang, content.uiOverrides);
  const project = content.projects.find((p) => p.slug === item.projectSlug);

  return (
    <article className="pb-20 pt-28">
      <div className="container max-w-5xl">
        <Link href={`/${lang}/portfolio`} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-accent">
          <Icon name="arrow-left" className="h-4 w-4" /> {t["portfolio.back"]}
        </Link>
        <p className="kicker mt-6">{t[`cat.${item.category}` as DictKey] ?? item.category} · {item.year}</p>
        <h1 className="mt-3 font-display text-3xl font-bold leading-tight md:text-5xl">{tr(item.title, lang)}</h1>
        <p className="mt-5 text-lg text-muted">{tr(item.summary, lang)}</p>

        <div className="mt-10 space-y-6">
          <section className="card space-y-4 p-6 leading-relaxed">
            {tr(item.body, lang)
              .split(/\n\s*\n/)
              .filter(Boolean)
              .map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            {project && (
              <p className="border-t border-line/10 pt-4 text-sm">
                <span className="text-muted">{t["portfolio.related"]}: </span>
                <Link href={`/${lang}/projects/${project.slug}`} className="text-accent hover:underline">{tr(project.title, lang)}</Link>
              </p>
            )}
          </section>
          {item.documents && item.documents.length > 0 && <DocumentsBlock documents={item.documents} title={t["portfolio.atlases"]} />}
          {(item.images.length > 0 || !item.documents?.length) && (
            <Gallery images={item.images} title={t["portfolio.materials"]} emptyText={t["portfolio.noMaterials"]} />
          )}
          <MapBlock settings={item.map} title={t["projects.map"]} />
        </div>
      </div>
    </article>
  );
}
