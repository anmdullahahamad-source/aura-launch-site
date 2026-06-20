import { motion, useScroll, useSpring, useReducedMotion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowUp, ChevronDown } from "lucide-react";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTranslation } from "../../lib/i18n";

const NAV_SECTION_IDS = [
  "about",
  "leadership",
  "experience",
  "skills",
  "projects",
  "gallery",
  "contact",
];

const SECTION_TRANSLATION_KEYS: Record<string, string> = {
  about: "scroll.about",
  leadership: "scroll.leadership",
  experience: "scroll.experience",
  skills: "scroll.skills",
  projects: "scroll.projects",
  gallery: "scroll.gallery",
  contact: "scroll.contact",
};

function useSectionPositions() {
  const [positions, setPositions] = useState<{ id: string; top: number }[]>([]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const measure = () => {
      const docH = document.documentElement.scrollHeight - window.innerHeight;
      const result = NAV_SECTION_IDS.map((id) => {
        const el = document.getElementById(id);
        const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
        return { id, top: docH > 0 ? top / docH : 0 };
      });
      setPositions(result);
    };

    const debouncedMeasure = () => {
      clearTimeout(timer);
      timer = setTimeout(measure, 150);
    };

    measure();
    window.addEventListener("resize", debouncedMeasure);
    return () => {
      window.removeEventListener("resize", debouncedMeasure);
      clearTimeout(timer);
    };
  }, []);

  return positions;
}

export function ScrollProgress() {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  const [showFab, setShowFab] = useState(false);
  const [showIndicator, setShowIndicator] = useState(true);

  const activeSection = useActiveSection(NAV_SECTION_IDS);
  const sectionPositions = useSectionPositions();
  const { t } = useTranslation();

  useEffect(() => {
    const onScroll = () => {
      setShowFab(window.scrollY > 600);
      setShowIndicator(window.scrollY < 200);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeName = activeSection
    ? t(SECTION_TRANSLATION_KEYS[activeSection] || "scroll.about")
    : null;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[60] h-1 overflow-hidden">
        <motion.div
          className="absolute inset-0 origin-left"
          style={{
            scaleX,
            background:
              "linear-gradient(90deg, oklch(0.62 0.16 162), oklch(0.78 0.14 88), oklch(0.62 0.16 162))",
          }}
        />
        <div
          className="absolute inset-0 opacity-30 blur-[4px]"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.62 0.16 162), oklch(0.78 0.14 88), oklch(0.62 0.16 162))",
            maskImage: "linear-gradient(to bottom, black 40%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent)",
          }}
        />
        {sectionPositions.map((sp) => (
          <div
            key={sp.id}
            className="absolute top-0 h-full w-1 -translate-x-1/2 transition-all duration-300"
            style={{
              left: `${sp.top * 100}%`,
              background:
                sp.id === activeSection ? "oklch(0.85 0.14 88)" : "oklch(0.85 0.14 88 / 0.25)",
              boxShadow: sp.id === activeSection ? "0 0 6px oklch(0.78 0.14 85 / 0.6)" : "none",
            }}
          />
        ))}
      </div>

      <AnimatePresence>
        {showIndicator && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-2 pointer-events-none"
          >
            <span className="text-[10px] uppercase tracking-[0.25em] font-mono text-muted-foreground/40">
              {t("scroll.scroll")}
            </span>
            <motion.div
              animate={prefersReduced || isMobile ? undefined : { y: [0, 6, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown className="h-4 w-4 text-muted-foreground/40" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showFab && (
        <motion.button
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          aria-label={t("scroll.scrollToTop")}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full shadow-lg py-2.5 pl-3 pr-4"
          style={{
            background: "var(--glass-gold-bg)",
            border: "var(--glass-gold-border)",
            backdropFilter: "blur(20px) saturate(180%)",
            boxShadow: "var(--shadow-gold)",
          }}
          whileHover={isMobile ? undefined : { scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
        >
          {activeName && (
            <span className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground/60 font-mono">
              {activeName}
            </span>
          )}
          <span className="grid h-7 w-7 place-items-center rounded-full bg-gold/10">
            <ArrowUp className="h-3.5 w-3.5 text-gold" />
          </span>
        </motion.button>
      )}
    </>
  );
}
