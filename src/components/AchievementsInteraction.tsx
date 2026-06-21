import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Trophy } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { useSectionInteraction } from "../interactions";
import { useIsMobile } from "../hooks/useIsMobile";
import { useIsLowEndDevice } from "../hooks/useIsLowEndDevice";
import { useTranslation } from "../lib/i18n";

export function AchievementsInteraction({ onActivate }: { onActivate?: () => void }) {
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

  const { hovered, setHovered, handleClick, handleKeyDown } = useSectionInteraction(
    "achievements",
    onActivate,
  );
  const showTooltip = hovered || (isMobile && touched);

  return (
    <div
      className="relative flex justify-center"
      onMouseEnter={() => !isMobile && setHovered(true)}
      onMouseLeave={() => !isMobile && setHovered(false)}
      onTouchStart={isMobile ? handleTouchStart : undefined}
      onTouchEnd={isMobile ? handleTouchEnd : undefined}
    >
      <motion.button
        aria-label={t("interactions.achievementsAria")}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        animate={
          prefersReduced || isMobile || isLowEnd
            ? undefined
            : {
                y: [0, -5, 0],
                rotate: [-3, 3, -3],
              }
        }
        transition={
          prefersReduced || isMobile || isLowEnd
            ? undefined
            : {
                y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
              }
        }
        whileTap={{ scale: 0.9 }}
        className="relative cursor-pointer focus:outline-none bg-transparent border-none p-0"
      >
        {/* Trophy glow — warm golden hue */}
        <motion.div
          className="absolute inset-0 rounded-full blur-xl"
          animate={
            prefersReduced || isMobile || isLowEnd
              ? undefined
              : {
                  background: [
                    "radial-gradient(circle, oklch(0.85 0.14 88 / 0.25), transparent 70%)",
                    "radial-gradient(circle, oklch(0.78 0.14 85 / 0.15), transparent 70%)",
                    "radial-gradient(circle, oklch(0.85 0.14 88 / 0.25), transparent 70%)",
                  ],
                }
          }
          transition={
            prefersReduced || isMobile || isLowEnd
              ? undefined
              : { duration: 3, repeat: Infinity, ease: "easeInOut" }
          }
        />

        <motion.div
          className="relative grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-2xl"
          style={{
            background: "var(--glass-bg)",
            backdropFilter: "blur(20px) saturate(180%)",
            border: hovered ? "1px solid oklch(0.85 0.14 88 / 0.4)" : "var(--glass-border)",
          }}
          animate={{
            boxShadow: hovered
              ? "0 0 30px -4px oklch(0.85 0.14 88 / 0.25), inset 0 0 15px -6px oklch(0.85 0.14 88 / 0.1)"
              : "0 0 15px -8px oklch(0.78 0.14 85 / 0.15)",
            scale: hovered ? 1.06 : 1,
          }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          whileHover={isMobile ? undefined : { scale: 1.06 }}
          whileTap={{ scale: 1.06 }}
        >
          <Trophy className="h-6 w-6 sm:h-7 sm:w-7 text-gold" />
        </motion.div>
      </motion.button>

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
                animate={prefersReduced || isMobile || isLowEnd ? undefined : { opacity: [1, 0.5, 1] }}
                transition={
                  prefersReduced || isMobile || isLowEnd
                    ? undefined
                    : { duration: 2, repeat: Infinity, ease: "easeInOut" }
                }
              >
                {t("interactions.achievementsText")}
              </motion.span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
