import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { loadingState } from "../interactions/features/loadingExperience";
import { useTranslation } from "../lib/i18n";

export function PageLoader() {
  const prefersReduced = useReducedMotion();
  const [phase, setPhase] = useState<"enter" | "reveal" | "done">("enter");
  const { t } = useTranslation();

  useEffect(() => {
    loadingState.setDispatch({
      onPageReady: () => {},
    });

    const enter = setTimeout(() => setPhase("reveal"), 400);
    const reveal = setTimeout(() => {
      setPhase("done");
      loadingState.pageLoaded = true;
    }, 800);

    return () => {
      clearTimeout(enter);
      clearTimeout(reveal);
    };
  }, []);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
          role="status"
          aria-label="Loading"
          style={{ background: "oklch(0.15 0.04 165)" }}
        >
          <div className="relative flex flex-col items-center gap-6">
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={phase === "enter" ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
              transition={
                phase === "enter"
                  ? { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
                  : { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
              }
              className="grid h-16 w-16 place-items-center rounded-2xl"
              style={{
                background: "linear-gradient(135deg, oklch(0.85 0.14 88), oklch(0.65 0.16 75))",
                boxShadow: "0 0 40px -8px oklch(0.78 0.14 85 / 0.3)",
              }}
            >
              <span
                className="font-display text-2xl font-bold"
                style={{ color: "oklch(0.15 0.04 165)" }}
              >
                I
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={phase === "enter" ? { opacity: 1, y: 0 } : { opacity: 0, y: -4 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="text-center"
            >
              <p
                className="font-display text-lg font-semibold tracking-wide"
                style={{ color: "oklch(0.85 0.14 88)" }}
              >
                Ibrahim Khalil
              </p>
              <p
                className="text-[11px] tracking-[0.2em] uppercase mt-1"
                style={{ color: "oklch(0.78 0.14 85 / 0.5)" }}
              >
                {t("pageLoader.loading")}
              </p>
            </motion.div>

            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={phase === "enter" ? { width: 160, opacity: 1 } : { width: 0, opacity: 0 }}
              transition={
                phase === "enter"
                  ? { duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.4 }
                  : { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
              }
              className="h-[2px] rounded-full overflow-hidden"
              style={{ background: "oklch(0.78 0.14 85 / 0.15)" }}
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.4,
                  repeat: prefersReduced ? 0 : Infinity,
                  repeatDelay: 0.3,
                }}
                className="h-full w-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, oklch(0.85 0.14 88), transparent)",
                }}
              />
            </motion.div>
          </div>

          <motion.div
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2"
            initial={{ opacity: 0 }}
            animate={phase === "enter" ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: "oklch(0.78 0.14 85 / 0.4)" }}
                animate={prefersReduced ? undefined : { opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1.2,
                  repeat: prefersReduced ? 0 : Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
