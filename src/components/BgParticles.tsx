import { useEffect, useState } from "react";
import { useIsLowEndDevice } from "../hooks/useIsLowEndDevice";

interface Bubble {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  xDrift: number;
}

function generateBubbles(count: number, sizeMin: number, sizeMax: number, durMin: number, durMax: number, delayMax: number, driftMin: number, driftMax: number): Bubble[] {
  const r: Bubble[] = [];
  for (let i = 0; i < count; i++) {
    r.push({
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: sizeMin + Math.random() * (sizeMax - sizeMin),
      duration: durMin + Math.random() * (durMax - durMin),
      delay: Math.random() * delayMax,
      xDrift: driftMin + Math.random() * (driftMax - driftMin),
    });
  }
  return r;
}

export function BgParticles() {
  const isLowEnd = useIsLowEndDevice();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [b1, setB1] = useState<Bubble[] | null>(null);
  const [b2, setB2] = useState<Bubble[] | null>(null);

  useEffect(() => {
    setB1(generateBubbles(8, 40, 120, 25, 55, 20, -30, 30));
    setB2(generateBubbles(12, 8, 28, 20, 45, 15, -20, 20));
  }, []);

  if (!mounted || isLowEnd) return <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" />;
  if (!b1 || !b2) return <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" />;

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
