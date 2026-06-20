import type { ReactNode } from "react";
import { SmoothReveal } from "../SmoothReveal";

export function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <SmoothReveal direction="up" className="mx-auto max-w-2xl text-center mb-10 sm:mb-14">
      <div className="inline-flex items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 glass-gold text-[9px] sm:text-[10px] uppercase tracking-[0.15em] sm:tracking-[0.25em] text-gold mb-5">
        <span className="h-1 w-1 shrink-0 rounded-full bg-gold" />
        <span className="truncate">{eyebrow}</span>
      </div>
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight">{title}</h2>
      {description && (
        <p className="mt-4 text-sm sm:text-base lg:text-lg text-muted-foreground">{description}</p>
      )}
    </SmoothReveal>
  );
}

export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={`relative py-20 sm:py-24 lg:py-32 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
    </section>
  );
}
