import { motion, useReducedMotion } from "framer-motion";
import { Section, SectionHeader } from "./Section";
import { useIsMobile } from "../../hooks/useIsMobile";
import { SmoothReveal } from "../SmoothReveal";
import { useTranslation } from "../../lib/i18n";

export function Skills() {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const { t, tObject } = useTranslation();

  const skills = tObject<{ name: string; value: number }[]>("skills.list");

  return (
    <Section id="skills" className="overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-1/4 h-80 w-80 rounded-full bg-gold/8 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-glow/10 blur-3xl" />
      </div>

      <SectionHeader
        eyebrow={t("skills.eyebrow")}
        title={
          <>
            {t("skills.title1")}{" "}
            <span className="text-gradient-gold">{t("skills.title2")}</span>
          </>
        }
        description={t("skills.description")}
      />

      <SmoothReveal direction="up" className="max-w-4xl mx-auto">
        <div className="rounded-3xl glass p-8 sm:p-10">
          <div className="grid md:grid-cols-2 gap-x-8 gap-y-5">
            {skills.map((s, i) => (
              <motion.div
                key={s.name}
                initial={prefersReduced ? undefined : { opacity: 0, y: 12 }}
                whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: i * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group cursor-default"
              >
                <div className="flex justify-between items-center mb-2.5">
                  <span className="text-sm font-medium text-foreground/90 group-hover:text-gold transition-colors duration-300">
                    {s.name}
                  </span>
                  <span className="text-xs font-display text-gold tabular-nums">
                    {s.value}%
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-muted/30 overflow-hidden transition-shadow duration-300 group-hover:shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.value}%` }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 1.2,
                      delay: 0.3 + i * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-glow via-gold to-emerald-glow"
                    style={{ backgroundSize: "200% 100%" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </SmoothReveal>
    </Section>
  );
}
