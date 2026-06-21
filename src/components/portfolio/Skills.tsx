import { motion, useReducedMotion, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import { useEffect, useRef } from "react";
import { Section, SectionHeader } from "./Section";
import { SmoothReveal } from "../SmoothReveal";
import { useTranslation } from "../../lib/i18n";

function AnimatedPercentage({ to, delay }: { to: number; delay: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v));
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (inView) {
      if (prefersReduced) {
        mv.set(to);
        return;
      }
      const controls = animate(mv, to, { duration: 1.6, delay, ease: [0.16, 1, 0.3, 1] });
      return controls.stop;
    }
  }, [inView, to, delay, prefersReduced]);

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
    </span>
  );
}

export function Skills() {
  const prefersReduced = useReducedMotion();
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

      <SmoothReveal direction="up" className="max-w-5xl mx-auto">
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-5">
          {skills.map((s, i) => (
            <motion.div
              key={s.name}
              initial={prefersReduced ? undefined : { opacity: 0, y: 20, scale: 0.95 }}
              whileInView={prefersReduced ? undefined : { opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              whileHover={prefersReduced ? undefined : { y: -4, scale: 1.02 }}
              className="group relative rounded-2xl glass p-5 sm:p-6 border border-transparent hover:border-gold/25 transition-all duration-500"
            >
              <div className="absolute -top-px left-6 right-6 h-px bg-gradient-to-r from-transparent via-gold/0 to-transparent group-hover:via-gold/40 transition-all duration-700" />

              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline-flex text-[10px] font-display font-semibold text-gold/40 tabular-nums">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  <span className="text-sm sm:text-base font-medium text-foreground/90 group-hover:text-gold transition-colors duration-300">
                    {s.name}
                  </span>
                </div>
                <span className="text-lg sm:text-xl font-display font-bold text-gold tabular-nums">
                  <AnimatedPercentage to={s.value} delay={0.4 + i * 0.06} />
                  <span className="text-xs sm:text-sm font-medium text-gold/60">%</span>
                </span>
              </div>

              <div className="relative mt-3 h-3 sm:h-3.5 rounded-full bg-muted/15 overflow-hidden ring-1 ring-white/5 group-hover:ring-gold/20 transition-all duration-500">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${s.value}%` }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 1.4,
                    delay: 0.2 + i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative h-full rounded-full"
                  style={{
                    background: "linear-gradient(135deg, var(--emerald-glow), var(--gold), var(--emerald-glow))",
                    backgroundSize: "200% 100%",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent)",
                      backgroundSize: "200% 100%",
                    }}
                    animate={
                      prefersReduced
                        ? undefined
                        : { backgroundPosition: ["200% 0%", "-200% 0%"] }
                    }
                    transition={{
                      duration: 3,
                      delay: 1.8 + i * 0.06,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  <motion.div
                    className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full"
                    style={{
                      background: "radial-gradient(circle, var(--gold) 0%, transparent 70%)",
                      opacity: 0.4,
                      filter: "blur(8px)",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </SmoothReveal>
    </Section>
  );
}
