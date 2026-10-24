import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PortfolioGrid from "@/components/site/PortfolioGrid";
import { getPublicContent } from "@/lib/content";
import { getDictionary, isLocale } from "@/lib/i18n";
import { LOCALES } from "@/lib/types";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang, (await getPublicContent()).uiOverrides);
  return {
    title: t["portfolio.title"],
    description: t["portfolio.intro"],
    alternates: { canonical: `/${lang}/portfolio`, languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/portfolio`])) },
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = await getPublicContent();
  const t = getDictionary(lang, content.uiOverrides);
  return (
    <div className="container pb-20 pt-28">
      <p className="kicker">{t["portfolio.kicker"]}</p>
      <h1 className="h2 mt-3">{t["portfolio.title"]}</h1>
      <p className="mb-10 mt-4 max-w-3xl text-muted">{t["portfolio.intro"]}</p>
      <PortfolioGrid items={content.portfolio} />
    </div>
  );
}
