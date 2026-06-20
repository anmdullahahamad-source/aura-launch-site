import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Compass, Quote } from "lucide-react";
import { useSectionInteraction } from "../interactions";
import { useIsMobile } from "../hooks/useIsMobile";
import { useTranslation } from "../lib/i18n";

export function LeadershipInteraction() {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const [touched, setTouched] = useState(false);
  const touchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTouchStart = useCallback(() => {
    setTouched(true);
    if (touchTimer.current) clearTimeout(touchTimer.current);
    touchTimer.current = setTimeout(() => setTouched(false), 2000);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (touchTimer.current) clearTimeout(touchTimer.current);
    touchTimer.current = setTimeout(() => setTouched(false), 500);
  }, []);

  const { hovered, setHovered, handleClick: hubClick } = useSectionInteraction("leadership");
  const [modalOpen, setModalOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  const handleClick = useCallback(() => {
    hubClick();
    setModalOpen(true);
  }, [hubClick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  const handleClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  useEffect(() => {
    if (modalOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => modalRef.current?.focus());
    } else if (previousFocus.current) {
      previousFocus.current.focus();
      previousFocus.current = null;
    }
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }
      if (e.key === "Tab") {
        const d = modalRef.current;
        if (!d) return;
        const f = d.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (f.length === 0) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modalOpen, handleClose]);

  const showTooltip = hovered || (isMobile && touched);

  return (
    <>
      <div
        className="relative flex justify-center"
        onMouseEnter={() => !isMobile && setHovered(true)}
        onMouseLeave={() => !isMobile && setHovered(false)}
        onTouchStart={isMobile ? handleTouchStart : undefined}
        onTouchEnd={isMobile ? handleTouchEnd : undefined}
      >
        <motion.button
          aria-label={t("interactions.leadershipAria")}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          animate={
            prefersReduced || isMobile
              ? undefined
              : {
                  y: [0, -6, 0],
                  rotate: [-2, 2, -2],
                }
          }
          transition={
            prefersReduced || isMobile
              ? undefined
              : {
                  y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
                  rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                }
          }
          whileTap={{ scale: 0.9 }}
          className="relative cursor-pointer focus:outline-none bg-transparent border-none p-0"
        >
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
            <Compass className="h-6 w-6 sm:h-7 sm:w-7 text-gold" />
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
                  animate={prefersReduced || isMobile ? undefined : { opacity: [1, 0.5, 1] }}
                  transition={
                    prefersReduced || isMobile
                      ? undefined
                      : { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }
                >
                  {t("leadership.tooltip")}
                </motion.span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Vision statement modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center p-4 sm:p-6"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            />

            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="vision-modal-title"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl overflow-hidden shadow-[0_0_60px_-12px_rgba(0,0,0,0.4)] outline-none"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(24px) saturate(180%)",
                border: "var(--glass-border)",
              }}
            >
              <div className="px-6 pt-6 pb-4 border-b border-border/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-8 w-8 place-items-center rounded-lg"
                    style={{
                      background: "var(--glass-gold-bg)",
                      border: "var(--glass-gold-border)",
                    }}
                  >
                    <Compass className="h-4 w-4 text-gold" />
                  </div>
                  <div>
                    <h2
                      id="vision-modal-title"
                      className="font-display text-base font-semibold text-foreground"
                    >
                      {t("leadership.modalTitle")}
                    </h2>
                    <p className="text-[10px] text-muted-foreground tracking-wide font-mono uppercase">
                      {t("leadership.modalSubtitle")}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                   aria-label={t("leadership.modalClose")}
                  className="grid h-8 w-8 place-items-center rounded-lg hover:bg-accent/10 transition-colors text-muted-foreground hover:text-foreground"
                >
                  <svg
                    className="h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <div className="px-6 py-8 sm:py-10 text-center">
                <Quote className="mx-auto h-8 w-8 text-gold/30 mb-5" />
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  className="font-display text-lg sm:text-xl leading-relaxed text-foreground/90"
                >
                  &ldquo;{t("leadership.quote")}&rdquo;
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
                  className="mt-6"
                >
                  <motion.button
                    onClick={handleClose}
                    className="rounded-xl px-5 py-2.5 text-xs font-medium tracking-wide transition-all duration-300"
                    style={{
                      background: "var(--glass-gold-bg)",
                      border: "var(--glass-gold-border)",
                      color: "var(--gold)",
                    }}
                    whileHover={isMobile ? undefined : { scale: 1.04 }}
                    whileTap={{ scale: 1.04 }}
                  >
                    {t("leadership.modalClose")}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
