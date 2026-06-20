import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { CommunityInteraction } from "../CommunityInteraction";
import { SmoothReveal } from "../SmoothReveal";
import { useTranslation } from "../../lib/i18n";

const statValues = [120, 45, 500, 8, 75];
const statKeys = ["programs", "projects", "volunteers", "service", "events"] as const;

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const rounded = useTransform(mv, (v) => Math.round(v).toLocaleString());
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (inView) {
      if (prefersReduced) {
        mv.set(to);
        return;
      }
      const controls = animate(mv, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1] });
      return controls.stop;
    }
  }, [inView, to, prefersReduced]);

  return (
    <span ref={ref} className="inline-flex items-baseline">
      <motion.span>{rounded}</motion.span>
      <span>{suffix}</span>
    </span>
  );
}

export function Stats() {
  const [counterKey, setCounterKey] = useState(0);
  const { t, tObject } = useTranslation();

  const stats = statKeys.map((k) => ({
    ...tObject<{ label: string; suffix: string }>(`stats.${k}`),
  }));

  return (
    <section id="community" className="relative py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="glass rounded-3xl p-8 sm:p-12 relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative">
            <div className="flex justify-center mb-8">
              <CommunityInteraction onActivate={() => setCounterKey((p) => p + 1)} />
            </div>
            <div key={counterKey} className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
              {stats.map((s, i) => (
                <SmoothReveal direction="up" delay={i * 0.08} key={s.label}>
                  <div className="font-display text-2xl sm:text-3xl md:text-5xl font-semibold text-gradient-gold">
                    <Counter to={statValues[i]} suffix={s.suffix} />
                  </div>
                  <div className="mt-2 text-[10px] sm:text-xs md:text-sm uppercase tracking-widest text-muted-foreground">
                    {s.label}
                  </div>
                </SmoothReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
