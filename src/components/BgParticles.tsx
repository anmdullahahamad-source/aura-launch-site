import { useMemo } from "react";
import { useIsLowEndDevice } from "../hooks/useIsLowEndDevice";

interface Bubble {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  xDrift: number;
}

export function BgParticles() {
  const isLowEnd = useIsLowEndDevice();

  const b1 = useMemo(() => {
    const r: Bubble[] = [];
    for (let i = 0; i < 8; i++) {
      r.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 40 + Math.random() * 80,
        duration: 25 + Math.random() * 30,
        delay: Math.random() * 20,
        xDrift: -30 + Math.random() * 60,
      });
    }
    return r;
  }, []);

  const b2 = useMemo(() => {
    const r: Bubble[] = [];
    for (let i = 0; i < 12; i++) {
      r.push({
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 8 + Math.random() * 20,
        duration: 20 + Math.random() * 25,
        delay: Math.random() * 15,
        xDrift: -20 + Math.random() * 40,
      });
    }
    return r;
  }, []);

  if (isLowEnd) return <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" />;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .bgp-particle {
            animation: none !important;
            opacity: 0.3;
          }
        }
        @keyframes bgp-float {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.7;
          }
          85% {
            opacity: 0.7;
          }
          100% {
            transform: translateY(-100vh) translateX(var(--bdx, 0px)) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
      {b1.map((b, i) => (
        <div
          key={`l-${i}`}
          className="bgp-particle absolute rounded-full"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            width: b.size,
            height: b.size,
            background: "radial-gradient(circle, oklch(0.78 0.14 85 / 0.06), transparent 70%)",
            animation: `bgp-float ${b.duration}s ease-in-out infinite`,
            animationDelay: `${b.delay}s`,
            ["--bdx" as string]: `${b.xDrift}px`,
          }}
        />
      ))}
      {b2.map((b, i) => (
        <div
          key={`s-${i}`}
          className="bgp-particle absolute rounded-full"
          style={{
            left: `${b.left}%`,
            top: `${b.top}%`,
            width: b.size,
            height: b.size,
            background: "radial-gradient(circle, oklch(0.78 0.14 85 / 0.08), transparent 70%)",
            animation: `bgp-float ${b.duration}s ease-in-out infinite`,
            animationDelay: `${b.delay}s`,
            ["--bdx" as string]: `${b.xDrift}px`,
          }}
        />
      ))}
    </div>
  );
}
