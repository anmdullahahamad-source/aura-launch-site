import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { useIsMobile } from "../hooks/useIsMobile";
import { useIsLowEndDevice } from "../hooks/useIsLowEndDevice";

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  tiltFactor?: number;
  scaleFactor?: number;
  initial?: Record<string, unknown>;
  whileInView?: Record<string, unknown>;
  viewport?: Record<string, unknown>;
  transition?: Record<string, unknown>;
}

export function InteractiveCard({
  children,
  className,
  style,
  tiltFactor = 6,
  scaleFactor = 1.015,
  initial,
  whileInView,
  viewport,
  transition,
}: InteractiveCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const isLowEnd = useIsLowEndDevice();
  const disableTilt = isMobile || isLowEnd || prefersReduced;

  const springX = useSpring(mouseX, { stiffness: 200, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 200, damping: 20 });

  const rotateX = useTransform(springY, [-1, 1], [tiltFactor, -tiltFactor]);
  const rotateY = useTransform(springX, [-1, 1], [-tiltFactor, tiltFactor]);

  const handleMouseEnter = useCallback(() => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = rectRef.current;
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseX.set(x);
    mouseY.set(y);
  }, []);

  const handleMouseLeave = useCallback(() => {
    rectRef.current = null;
    mouseX.set(0);
    mouseY.set(0);
  }, []);

  return (
    <motion.div
      ref={ref}
      onMouseEnter={disableTilt ? undefined : handleMouseEnter}
      onMouseMove={disableTilt ? undefined : handleMouseMove}
      onMouseLeave={disableTilt ? undefined : handleMouseLeave}
      style={disableTilt ? { ...style } : { perspective: 800, rotateX, rotateY, ...style }}
      whileHover={disableTilt ? undefined : { scale: scaleFactor }}
      whileTap={disableTilt ? undefined : { scale: scaleFactor }}
      transition={{ scale: { duration: 0.35, ease: [0.16, 1, 0.3, 1] }, ...transition }}
      initial={initial}
      whileInView={whileInView}
      viewport={viewport}
      className={className}
    >
      {children}
    </motion.div>
  );
}
