import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../../globals.css";
import { I18nProvider } from "@/components/I18nProvider";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { getPublicContent } from "@/lib/content";
import { inter, manrope, themeScript } from "@/lib/fonts";
import { getDictionary, HTML_LANG, isLocale, OG_LOCALE, tr } from "@/lib/i18n";
import { LOCALES } from "@/lib/types";
import { siteUrl } from "@/lib/utils";

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> };

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0B1220" },
    { media: "(prefers-color-scheme: light)", color: "#FAF6EE" },
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const content = await getPublicContent();
  const dict = getDictionary(lang, content.uiOverrides);
  const title = dict["meta.title"];
  const description = dict["meta.description"];
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: title, template: `%s · ${tr(content.profile.name, lang)}` },
    description,
    keywords: ["GIS", "GIS Expert", "Remote Sensing", "Cadastre", "Land Surveying", "Web GIS", "Kyrgyzstan", "QGIS", "ArcGIS", "Google Earth Engine"],
    authors: [{ name: tr(content.profile.name, "en") }],
    alternates: {
      canonical: `/${lang}`,
      languages: { en: "/en", ru: "/ru", ky: "/ky", "x-default": "/en" },
    },
    openGraph: {
      type: "profile",
      title,
      description,
      locale: OG_LOCALE[lang],
      url: `/${lang}`,
      siteName: tr(content.profile.name, lang),
    },
    twitter: { card: "summary", title, description },
    robots: { index: true, follow: true },
    icons: { icon: "/favicon.svg" },
  };
}

export default async function SiteLayout({ children, params }: Props) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const content = await getPublicContent();
  const dict = getDictionary(lang, content.uiOverrides);

  return (
    <html lang={HTML_LANG[lang]} className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans">
        <I18nProvider locale={lang} dict={dict}>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-accent focus:px-4 focus:py-2 focus:text-[#0B1220]">
            {dict["nav.skip"]}
          </a>
          <Header name={tr(content.profile.name, lang)} />
          <main id="main">{children}</main>
          <Footer name={tr(content.profile.name, lang)} email={content.contacts.email} />
        </I18nProvider>
      </body>
    </html>
  );
}
