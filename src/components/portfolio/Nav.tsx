import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Menu, X, Globe, Sun, Moon } from "lucide-react";
import { useTranslation, useLanguage } from "../../lib/i18n";
import { useTheme } from "../../lib/theme";
import { useActiveSection } from "../../hooks/useActiveSection";
import { useIsMobile } from "../../hooks/useIsMobile";
import { throttle } from "../../hooks/useThrottle";

const links = [
  { href: "#about", key: "nav.about" },
  { href: "#leadership", key: "nav.leadership" },
  { href: "#experience", key: "nav.experience" },
  { href: "#skills", key: "nav.skills" },
  { href: "#projects", key: "nav.projects" },
  { href: "#gallery", key: "nav.gallery" },
  { href: "#contact", key: "nav.contact" },
];

const LINK_IDS = links.map((l) => l.href.slice(1));

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const activeSection = useActiveSection(LINK_IDS);
  const { t } = useTranslation();
  const { language, setLanguage } = useLanguage();
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    const throttled = throttle(onScroll, 100);
    window.addEventListener("scroll", throttled, { passive: true });
    return () => window.removeEventListener("scroll", throttled);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <nav
          className={`flex items-center justify-between gap-4 rounded-2xl px-4 sm:px-6 py-3 transition-all ${
            scrolled ? "glass" : ""
          }`}
        >
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 group text-left"
          >
            <div className="grid h-9 w-9 place-items-center rounded-xl glass-gold">
              <span className="text-gradient-gold font-display text-lg font-bold">I</span>
            </div>
            <div className="font-display text-base font-semibold tracking-tight">
              Ibrahim Khalil
            </div>
          </button>

          <ul className="hidden lg:flex items-center gap-1 text-sm">
            {links.map((l) => {
              const id = l.href.slice(1);
              const isActive = activeSection === id;
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    className={`relative px-3 py-2 rounded-lg transition-all duration-300 ${
                      isActive ? "text-gold" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t(l.key)}
                    {isActive && (
                      <motion.div
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg -z-10"
                        style={{
                          background: "var(--glass-gold-bg)",
                          border: "var(--glass-gold-border)",
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full glass px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:glass-gold transition-all"
              aria-label={theme === "dark" ? "Switch to light theme" : "Switch to default theme"}
            >
              <span>{theme === "dark" ? "Light" : "Default"}</span>
            </button>
            <button
              onClick={() => setLanguage(language === "en" ? "bn" : "en")}
              className="hidden sm:inline-flex items-center gap-1.5 rounded-full glass px-3 py-2 text-xs font-medium text-muted-foreground hover:text-foreground hover:glass-gold transition-all"
              aria-label={`Switch to ${language === "en" ? "Bangla" : "English"}`}
            >
              <Globe className="h-3.5 w-3.5" />
              <span>{language === "en" ? "BN" : "EN"}</span>
            </button>

            <a
              href="#contact"
              className="hidden lg:inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium glass-gold text-gold hover:glow-gold transition-all"
            >
              {t("nav.getInTouch")}
            </a>

            <div className="flex items-center gap-1 lg:hidden">
              <button
                onClick={toggle}
                className="grid h-11 w-11 place-items-center rounded-xl glass"
                aria-label={theme === "dark" ? "Switch to light theme" : "Switch to default theme"}
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setLanguage(language === "en" ? "bn" : "en")}
                className="grid h-11 w-11 place-items-center rounded-xl glass"
                aria-label={`Switch to ${language === "en" ? "Bangla" : "English"}`}
              >
                <Globe className="h-4 w-4" />
                <span className="text-[10px] font-semibold">{language === "en" ? "BN" : "EN"}</span>
              </button>
            </div>

            <button
              aria-label={t("nav.toggleMenu")}
              onClick={() => setOpen(!open)}
              className="lg:hidden grid h-11 w-11 place-items-center rounded-xl glass"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:hidden mt-2 rounded-2xl glass p-4"
            >
              <ul className="flex flex-col gap-1">
                {links.map((l) => {
                  const id = l.href.slice(1);
                  const isActive = activeSection === id;
                  return (
                    <li key={l.href}>
                      <a
                        onClick={() => setOpen(false)}
                        href={l.href}
                        className={`block px-4 py-3 rounded-xl text-sm transition-all ${
                          isActive ? "text-gold" : "hover:bg-white/5 text-muted-foreground"
                        }`}
                        style={
                          isActive
                            ? {
                                background: "var(--glass-gold-bg)",
                                border: "var(--glass-gold-border)",
                              }
                            : {}
                        }
                      >
                        {t(l.key)}
                      </a>
                    </li>
                  );
                })}
              </ul>

              <hr className="my-4 border-white/10" />
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { toggle(); setOpen(false); }}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                  aria-label={theme === "dark" ? "Switch to light theme" : "Switch to default theme"}
                >
                  {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  <span>{theme === "dark" ? "Light Mode" : "Default Mode"}</span>
                </button>
                <button
                  onClick={() => { setLanguage(language === "en" ? "bn" : "en"); setOpen(false); }}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                  aria-label={`Switch to ${language === "en" ? "Bangla" : "English"}`}
                >
                  <Globe className="h-4 w-4" />
                  <span>{language === "en" ? "বাংলা" : "English"}</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
