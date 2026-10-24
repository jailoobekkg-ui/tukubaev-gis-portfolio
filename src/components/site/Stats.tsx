import { Reveal } from "./Section";
import Icon from "@/components/Icon";

const ICONS = ["calendar", "building", "satellite", "map"];

export default function Stats({ items }: { items: { title: string; text: string }[] }) {
  return (
    <section aria-label="Highlights" className="relative -mt-6 pb-6">
      <div className="container grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((s, i) => (
          <Reveal key={i} delay={i * 0.08}>
            <div className="card card-hover h-full p-5">
              <div className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent">
                <Icon name={ICONS[i % ICONS.length]} />
              </div>
              <p className="font-display text-lg font-bold leading-tight">{s.title}</p>
              <p className="mt-1.5 text-sm text-muted">{s.text}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
