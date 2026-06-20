import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { Section, SectionHeader } from "./Section";
import { Users, GraduationCap, Briefcase, HeartHandshake, Quote } from "lucide-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { GhostIcon } from "../GhostIcon";
import { GhostMode } from "../GhostMode";
import { SmoothReveal } from "../SmoothReveal";
import { useTranslation } from "../../lib/i18n";

const pillars = [
  { Icon: Users, key: "leadership" },
  { Icon: GraduationCap, key: "education" },
  { Icon: Briefcase, key: "professional" },
  { Icon: HeartHandshake, key: "community" },
];

export function About() {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const [ghostActive, setGhostActive] = useState(false);
  const { t } = useTranslation();

  return (
    <Section id="about">
      <div className="flex items-start gap-3 mb-6">
        <GhostIcon onActivate={() => setGhostActive(true)} />
      </div>

      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-emerald-glow/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-gold/8 blur-3xl" />
      </div>

      <SectionHeader
        eyebrow={t("about.eyebrow")}
        title={
          <>
            {t("about.title1")} <span className="text-gradient-gold">{t("about.title2")}</span>
          </>
        }
        description={t("about.description")}
      />

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-10 lg:gap-16 items-start">
        <div className="space-y-5 sm:space-y-6">
          <SmoothReveal direction="up" className="relative pl-6 sm:pl-8">
            <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-gold via-gold/40 to-transparent" />
            <div className="absolute left-0 top-0 w-px h-16 bg-gold" />
            <div className="text-xs uppercase tracking-[0.25em] text-gold mb-3">
              {t("about.profile")}
            </div>
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground">
              {t("about.para1part1")}
              <span className="text-foreground font-semibold">{t("about.para1em1")}</span>
              {t("about.para1part2")}
              <span className="text-gold font-medium">{t("about.para1em2")}</span>
              {t("about.para1part3")}
              <span className="text-gold font-medium">{t("about.para1em3")}</span>
              {t("about.para1part4")}
              <span className="text-gold font-medium">{t("about.para1em4")}</span>
              {t("about.para1part5")}
              <span className="text-gold font-medium">{t("about.para1em5")}</span>
              {t("about.para1part6")}
              <span className="text-gold font-medium">{t("about.para1em6")}</span>
              {t("about.para1part7")}
            </p>
          </SmoothReveal>

          <SmoothReveal direction="up" delay={0.08} className="pl-6 sm:pl-8">
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground">
              {t("about.para2part1")}
              <span className="text-gold font-medium">{t("about.para2em1")}</span>
              {t("about.para2part2")}
              <span className="text-gold font-medium">{t("about.para2em2")}</span>
              {t("about.para2part3")}
            </p>
          </SmoothReveal>

          <SmoothReveal direction="up" delay={0.16} className="pl-6 sm:pl-8">
            <p className="text-sm sm:text-base lg:text-lg leading-relaxed text-muted-foreground">
              {t("about.para3")}
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px flex-1 bg-border/50 max-w-16" />
              <Quote className="h-3 w-3 text-gold/40" />
              <span className="italic">{t("about.tagline")}</span>
            </div>
          </SmoothReveal>
        </div>

        <SmoothReveal direction="up" className="flex flex-col gap-6">
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
            {[
              { key: "about.stat1label", value: t("about.stat1value") },
              { key: "about.stat2label", value: t("about.stat2value") },
              { key: "about.stat3label", value: t("about.stat3value") },
            ].map((s, i) => (
              <SmoothReveal direction="up" delay={0.3 + i * 0.08} key={s.key}>
                <div className="text-center rounded-xl glass p-3">
                  <div className="text-lg font-bold text-gold">{s.value}</div>
                  <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5">
                    {t(s.key)}
                  </div>
                </div>
              </SmoothReveal>
            ))}
          </div>
        </SmoothReveal>
      </div>

      <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {pillars.map((p, i) => (
          <SmoothReveal direction="up" delay={0.5 + i * 0.08} key={p.key}>
            <motion.div
              whileHover={isMobile ? undefined : { y: -5, scale: 1.02 }}
              className="group relative rounded-2xl glass hover:glass-gold hover:glow-gold p-5 transition-all duration-300"
            >
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="grid h-11 w-11 place-items-center rounded-xl glass-gold mb-4 group-hover:glow-gold transition-all duration-300">
                <p.Icon className="h-5 w-5 text-gold" />
              </div>
              <div className="font-display text-lg font-semibold">
                {t(`about.pillar${i + 1}title`)}
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 leading-relaxed">
                {t(`about.pillar${i + 1}text`)}
              </p>
            </motion.div>
          </SmoothReveal>
        ))}
      </div>

      <GhostMode active={ghostActive} onComplete={() => setGhostActive(false)} />
    </Section>
  );
}
