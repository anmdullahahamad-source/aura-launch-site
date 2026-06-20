import { useReducedMotion, motion } from "framer-motion";
import type { ReactNode } from "react";
import { useIsLowEndDevice } from "../hooks/useIsLowEndDevice";

interface SmoothRevealProps {
  children: ReactNode;
  direction?: "up" | "down" | "left" | "right" | "scale" | "clipUp";
  delay?: number;
  duration?: number;
  distance?: number;
  className?: string;
  once?: boolean;
  as?: "div" | "span";
}

const directionMap = {
  up: { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0 } },
  down: { hidden: { opacity: 0, y: -24 }, show: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: 24 }, show: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0 } },
  scale: {
    hidden: { opacity: 0, scale: 0.92 },
    show: { opacity: 1, scale: 1 },
  },
  clipUp: {
    hidden: { opacity: 0, clipPath: "inset(100% 0 0 0)" },
    show: { opacity: 1, clipPath: "inset(0 0 0 0)" },
  },
};

export function SmoothReveal({
  children,
  direction = "up",
  delay = 0,
  duration = 0.7,
  distance = 24,
  className = "",
  once = true,
  as = "div",
}: SmoothRevealProps) {
  const reducedMotion = useReducedMotion();
  const isLowEnd = useIsLowEndDevice();

  if (reducedMotion || isLowEnd) {
    const Tag = as === "span" ? "span" : "div";
    return <Tag className={className}>{children}</Tag>;
  }

  const vars = directionMap[direction];
  const showTransition = {
    duration,
    delay,
    ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
  };

  const hidden = { ...vars.hidden };
  if (direction === "up" || direction === "down")
    hidden.y = distance * (direction === "up" ? 1 : -1);
  if (direction === "left" || direction === "right")
    hidden.x = distance * (direction === "left" ? 1 : -1);

  const MotionTag = as === "span" ? motion.span : motion.div;

  return (
    <MotionTag
      initial="hidden"
      whileInView="show"
      viewport={{ once, margin: "-40px" }}
      variants={{
        hidden,
        show: {
          ...vars.show,
          transition: showTransition,
        },
      }}
      className={className}
    >
      {children}
    </MotionTag>
  );
}
