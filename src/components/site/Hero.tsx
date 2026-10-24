"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Icon from "@/components/Icon";
import { useI18n } from "@/components/I18nProvider";
import TopoCanvas from "./TopoCanvas";
import { DEMO_POINTS, toDMS } from "@/components/map/layers";

const HeroMap = dynamic(() => import("@/components/map/HeroMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-bg2" />,
});

type Props = {
  name: string;
  headline: string;
  subtitle: string;
  tagline: string;
  roles: string[];
  years: number;
  cvHref: string;
};

export default function Hero({ name, headline, subtitle, tagline, roles, years, cvHref }: Props) {
  const { locale, t } = useI18n();
  const [cursor, setCursor] = useState<[number, number] | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((v) => v + 1), 2600);
    return () => clearInterval(id);
  }, []);

  const place = DEMO_POINTS[tick % DEMO_POINTS.length];
  const [lat, lng] = cursor ?? [place.lat, place.lng];
  const role = roles.length ? roles[tick % roles.length] : "";

  return (
    <section className="relative isolate overflow-hidden pt-16" aria-labelledby="hero-title">
      <div className="grid-bg absolute inset-0 -z-20" />
      <TopoCanvas className="absolute inset-0 -z-10 h-full w-full" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,rgb(var(--accent)/0.12),transparent_55%),radial-gradient(ellipse_at_bottom_right,rgb(var(--accent2)/0.10),transparent_50%)]" />

      <div className="container grid min-h-[calc(100svh-4rem)] items-center gap-10 py-14 lg:grid-cols-[1.05fr_1fr] lg:py-20">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
          <p className="kicker mb-5 flex items-center gap-2">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-accent2" />
            {headline}
          </p>
          <h1 id="hero-title" className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
            {name}
          </h1>
          <p className="mt-4 font-display text-xl font-semibold text-accent sm:text-2xl">{t("hero.years", { years })}</p>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">{subtitle}</p>

          <div className="mt-5 h-6 font-mono text-sm text-fg/80" aria-live="polite">
            <motion.span key={role} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2">
              <span className="text-accent2">▸</span> {role}
            </motion.span>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`/${locale}#projects`} className="btn-primary">
              {t("hero.viewProjects")} <Icon name="arrow-right" className="h-4 w-4" />
            </a>
            <a href={cvHref} className="btn-ghost">
              <Icon name="download" className="h-4 w-4" /> {t("hero.downloadCv")}
            </a>
            <a href={`/${locale}#contact`} className="btn-ghost">
              <Icon name="mail" className="h-4 w-4" /> {t("hero.contact")}
            </a>
          </div>
          <p className="mt-8 max-w-xl border-l-2 border-accent/50 pl-4 text-sm italic text-muted">{tagline}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="relative"
        >
          <div className="card overflow-hidden p-1.5 shadow-glow">
            <div className="relative h-[340px] overflow-hidden rounded-xl sm:h-[420px] lg:h-[480px]">
              <HeroMap onMove={(a, b) => setCursor([a, b])} />
              <div className="pointer-events-none absolute left-3 top-3 z-[500] rounded-lg bg-bg/80 px-3 py-2 font-mono text-[11px] leading-5 text-fg backdrop-blur">
                <div className="text-accent">{cursor ? t("hero.coords") : place.name}</div>
                <div>{toDMS(lat, "N", "S")}</div>
                <div>{toDMS(lng, "E", "W")}</div>
              </div>
              <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-md bg-bg/80 px-2 py-1 font-mono text-[10px] uppercase tracking-widest text-muted backdrop-blur">
                {t("hero.mapCaption")}
              </div>
            </div>
          </div>
          <Link href={`/${locale}/gis-lab`} className="absolute -bottom-4 right-4 z-10 inline-flex items-center gap-2 rounded-full bg-accent2 px-4 py-2 text-xs font-semibold text-[#0B1220] shadow-lg transition hover:brightness-110">
            <Icon name="layers" className="h-4 w-4" /> {t("lab.open")}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
