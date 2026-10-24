import Icon from "@/components/Icon";
import Section, { Reveal } from "./Section";
import { getDictionary, tr, trList } from "@/lib/i18n";
import type { Locale, SiteContent } from "@/lib/types";
import { formatRange, toYearFraction } from "@/lib/utils";

export default function About({ content, locale }: { content: SiteContent; locale: Locale }) {
  const t = getDictionary(locale, content.uiOverrides);
  const p = content.profile;
  const paragraphs = tr(p.bio, locale).split(/\n\s*\n/).filter(Boolean);

  // Career timeline: exact periods, parallel engagements stay on their own rows.
  const rows = [...content.experience]
    .map((e) => ({ e, s: toYearFraction(e.start, false), f: toYearFraction(e.end, true) }))
    .filter((r) => !Number.isNaN(r.s) && !Number.isNaN(r.f))
    .sort((a, b) => a.s - b.s);
  const min = Math.floor(Math.min(...rows.map((r) => r.s), p.careerStartYear));
  const max = Math.ceil(Math.max(...rows.map((r) => r.f), min + 1));
  const span = max - min || 1;
  const years = Array.from({ length: span + 1 }, (_, i) => min + i);

  return (
    <Section id="about" kicker={t["about.kicker"]} title={t["about.title"]}>
      <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
        <Reveal className="space-y-4 text-[1.05rem] leading-relaxed text-fg/90">
          {paragraphs.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </Reveal>
        <div className="space-y-5">
          <Reveal className="card p-5" delay={0.05}>
            <h3 className="mb-3 font-display font-semibold">{t["about.specializations"]}</h3>
            <ul className="space-y-2 text-sm">
              {trList(p.specializations, locale).map((s) => (
                <li key={s} className="flex gap-2.5">
                  <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-accent2" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="card p-5" delay={0.1}>
            <h3 className="mb-3 font-display font-semibold">{t["about.languages"]}</h3>
            <dl className="grid grid-cols-3 gap-3 text-sm">
              {p.languages.map((l, i) => (
                <div key={i} className="rounded-xl border border-line/10 p-3">
                  <dt className="font-semibold">{tr(l.name, locale)}</dt>
                  <dd className="text-xs text-muted">{tr(l.level, locale)}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      {rows.length > 0 && (
        <Reveal className="card mt-10 p-5 md:p-6">
          <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="font-display font-semibold">{t["about.timeline"]}</h3>
            <p className="text-xs text-muted">{t["about.timelineNote"]}</p>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="relative ml-[38%] h-6 border-b border-line/15 text-[10px] text-muted">
                {years.map((y) => (
                  <span key={y} className="absolute -translate-x-1/2" style={{ left: `${((y - min) / span) * 100}%` }}>
                    {y}
                  </span>
                ))}
              </div>
              <ul className="mt-2 space-y-1.5">
                {rows.map(({ e, s, f }) => {
                  const parallel = rows.some((o) => o.e.id !== e.id && o.s < f && s < o.f);
                  return (
                    <li key={e.id} className="flex items-center gap-3 text-xs">
                      <div className="w-[38%] shrink-0 truncate pr-2 text-right" title={tr(e.organization, locale)}>
                        <span className="font-medium">{tr(e.position, locale)}</span>
                        <span className="text-muted"> · {tr(e.organization, locale)}</span>
                      </div>
                      <div className="relative h-5 flex-1 rounded bg-fg/[0.04]">
                        {years.map((y) => (
                          <span key={y} className="absolute inset-y-0 w-px bg-line/10" style={{ left: `${((y - min) / span) * 100}%` }} />
                        ))}
                        <span
                          className={`absolute inset-y-0.5 rounded ${parallel ? "bg-accent2/70" : "bg-accent/80"}`}
                          style={{ left: `${((s - min) / span) * 100}%`, width: `${Math.max(((f - s) / span) * 100, 0.8)}%` }}
                          title={`${formatRange(e.start, e.end, locale)}${parallel ? ` · ${t["experience.parallel"]}` : ""}`}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 flex gap-4 pl-[38%] text-[11px] text-muted">
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-4 rounded bg-accent/80" />{t["nav.experience"]}</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-4 rounded bg-accent2/70" />{t["experience.parallel"]}</span>
              </div>
            </div>
          </div>
        </Reveal>
      )}
    </Section>
  );
}
