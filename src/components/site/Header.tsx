"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Icon from "@/components/Icon";
import { useI18n } from "@/components/I18nProvider";
import { LOCALE_LABELS, LOCALE_NAMES, type DictKey } from "@/lib/i18n";
import { LOCALES, type Locale } from "@/lib/types";
import { cn } from "@/lib/utils";

const NAV: { key: DictKey; hash: string }[] = [
  { key: "nav.about", hash: "about" },
  { key: "nav.experience", hash: "experience" },
  { key: "nav.projects", hash: "projects" },
  { key: "nav.certificates", hash: "certificates" },
  { key: "nav.skills", hash: "skills" },
  { key: "nav.portfolio", hash: "portfolio" },
  { key: "nav.services", hash: "services" },
  { key: "nav.contact", hash: "contact" },
];

export function ThemeToggle() {
  const { t } = useI18n();
  const [dark, setDark] = useState(true);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      /* storage unavailable */
    }
  };
  return (
    <button type="button" onClick={toggle} className="rounded-lg p-2 text-muted transition hover:bg-fg/5 hover:text-accent" aria-label={t("nav.theme")} title={t("nav.theme")}>
      <Icon name={dark ? "sun" : "moon"} />
    </button>
  );
}

function LanguageSwitcher({ locale, pathname }: { locale: Locale; pathname: string }) {
  const { t } = useI18n();
  const rest = pathname.replace(/^\/(en|ru|ky)(?=\/|$)/, "");
  return (
    <div role="group" aria-label={t("nav.language")} className="flex rounded-lg border border-line/20 p-0.5 text-xs font-semibold">
      {(["ky", "ru", "en"] as Locale[]).filter((l) => LOCALES.includes(l)).map((l) => (
        <Link
          key={l}
          href={`/${l}${rest}`}
          hrefLang={l}
          lang={l}
          title={LOCALE_NAMES[l]}
          aria-current={l === locale ? "true" : undefined}
          onClick={() => {
            document.cookie = `lang=${l}; path=/; max-age=31536000; samesite=lax`;
          }}
          className={cn("rounded-md px-2 py-1 transition", l === locale ? "bg-accent text-[#0B1220]" : "text-muted hover:text-fg")}
        >
          {LOCALE_LABELS[l]}
        </Link>
      ))}
    </div>
  );
}

export default function Header({ name }: { name: string }) {
  const { locale, t } = useI18n();
  const pathname = usePathname() || `/${locale}`;
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);

  const home = `/${locale}`;
  return (
    <header className={cn("no-print fixed inset-x-0 top-0 z-50 transition-all", scrolled || open ? "glass border-x-0 border-t-0" : "border-b border-transparent")}>
      <div className="container flex h-16 items-center gap-4">
        <Link href={home} className="flex items-center gap-2.5 font-display font-bold tracking-tight" aria-label={name}>
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent/15 text-accent ring-1 ring-accent/40">
            <Icon name="crosshair" className="h-4 w-4" />
          </span>
          <span className="hidden sm:inline">{name}</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 xl:flex" aria-label="Main">
          {NAV.map((n) => (
            <a key={n.hash} href={`${home}#${n.hash}`} className="rounded-lg px-2.5 py-1.5 text-sm text-muted transition hover:text-fg">
              {t(n.key)}
            </a>
          ))}
          <Link href={`${home}/gis-lab`} className="ml-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold text-accent ring-1 ring-accent/30 transition hover:bg-accent/10">
            {t("nav.gisLab")}
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-2 xl:ml-3">
          <LanguageSwitcher locale={locale} pathname={pathname} />
          <ThemeToggle />
          <button type="button" className="rounded-lg p-2 text-muted hover:text-fg xl:hidden" onClick={() => setOpen((v) => !v)} aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? t("nav.close") : t("nav.menu")}>
            <Icon name={open ? "x" : "menu"} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden xl:hidden"
            aria-label="Mobile"
          >
            <div className="container grid gap-1 pb-4 sm:grid-cols-2">
              {NAV.map((n) => (
                <a key={n.hash} href={`${home}#${n.hash}`} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-muted hover:bg-fg/5 hover:text-fg">
                  {t(n.key)}
                </a>
              ))}
              <Link href={`${home}/gis-lab`} className="rounded-lg px-3 py-2.5 text-sm font-semibold text-accent hover:bg-accent/10">
                {t("nav.gisLab")}
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
