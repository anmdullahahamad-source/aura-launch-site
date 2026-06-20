import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Ghost } from "lucide-react";
import { useFeatureRegistration, useFeatureActivation } from "../interactions";
import GHOST_MODE_FEATURE from "../interactions/features/ghostMode";
import { ghostState } from "../interactions/features/ghostMode";
import { useIsMobile } from "../hooks/useIsMobile";
import { useTranslation } from "../lib/i18n";
import { useIsLowEndDevice } from "../hooks/useIsLowEndDevice";

interface GhostIconProps {
  onActivate: () => void;
}

export function GhostIcon({ onActivate }: GhostIconProps) {
  const [hovered, setHovered] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);
  const pulseTimer = useRef<ReturnType<typeof setTimeout>>();
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const isLowEnd = useIsLowEndDevice();
  const [touched, setTouched] = useState(false);
  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t } = useTranslation();
  const handleTouchStart = useCallback(() => {
    setTouched(true);
    if (touchTimer.current) clearTimeout(touchTimer.current);
    touchTimer.current = setTimeout(() => setTouched(false), 2000);
  }, []);
  const handleTouchEnd = useCallback(() => {
    if (touchTimer.current) clearTimeout(touchTimer.current);
    touchTimer.current = setTimeout(() => setTouched(false), 500);
  }, []);

  useFeatureRegistration(GHOST_MODE_FEATURE, []);
  useFeatureActivation("ghost-mode", true);

  useEffect(() => {
    const schedule = () => {
      pulseTimer.current = setTimeout(
        () => {
          setPulseKey((k) => k + 1);
          schedule();
        },
        2000 + Math.random() * 2000,
      );
    };
    schedule();
    return () => {
      if (pulseTimer.current) clearTimeout(pulseTimer.current);
    };
  }, []);

  const handleClick = useCallback(() => {
    ghostState.triggers++;
    ghostState.active = true;
    onActivate();
  }, [onActivate]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  return (
    <motion.div
      animate={prefersReduced || isMobile || isLowEnd ? undefined : { y: [0, -5, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      className="relative flex flex-col items-center gap-1.5"
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      <motion.button
        role="switch"
        aria-label="Activate Ghost Mode"
        aria-checked={false}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        whileHover={isMobile ? undefined : { scale: 1.12 }}
        whileTap={{ scale: 0.88 }}
        className="relative cursor-pointer focus:outline-none group"
      >
        {/* Outer glow ring */}
        <motion.div
          className="absolute -inset-2 rounded-full blur-xl"
          animate={{
            background: hovered
              ? "radial-gradient(circle, oklch(0.78 0.14 85 / 0.35), transparent 70%)"
              : "radial-gradient(circle, oklch(0.78 0.14 85 / 0.1), transparent 70%)",
            scale: hovered ? [1, 1.15, 1] : [1, 1.08, 1],
          }}
          transition={{ duration: 2, repeat: prefersReduced || isLowEnd ? 0 : Infinity, ease: "easeInOut" }}
        />

        {/* Icon container */}
        <motion.div
          className="grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-2xl border-2"
          animate={{
            borderColor: hovered
              ? "oklch(0.78 0.14 85 / 0.6)"
              : prefersReduced || isLowEnd
                ? "oklch(0.78 0.14 85 / 0.2)"
                : [
                    "oklch(0.78 0.14 85 / 0.2)",
                    "oklch(0.78 0.14 85 / 0.4)",
                    "oklch(0.78 0.14 85 / 0.2)",
                  ],
            boxShadow: hovered
              ? "0 0 30px oklch(0.78 0.14 85 / 0.3), inset 0 0 20px oklch(0.78 0.14 85 / 0.1)"
              : prefersReduced || isLowEnd
                ? "0 0 10px oklch(0.78 0.14 85 / 0.1)"
                : [
                    "0 0 10px oklch(0.78 0.14 85 / 0.1)",
                    "0 0 20px oklch(0.78 0.14 85 / 0.2)",
                    "0 0 10px oklch(0.78 0.14 85 / 0.1)",
                  ],
          }}
          transition={{ duration: 2.5, repeat: prefersReduced || isLowEnd ? 0 : Infinity, ease: "easeInOut" }}
          key={`pulse-${pulseKey}`}
          style={{
            background: hovered ? "var(--glass-gold-bg)" : "var(--glass-bg)",
            backdropFilter: "blur(16px) saturate(180%)",
            willChange: "transform, border-color, box-shadow",
          }}
        >
          <Ghost
            className="h-5 w-5 sm:h-6 sm:w-6"
            style={{
              color: hovered ? "var(--gold)" : "color-mix(in oklch, var(--gold), transparent 20%)",
            }}
          />
        </motion.div>
      </motion.button>

      {/* Click Me text */}
      <motion.span
        animate={prefersReduced || isLowEnd ? undefined : { opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-[10px] sm:text-[11px] font-mono tracking-wider whitespace-nowrap select-none"
        style={{
          color: hovered ? "var(--gold)" : "color-mix(in oklch, var(--gold), transparent 30%)",
          textShadow: hovered ? "0 0 8px oklch(0.78 0.14 85 / 0.4)" : "none",
        }}
      >
        {t("ghost.clickMe")}
      </motion.span>

      <AnimatePresence>
        {(hovered || (isMobile && touched)) && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.92 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-10"
          >
            <div
              className="rounded-lg px-2.5 py-1.5 text-[10px] font-mono tracking-wide"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(20px) saturate(180%)",
                border: "var(--glass-border)",
                color: "var(--gold)",
              }}
            >
              {t("ghost.tapToReveal")}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
