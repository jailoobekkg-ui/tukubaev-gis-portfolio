import type { MetadataRoute } from "next";
import { getPublicContent } from "@/lib/content";
import { LOCALES } from "@/lib/types";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const c = await getPublicContent();
  const paths = [
    "",
    "/gis-lab",
    "/portfolio",
    "/cv",
    ...c.projects.map((p) => `/projects/${p.slug}`),
    ...c.portfolio.map((p) => `/portfolio/${p.slug}`),
  ];
  return paths.flatMap((p) =>
    LOCALES.map((lang) => ({
      url: `${base}/${lang}${p}`,
      changeFrequency: "monthly" as const,
      priority: p === "" ? 1 : 0.7,
      alternates: { languages: Object.fromEntries(LOCALES.map((l) => [l, `${base}/${l}${p}`])) },
    })),
  );
}
