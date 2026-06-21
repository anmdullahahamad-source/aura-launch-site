import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  Droplets,
  TreePine,
  Users,
  BookOpen,
  Hammer,
  Heart,
  ArrowRight,
  X,
  ExternalLink,
} from "lucide-react";
import { Section, SectionHeader } from "./Section";
import { InteractiveCard } from "../InteractiveCard";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useTranslation } from "../../lib/i18n";
import im1 from "@/assets/im-1.png";
import im2 from "@/assets/im-2.png";
import im3 from "@/assets/im-3.png";
import im4 from "@/assets/im-4.png";
import im5 from "@/assets/im-5.png";
import im6 from "@/assets/im-6.png";

const projectMeta = [
  { icon: Droplets, image: im1, tagColor: "from-rose-500/30 to-rose-700/20" },
  { icon: TreePine, image: im2, tagColor: "from-emerald-500/30 to-emerald-700/20" },
  { icon: Users, image: im3, tagColor: "from-amber-500/30 to-amber-600/20" },
  { icon: BookOpen, image: im4, tagColor: "from-sky-500/30 to-sky-700/20" },
  { icon: Hammer, image: im5, tagColor: "from-violet-500/30 to-violet-700/20" },
  { icon: Heart, image: im6, tagColor: "from-orange-500/30 to-orange-600/20" },
];

interface ProjectData {
  title: string;
  tag: string;
  desc: string;
  highlights: string[];
  details: string[];
}

export default function Projects() {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const { t, tObject } = useTranslation();

  const projects = tObject<ProjectData[]>("projects.list");

  const openProject = useCallback((index: number) => {
    setSelectedIndex(index);
  }, []);

  const closeProject = useCallback(() => {
    setSelectedIndex(null);
  }, []);

  useEffect(() => {
    if (selectedIndex !== null) {
      previousFocus.current = document.activeElement as HTMLElement;
      requestAnimationFrame(() => modalRef.current?.focus());
    } else if (previousFocus.current) {
      previousFocus.current.focus();
      previousFocus.current = null;
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeProject();
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
  }, [selectedIndex, closeProject]);

  const selectedProject = selectedIndex !== null ? projects[selectedIndex] : null;
  const selectedMeta = selectedIndex !== null ? projectMeta[selectedIndex] : null;

  return (
    <Section id="projects">
      <SectionHeader
        eyebrow={t("projects.eyebrow")}
        title={
          <>
            {t("projects.title1")} <span className="text-gradient-gold">{t("projects.title2")}</span>
          </>
        }
        description={t("projects.description")}
      />

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((p, i) => {
          return (
            <InteractiveCard
              key={i}
              tiltFactor={4}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative rounded-3xl overflow-hidden glass min-h-[260px] sm:min-h-[360px] transition-all duration-500 ease-out hover:shadow-[0_0_60px_-12px_rgba(250,204,21,0.12)]"
            >
              <img
                src={projectMeta[i].image}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500 ease-out group-hover:scale-105 group-hover:brightness-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/50" />
              <div className="absolute inset-x-0 top-0 z-10 p-5">
                <h3 className="font-display text-base sm:text-lg font-semibold text-white leading-snug drop-shadow-lg">
                  {p.title}
                </h3>
              </div>
              <div className="absolute bottom-0 left-0 z-10 p-5">
                <button
                  onClick={() => openProject(i)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-xs font-medium text-white hover:bg-white/25 transition-all group/btn"
                >
                  {t("projects.viewProject")}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                </button>
              </div>
            </InteractiveCard>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedProject && selectedMeta && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center p-4 sm:p-6"
            onClick={closeProject}
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
              aria-labelledby="project-modal-title"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl shadow-[0_0_60px_-12px_rgba(0,0,0,0.4)] outline-none"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(24px) saturate(180%)",
                border: "var(--glass-border)",
              }}
            >
              <div
                className="px-6 pt-6 pb-4 border-b border-border/50 flex items-center justify-between sticky top-0 z-10"
                style={{ background: "var(--glass-bg)" }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="grid h-10 w-10 place-items-center rounded-xl"
                    style={{ background: "var(--glass-gold-bg)", border: "var(--glass-gold-border)" }}
                  >
                    {selectedMeta.icon ? <selectedMeta.icon className="h-5 w-5 text-gold" /> : null}
                  </div>
                  <div>
                    <h2
                      id="project-modal-title"
                      className="font-display text-base font-semibold text-foreground pr-6"
                    >
                      {selectedProject.title}
                    </h2>
                    <div
                      className={`inline-flex mt-1 rounded-full bg-gradient-to-r ${selectedMeta.tagColor} px-2.5 py-0.5 text-[9px] uppercase tracking-widest text-gold`}
                    >
                      {selectedProject.tag}
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeProject}
                  aria-label={t("projects.closeDetails")}
                  className="absolute top-6 right-6 grid h-8 w-8 place-items-center rounded-lg hover:bg-accent/10 transition-colors text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="px-6 py-6 space-y-6">
                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-gold font-medium mb-2">
                    {t("projects.aboutProject")}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedProject.desc}
                  </p>
                </div>

                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-gold font-medium mb-3">
                    {t("projects.keyFocus")}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.highlights.map((h) => (
                      <span
                        key={h}
                        className="inline-flex items-center rounded-full glass px-3 py-1.5 text-[10px] uppercase tracking-wider text-muted-foreground/80"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-[10px] uppercase tracking-widest text-gold font-medium mb-3">
                    {t("projects.activities")}
                  </h3>
                  <ul className="space-y-3">
                    {selectedProject.details.map((d, i) => (
                      <motion.li
                        key={d}
                        initial={prefersReduced ? undefined : { opacity: 0, x: -8 }}
                        animate={prefersReduced ? undefined : { opacity: 1, x: 0 }}
                        transition={{ duration: 0.35, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                        className="flex gap-3 text-sm text-muted-foreground/90"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                        <span>{d}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    onClick={closeProject}
                    className="inline-flex items-center gap-1.5 rounded-full glass-gold px-5 py-2.5 text-xs font-medium text-gold hover:glow-gold transition-all"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    {t("projects.learnMore")}
                  </button>
                  <button
                    onClick={closeProject}
                    className="inline-flex items-center gap-1.5 rounded-full glass px-5 py-2.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {t("projects.close")}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
