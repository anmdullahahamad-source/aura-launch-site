import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { BookOpen } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { useSectionInteraction } from "../interactions";
import { useIsMobile } from "../hooks/useIsMobile";
import { useTranslation } from "../lib/i18n";

export function EducationInteraction() {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
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

  const { hovered, setHovered, activated, showGlow, handleClick, handleKeyDown } =
    useSectionInteraction("education");
  const showTooltip = hovered || (isMobile && touched);

  return (
    <>
      {/* Floating book icon */}
      <div
        className="relative flex justify-center"
        onMouseEnter={() => !isMobile && setHovered(true)}
        onMouseLeave={() => !isMobile && setHovered(false)}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
      >
        <motion.button
          aria-label={t("interactions.educationAria")}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          animate={
            prefersReduced || isMobile
              ? undefined
              : {
                  y: [0, -6, 0],
                  rotate: [-1, 1, -1],
                }
          }
          transition={
            prefersReduced || isMobile
              ? undefined
              : {
                  y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                }
          }
          whileTap={{ scale: 0.9 }}
          className="relative cursor-pointer focus:outline-none bg-transparent border-none p-0"
        >
          {/* Glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            animate={
              prefersReduced || isMobile
                ? undefined
                : {
                    background: [
                      "radial-gradient(circle, oklch(0.78 0.14 85 / 0.2), transparent 70%)",
                      "radial-gradient(circle, oklch(0.68 0.16 162 / 0.15), transparent 70%)",
                      "radial-gradient(circle, oklch(0.78 0.14 85 / 0.2), transparent 70%)",
                    ],
                  }
            }
            transition={
              prefersReduced || isMobile
                ? undefined
                : { duration: 3, repeat: Infinity, ease: "easeInOut" }
            }
          />

          {/* Icon container */}
          <motion.div
            className="relative grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-2xl"
            style={{
              background: "var(--glass-bg)",
              backdropFilter: "blur(20px) saturate(180%)",
              border: hovered ? "1px solid oklch(0.78 0.14 85 / 0.4)" : "var(--glass-border)",
            }}
            animate={{
              boxShadow: hovered
                ? "0 0 30px -4px oklch(0.78 0.14 85 / 0.25), inset 0 0 15px -6px oklch(0.78 0.14 85 / 0.1)"
                : "0 0 15px -8px oklch(0.78 0.14 85 / 0.15)",
              scale: hovered ? 1.06 : 1,
            }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            whileHover={isMobile ? undefined : { scale: 1.06 }}
            whileTap={{ scale: 1.06 }}
          >
            <BookOpen className="h-6 w-6 sm:h-7 sm:w-7 text-gold" />
          </motion.div>

          {/* Pulse ring on click */}
          <AnimatePresence>
            {activated > 0 && (
              <motion.div
                key={activated}
                className="absolute inset-0 rounded-2xl"
                initial={{ opacity: 0.5, scale: 1 }}
                animate={{ opacity: 0, scale: 1.8 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  border: "1px solid oklch(0.78 0.14 85 / 0.4)",
                }}
              />
            )}
          </AnimatePresence>
        </motion.button>

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              initial={{ opacity: 0, y: 6, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.92 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap z-20"
            >
              <div
                className="rounded-xl px-4 py-2 text-xs font-mono tracking-wide text-gold"
                style={{
                  background: "var(--glass-bg)",
                  backdropFilter: "blur(20px) saturate(180%)",
                  border: "var(--glass-border)",
                  boxShadow: "0 0 20px -8px oklch(0.78 0.14 85 / 0.2)",
                }}
              >
                <motion.span
                  animate={prefersReduced || isMobile ? undefined : { opacity: [1, 0.5, 1] }}
                  transition={
                    prefersReduced || isMobile
                      ? undefined
                      : { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }
                >
                  {t("interactions.educationText")}
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Section glow overlay */}
      <AnimatePresence>
        {showGlow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                "radial-gradient(800px circle at 50% 30%, oklch(0.78 0.14 85 / 0.08), transparent 70%)",
            }}
          />
        )}
      </AnimatePresence>

      {/* Timeline highlight pulse */}
      <AnimatePresence>
        {showGlow && (
          <motion.div
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{ scaleX: 1, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px origin-left z-10 pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, oklch(0.85 0.14 88 / 0.8), oklch(0.68 0.16 162 / 0.6), transparent 80%)",
              boxShadow: "0 0 20px 4px oklch(0.78 0.14 85 / 0.3)",
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
