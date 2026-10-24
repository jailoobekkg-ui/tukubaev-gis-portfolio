"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function Section({
  id,
  kicker,
  title,
  intro,
  children,
  className,
  action,
}: {
  id: string;
  kicker: string;
  title: string;
  intro?: string;
  children: React.ReactNode;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={cn("relative py-20 md:py-24", className)}>
      <div className="container">
        <Reveal className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="kicker mb-3">{kicker}</p>
            <h2 id={`${id}-title`} className="h2">
              {title}
            </h2>
            {intro && <p className="mt-4 text-muted">{intro}</p>}
          </div>
          {action}
        </Reveal>
        {children}
      </div>
    </section>
  );
}
