import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { useSectionInteraction } from "../interactions";
import { useIsMobile } from "../hooks/useIsMobile";
import { useIsLowEndDevice } from "../hooks/useIsLowEndDevice";

const GOLD_DIM = "oklch(0.78 0.14 85 / {alpha})";

function withAlpha(alpha: number) {
  return GOLD_DIM.replace("{alpha}", String(alpha));
}

export function FloatingTitleHighlight() {
  const prefersReduced = useReducedMotion();
  const isLowEnd = useIsLowEndDevice();
  if (isLowEnd) return null;
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none z-0"
      animate={
        prefersReduced
          ? undefined
          : {
              background: [
                "radial-gradient(500px circle at 20% 30%, oklch(0.78 0.14 85 / 0.05), transparent 70%)",
                "radial-gradient(500px circle at 80% 70%, oklch(0.78 0.14 85 / 0.05), transparent 70%)",
                "radial-gradient(500px circle at 20% 30%, oklch(0.78 0.14 85 / 0.05), transparent 70%)",
              ],
            }
      }
      transition={prefersReduced ? undefined : { duration: 6, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}

export function HoverTextGlow({ children }: { children: React.ReactNode }) {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const isLowEnd = useIsLowEndDevice();
  return (
    <motion.span
      className="relative inline-block"
      whileHover={
        isMobile || prefersReduced || isLowEnd
          ? undefined
          : {
              textShadow: "0 0 40px oklch(0.78 0.14 85 / 0.25), 0 0 80px oklch(0.78 0.14 85 / 0.1)",
            }
      }
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.span>
  );
}

interface CTAParticlesProps {
  containerRef: React.RefObject<HTMLElement | null>;
}

export function CTAParticles({ containerRef }: CTAParticlesProps) {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const isLowEnd = useIsLowEndDevice();
  const particles = useMemo(
    () =>
      Array.from({ length: 4 }, (_, i) => {
        const angle = (i / 4) * Math.PI * 2 + Math.random() * 0.3;
        return {
          id: i,
          angle,
          radius: 18 + Math.random() * 8,
          size: 1.5 + Math.random() * 1.5,
          speed: 3 + Math.random() * 2,
          delay: Math.random() * 0.8,
        };
      }),
    [],
  );

  if (prefersReduced || isMobile || isLowEnd) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: withAlpha(0.3),
            boxShadow: `0 0 ${p.size * 2}px ${withAlpha(0.15)}`,
          }}
          animate={{
            x: [Math.cos(p.angle) * p.radius, Math.cos(p.angle + Math.PI) * p.radius],
            y: [Math.sin(p.angle) * p.radius, Math.sin(p.angle + Math.PI) * p.radius],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: p.speed,
            repeat: Infinity,
            ease: "easeInOut",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
}

function generateWaveParticles(baseId: number, count: number) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (i / count) * Math.PI * 2 + Math.random() * 0.2;
    return {
      id: baseId + i,
      angle,
      distance: 40 + Math.random() * 60,
      size: 2 + Math.random() * 2.5,
      delay: Math.random() * 0.08,
      duration: 0.4 + Math.random() * 0.3,
    };
  });
}

export function ClickWave({ trigger }: { trigger: number }) {
  const [waves, setWaves] = useState<ReturnType<typeof generateWaveParticles>[]>([]);

  useEffect(() => {
    if (trigger === 0) return;
    const base = trigger * 1000;
    const newWave = generateWaveParticles(base, 10);
    setWaves((prev) => [...prev.slice(-2), newWave]);
    const clear = setTimeout(() => {
      setWaves((prev) => prev.filter((w) => w[0]?.id !== base));
    }, 1000);
    return () => clearTimeout(clear);
  }, [trigger]);

  return (
    <div className="absolute inset-0 pointer-events-none z-20" aria-hidden="true">
      <AnimatePresence>
        {waves.map((wave) => (
          <div key={wave[0]?.id ?? `wave-${trigger}`} className="absolute inset-0">
            {wave.map((p) => {
              const x = Math.cos(p.angle) * p.distance;
              const y = Math.sin(p.angle) * p.distance;
              return (
                <motion.div
                  key={p.id}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    width: p.size,
                    height: p.size,
                    backgroundColor: withAlpha(0.5),
                    boxShadow: `0 0 ${p.size * 3}px ${withAlpha(0.2)}`,
                  }}
                  initial={{ x: 0, y: 0, opacity: 0.7, scale: 1 }}
                  animate={{ x, y, opacity: 0, scale: 0.2 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              );
            })}
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useCTAClick() {
  const { activated: clickTrigger, handleClick } = useSectionInteraction("hero");
  return { clickTrigger, handleClick };
}
