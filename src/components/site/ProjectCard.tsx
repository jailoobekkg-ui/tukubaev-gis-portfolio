import Link from "next/link";
import Icon from "@/components/Icon";
import type { Dict } from "@/lib/i18n";
import { tr } from "@/lib/i18n";
import type { Locale, Project } from "@/lib/types";

/** Topographic placeholder artwork so cards look finished before photos are uploaded. */
export function TopoArt({ seed = 1, className = "" }: { seed?: number; className?: string }) {
  const rings = Array.from({ length: 7 }, (_, i) => i);
  const cx = 60 + ((seed * 37) % 180);
  const cy = 40 + ((seed * 53) % 80);
  return (
    <svg viewBox="0 0 320 160" className={className} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <rect width="320" height="160" fill="rgb(var(--bg2))" />
      {rings.map((i) => (
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={18 + i * 26}
          ry={10 + i * 15}
          transform={`rotate(${(seed * 23) % 40 - 20} ${cx} ${cy})`}
          fill="none"
          stroke="rgb(var(--accent))"
          strokeOpacity={i % 3 === 0 ? 0.45 : 0.2}
          strokeWidth={i % 3 === 0 ? 1.4 : 0.8}
        />
      ))}
      <circle cx={cx} cy={cy} r="3" fill="rgb(var(--accent2))" />
    </svg>
  );
}

export default function ProjectCard({ project, locale, t, index }: { project: Project; locale: Locale; t: Dict; index: number }) {
  const cover = project.images[0] || (project.documents?.[0] ? `${project.documents[0].base}/page-01-thumb.jpg` : "");
  return (
    <article className="card card-hover group flex h-full flex-col overflow-hidden">
      <div className="relative h-40 overflow-hidden">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={cover} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <TopoArt seed={index + 3} className="h-full w-full" />
        )}
        <span className="absolute left-3 top-3 rounded-md bg-bg/80 px-2 py-1 font-mono text-xs text-accent backdrop-blur">{project.period}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold leading-snug">{tr(project.title, locale)}</h3>
        <dl className="mt-3 space-y-1 text-sm">
          <div className="flex gap-2">
            <dt className="shrink-0 text-muted">{t["projects.client"]}:</dt>
            <dd>{tr(project.client, locale)}</dd>
          </div>
          <div className="flex gap-2">
            <dt className="shrink-0 text-muted">{t["projects.role"]}:</dt>
            <dd>{tr(project.role, locale)}</dd>
          </div>
        </dl>
        <p className="mt-3 line-clamp-3 text-sm text-muted">{tr(project.summary, locale)}</p>
        {project.technologies.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 5).map((x) => (
              <span key={x} className="chip">{x}</span>
            ))}
          </div>
        )}
        <Link href={`/${locale}/projects/${project.slug}`} className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-accent hover:underline">
          {t["projects.viewDetails"]} <Icon name="arrow-right" className="h-4 w-4" />
        </Link>
      </div>
    </article>
  );
}
