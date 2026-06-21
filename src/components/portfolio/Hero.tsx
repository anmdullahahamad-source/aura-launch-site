import { useReducedMotion, motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { Download, Mail, Phone, Facebook, Linkedin, ArrowRight, MapPin, X, ExternalLink } from "lucide-react";
import portrait from "@/assets/hero-portrait.png";
import cvPdf from "@/assets/Ibrahim_Khalil_CV.pdf";
import {
  FloatingTitleHighlight,
  HoverTextGlow,
  CTAParticles,
  ClickWave,
  useCTAClick,
} from "../HeroMicroInteractions";
import { SmoothReveal } from "../SmoothReveal";
import { useTranslation, useLanguage } from "../../lib/i18n";
import { useIsMobile } from "../../hooks/useIsMobile";

function RotatingRole() {
  const { tArray } = useTranslation();
  const roles = tArray("hero.roles");
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();

  useEffect(() => {
    if (prefersReduced || !roles?.length) {
      setText(roles?.[0] ?? "");
      return;
    }
    const current = roles[i];
    const speed = deleting ? (isMobile ? 80 : 50) : (isMobile ? 180 : 100);
    const pause = isMobile ? 5000 : 3500;
    const t = setTimeout(() => {
      if (!deleting && text === current) {
        setTimeout(() => setDeleting(true), pause);
        return;
      }
      if (deleting && text === "") {
        setDeleting(false);
        setI((i + 1) % roles.length);
        return;
      }
      setText(deleting ? current.slice(0, text.length - 1) : current.slice(0, text.length + 1));
    }, speed);
    return () => clearTimeout(t);
  }, [text, deleting, i, roles, prefersReduced, isMobile]);

  if (prefersReduced) {
    return <span className="text-gradient-gold">{roles?.[0] ?? ""}</span>;
  }

  return (
    <span className="text-gradient-gold text-gradient-glow inline-block" aria-live="polite" aria-atomic="true">
      {text || "\u00A0"}
      <span className="ml-0.5 inline-block w-0.5 h-[0.9em] -mb-[2px] bg-gold/70 animate-pulse" />
    </span>
  );
}

export function Hero() {
  const ctaRef = useRef<HTMLDivElement>(null);
  const { clickTrigger, handleClick } = useCTAClick();
  const prefersReduced = useReducedMotion();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const isBangla = language === "bn";
  const [cvOpen, setCvOpen] = useState(false);

  return (
    <section id="home" className="relative min-h-dvh pt-24 sm:pt-32 pb-16 sm:pb-20 overflow-hidden">
      <div className="aurora" />
      <div className="absolute inset-0 grid-bg opacity-60" />

      <div className="absolute top-1/4 -left-20 h-72 w-72 rounded-full bg-emerald-glow/20 blur-3xl animate-float" />
      <div
        className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-gold/10 blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-10 lg:gap-16 items-center">
          <div className="order-2 lg:order-1">
            <SmoothReveal
              direction="up"
              className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 glass-gold text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gold mb-6 max-w-full"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold animate-pulse" />
              <span className="truncate">{t("hero.badge")}</span>
            </SmoothReveal>

            <SmoothReveal direction="up" delay={0.1}>
              <h1 className={`font-display text-[2.5rem] sm:text-6xl lg:text-7xl font-semibold leading-[1.02] tracking-tight relative ${isBangla ? "my-2" : ""}`}>
                <FloatingTitleHighlight />
                <HoverTextGlow>
                  <span className="relative z-10 text-gradient-gold text-gradient-glow">
                    {t("hero.firstName")}<br />{t("hero.lastName")}
                  </span>
                </HoverTextGlow>
              </h1>
            </SmoothReveal>

            <SmoothReveal direction="up" delay={0.25}>
              <p className="mt-6 text-base sm:text-lg lg:text-xl text-muted-foreground max-w-xl">
                {t("hero.introPrefix")}<RotatingRole />
                {(() => {
                  const body = t("hero.body");
                  const idx = body.indexOf(",");
                  return idx >= 0 ? body.slice(idx) : ", " + body;
                })()}
              </p>
            </SmoothReveal>

            <SmoothReveal direction="up" delay={0.4}>
              <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 text-gold" />
                {t("hero.location")}
              </div>
            </SmoothReveal>

            <SmoothReveal direction="up" delay={0.5}>
              <div className="mt-8 flex flex-wrap gap-3">
                <div ref={ctaRef} className="relative inline-flex">
                  <CTAParticles containerRef={ctaRef} />
                  <a
                    href="#contact"
                    onClick={handleClick}
                    className="group relative inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium bg-gradient-to-br from-[oklch(0.85_0.14_88)] to-[oklch(0.65_0.16_75)] text-background hover:scale-[1.03] transition-all shadow-[var(--shadow-gold)]"
                  >
                    {t("hero.contactMe")}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <ClickWave trigger={clickTrigger} />
                </div>
                <button
                  onClick={() => setCvOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium glass hover:glass-gold transition-all"
                >
                  <Download className="h-4 w-4" /> {t("hero.downloadCv")}
                </button>
              </div>
            </SmoothReveal>

            <SmoothReveal direction="up" delay={0.7}>
              <div className="mt-10 flex items-center gap-3">
                {[
                  { Icon: Mail, href: "mailto:kholilebrahim2005@gmail.com", label: "hero.email" },
                  { Icon: Phone, href: "tel:+8801846827978", label: "hero.call" },
                  {
                    Icon: Facebook,
                    href: "https://www.facebook.com/md.ibrahim.kholil.652607",
                    label: "hero.facebook",
                  },
                  { Icon: Linkedin, href: "https://www.linkedin.com/in/ibrahim-khalil-2005", label: "hero.linkedin" },
                ].map(({ Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={t(label)}
                    className="grid h-11 w-11 place-items-center rounded-xl glass hover:glass-gold hover:-translate-y-1 transition-all"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </SmoothReveal>
          </div>

          <SmoothReveal direction="scale" delay={0.2} className="order-1 lg:order-2 relative">
            <motion.div className="relative mx-auto max-w-xs sm:max-w-sm lg:max-w-md">
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-br from-gold/30 via-emerald-glow/20 to-transparent blur-2xl" />
              <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-gold/60 via-emerald-glow/40 to-gold/60 opacity-70" />

              <div className="relative rounded-[1.85rem] overflow-hidden glass">
                <img
                  src={portrait}
                  alt={t("hero.heroAlt")}
                  width="480"
                  height="617"
                  className="w-full h-auto aspect-[7/9] object-cover"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                <motion.div
                  animate={prefersReduced ? {} : { y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute top-5 -left-2 sm:-left-6 rounded-2xl glass-gold px-4 py-3"
                  style={{ willChange: prefersReduced ? undefined : "transform" }}
                >
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t("hero.servingSince")}
                  </div>
                  <div className="text-lg font-display font-semibold text-gradient-gold">2023</div>
                </motion.div>

                <motion.div
                  animate={prefersReduced ? {} : { y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-6 -right-2 sm:-right-6 rounded-2xl glass px-4 py-3"
                  style={{ willChange: prefersReduced ? undefined : "transform" }}
                >
                  <div className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {t("hero.communityPrograms")}
                  </div>
                  <div className="text-lg font-display font-semibold text-gradient-emerald">120+</div>
                </motion.div>
              </div>
            </motion.div>
          </SmoothReveal>
        </div>
      </div>

      <AnimatePresence>
        {cvOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9998] flex items-center justify-center p-4 sm:p-6"
            onClick={() => setCvOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl overflow-hidden shadow-[0_0_60px_-12px_rgba(0,0,0,0.4)] outline-none flex flex-col"
              style={{
                background: "var(--glass-bg)",
                backdropFilter: "blur(24px) saturate(180%)",
                border: "var(--glass-border)",
              }}
            >
              <div
                className="px-6 py-4 border-b border-border/50 flex items-center justify-between shrink-0"
                style={{ background: "var(--glass-bg)" }}
              >
                <h2 className="font-display text-base font-semibold text-foreground">
                  {t("hero.firstName")} {t("hero.lastName")} — CV
                </h2>
                <div className="flex items-center gap-2">
                  <a
                    href={cvPdf}
                    download
                    className="inline-flex items-center gap-1.5 rounded-full glass-gold px-4 py-2 text-xs font-medium text-gold hover:glow-gold transition-all"
                  >
                    <Download className="h-3.5 w-3.5" /> {t("hero.downloadCv")}
                  </a>
                  <button
                    onClick={() => setCvOpen(false)}
                    aria-label="Close CV preview"
                    className="grid h-8 w-8 place-items-center rounded-lg hover:bg-accent/10 transition-colors text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 min-h-0">
                <iframe
                  src={cvPdf}
                  className="w-full h-full min-h-[70vh]"
                  title="CV Preview"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
