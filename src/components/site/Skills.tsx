import Icon from "@/components/Icon";
import { Reveal } from "./Section";
import { tr, trList } from "@/lib/i18n";
import type { Locale, SkillGroup } from "@/lib/types";

export default function Skills({ groups, locale }: { groups: SkillGroup[]; locale: Locale }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {groups.map((g, i) => (
        <Reveal key={g.id} delay={i * 0.05}>
          <div className="card card-hover h-full p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                <Icon name={g.icon} />
              </span>
              <h3 className="font-display text-lg font-semibold">{tr(g.title, locale)}</h3>
            </div>
            <ul className="flex flex-wrap gap-2">
              {trList(g.items, locale).map((s) => (
                <li key={s} className="rounded-lg border border-line/15 bg-fg/[0.03] px-2.5 py-1 text-sm">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      ))}
    </div>
  );
}
