import { useReducedMotion, motion } from "framer-motion";
import { useMemo, useState, useCallback } from "react";
import { Section, SectionHeader } from "./Section";
import { Quote } from "lucide-react";
import { TestimonialsInteraction } from "../TestimonialsInteraction";
import { useTranslation } from "../../lib/i18n";

const CARD_EASE = [0.16, 1, 0.3, 1] as const;

export function Testimonials() {
  const prefersReduced = useReducedMotion();
  const [rotateKey, setRotateKey] = useState(0);
  const { t, tObject } = useTranslation();

  const items = tObject<{ text: string; name: string }[]>("testimonials.quotes");

  const shuffled = useMemo(() => {
    if (rotateKey === 0) return items;
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }, [rotateKey, items]);

  const handleRotate = useCallback(() => {
    setRotateKey((p) => p + 1);
  }, []);

  return (
    <Section id="testimonials">
      <SectionHeader
        eyebrow={t("testimonials.eyebrow")}
        title={
          <>
            {t("testimonials.title1")} <span className="text-gradient-gold">{t("testimonials.title2")}</span>
          </>
        }
      />

      <div className="flex justify-center mb-8">
        <TestimonialsInteraction onActivate={handleRotate} />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {shuffled.map((it, i) => (
          <motion.div
            key={`${rotateKey}-${i}`}
            initial={prefersReduced ? {} : { opacity: 0, y: 24, scale: 0.97 }}
            animate={prefersReduced ? {} : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: CARD_EASE }}
            whileHover={prefersReduced ? {} : { scale: 1.02, y: -4 }}
            className="group relative rounded-2xl glass hover:glass-gold hover:glow-gold p-6 sm:p-8 transition-all duration-300"
          >
            <Quote className="absolute top-4 right-4 h-8 w-8 text-gold/10 group-hover:text-gold/30 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
            <p className="font-display text-base sm:text-lg lg:text-xl leading-relaxed text-foreground/90">
              &ldquo;{it.text}&rdquo;
            </p>
            <div className="mt-5 pt-4 border-t border-border/50">
              <div className="font-semibold text-sm text-gold">— {it.name}</div>
            </div>
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none overflow-hidden">
              <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-gold/5 via-transparent to-transparent rotate-12" />
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
