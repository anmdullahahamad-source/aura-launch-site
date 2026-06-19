import { motion } from "framer-motion";
import type { ReactNode } from "react";

export function SectionHeader({ eyebrow, title, description }: { eyebrow: string; title: ReactNode; description?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto max-w-2xl text-center mb-14"
    >
      <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 glass-gold text-[10px] uppercase tracking-[0.25em] text-gold mb-5">
        <span className="h-1 w-1 rounded-full bg-gold" />
        {eyebrow}
      </div>
      <h2 className="font-display text-4xl sm:text-5xl font-semibold leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-muted-foreground text-base sm:text-lg">{description}</p>
      )}
    </motion.div>
  );
}

export function Section({ id, children, className = "" }: { id?: string; children: ReactNode; className?: string }) {
  return (
    <section id={id} className={`relative py-24 sm:py-32 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6">{children}</div>
    </section>
  );
}
