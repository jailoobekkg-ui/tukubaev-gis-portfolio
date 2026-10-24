"use client";

import Link from "next/link";
import Icon from "@/components/Icon";
import { useI18n } from "@/components/I18nProvider";

export default function Footer({ name, email }: { name: string; email: string }) {
  const { locale, t } = useI18n();
  return (
    <footer className="no-print border-t border-line/10 py-10">
      <div className="container flex flex-col gap-4 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <div>
          <p>
            © {new Date().getFullYear()} {name}. {t("footer.rights")}
          </p>
          <p className="mt-1 text-xs opacity-80">{t("footer.disclaimer")}</p>
        </div>
        <div className="flex items-center gap-4">
          {email && (
            <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 hover:text-accent">
              <Icon name="mail" className="h-4 w-4" /> {email}
            </a>
          )}
          <Link href={`/${locale}/gis-lab`} className="hover:text-accent">
            {t("nav.gisLab")}
          </Link>
          <Link href="/admin" rel="nofollow" className="text-xs opacity-60 hover:text-accent hover:opacity-100">
            {t("footer.admin")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
