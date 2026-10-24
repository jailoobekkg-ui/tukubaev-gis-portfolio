import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GisLab from "@/components/map/GisLab";
import { getPublicContent } from "@/lib/content";
import { getDictionary, isLocale } from "@/lib/i18n";
import { LOCALES } from "@/lib/types";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const t = getDictionary(lang, (await getPublicContent()).uiOverrides);
  return {
    title: t["lab.title"],
    description: t["lab.intro"],
    alternates: { canonical: `/${lang}/gis-lab`, languages: Object.fromEntries(LOCALES.map((l) => [l, `/${l}/gis-lab`])) },
  };
}

export default async function GisLabPage({ params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return (
    <div className="pt-16">
      <GisLab />
    </div>
  );
}
