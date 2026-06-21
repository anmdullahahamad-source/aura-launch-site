import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  GraduationCap,
  Briefcase,
  Users,
  Award,
  Heart,
  Target,
  Mail,
  Search,
  ArrowRight,
  Command,
} from "lucide-react";
import { cmdState } from "../interactions/features/commandCenter";
import { useIsMobile } from "../hooks/useIsMobile";
import COMMAND_CENTER_FEATURE from "../interactions/features/commandCenter";
import { useFeatureRegistration, useFeatureActivation } from "../interactions";

interface Command {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
  sectionId: string;
}

interface CommandCenterContextType {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: boolean;
}

const CommandCenterContext = createContext<CommandCenterContextType | null>(null);

const COMMANDS: Command[] = [
  {
    id: "education",
    title: "Education",
    description: "View academic background and learning journey.",
    icon: <GraduationCap className="h-4 w-4" />,
    sectionId: "education",
  },
  {
    id: "experience",
    title: "Professional Experience",
    description: "Explore current role and professional development.",
    icon: <Briefcase className="h-4 w-4" />,
    sectionId: "experience",
  },
  {
    id: "leadership",
    title: "Leadership Journey",
    description: "View leadership positions and responsibilities.",
    icon: <Users className="h-4 w-4" />,
    sectionId: "leadership",
  },
  {
    id: "achievements",
    title: "Achievements",
    description: "See awards, recognition, and accomplishments.",
    icon: <Award className="h-4 w-4" />,
    sectionId: "achievements",
  },
  {
    id: "community",
    title: "Community Service",
    description: "Discover social initiatives and public engagement.",
    icon: <Heart className="h-4 w-4" />,
    sectionId: "testimonials",
  },
  {
    id: "vision",
    title: "Vision & Goals",
    description: "Read future ambitions and long-term vision.",
    icon: <Target className="h-4 w-4" />,
    sectionId: "about",
  },
  {
    id: "contact",
    title: "Contact",
    description: "Access contact information and social links.",
    icon: <Mail className="h-4 w-4" />,
    sectionId: "contact",
  },
];

function getModifier() {
  if (typeof navigator === "undefined") return "Ctrl";
  return /Mac|iPod|iPhone|iPad/.test(navigator.userAgent) ? "\u2318" : "Ctrl";
}

const listContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.03 },
  },
};

const listItem = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
};

export function CommandCenterProvider({ children }: { children: ReactNode }) {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const [mounted, setMounted] = useState(false);

  useFeatureRegistration(COMMAND_CENTER_FEATURE, []);
  useFeatureActivation("command-center", true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      previousFocus.current = document.activeElement as HTMLElement;
      const raf = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(raf);
    } else if (previousFocus.current) {
      previousFocus.current.focus();
      previousFocus.current = null;
    }
  }, [isOpen]);

  const openRef = useRef<() => void>(() => {});
  const closeRef = useRef<() => void>(() => {});
  const toggleRef = useRef<() => void>(() => {});

  useEffect(() => {
    openRef.current = () => {
      setIsOpen(true);
      setQuery("");
      setSelectedIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    };
    closeRef.current = () => {
      setIsOpen(false);
      setQuery("");
    };
    toggleRef.current = () => {
      setIsOpen((prev) => {
        if (!prev) {
          setQuery("");
          setSelectedIndex(0);
          requestAnimationFrame(() => inputRef.current?.focus());
        }
        return !prev;
      });
    };
  });

  useEffect(() => {
    cmdState.setDispatch({
      open: () => openRef.current(),
      close: () => closeRef.current(),
      toggle: () => toggleRef.current(),
    });
  }, []);

  useEffect(() => {
    cmdState.isOpen = isOpen;
  }, [isOpen]);

  const filtered = useMemo(() => {
    if (!query.trim()) return COMMANDS;
    const q = query.toLowerCase();
    return COMMANDS.filter(
      (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q),
    );
  }, [query]);

  const open = useCallback(() => cmdState.open(), []);
  const close = useCallback(() => cmdState.close(), []);
  const toggle = useCallback(() => cmdState.toggle(), []);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (e.key === "Tab") {
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusable = dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
        return;
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filtered.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filtered.length) % filtered.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = filtered[selectedIndex];
        if (cmd) executeCommand(cmd);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, filtered, selectedIndex, close]);

  useEffect(() => {
    const el = listRef.current?.children[selectedIndex] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  const executeCommand = useCallback(
    (command: Command) => {
      closeRef.current();
      requestAnimationFrame(() => {
        const el = document.getElementById(command.sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          el.classList.add("ring-2", "ring-gold/50", "transition-all", "duration-1000");
          setTimeout(() => {
            el.classList.remove("ring-2", "ring-gold/50", "transition-all", "duration-1000");
          }, 1500);
        }
      });
    },
    [], // closeRef is stable, no deps needed
  );

  return (
    <CommandCenterContext.Provider value={{ open, close, toggle, isOpen }}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[9999] flex items-start justify-center pt-[12vh] sm:pt-[18vh] px-4"
            onClick={close}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/60 backdrop-blur-sm"
            />

            <motion.div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="cmd-center-title"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.96, y: -12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg rounded-2xl border border-gold/10 shadow-[0_0_60px_-12px_rgba(0,0,0,0.4)] overflow-hidden outline-none"
              style={{ background: "var(--glass-bg)", backdropFilter: "blur(24px) saturate(180%)" }}
            >
              <div className="px-5 pt-5 pb-3 border-b border-border/50">
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className="grid h-8 w-8 place-items-center rounded-lg"
                    style={{
                      background: "var(--glass-gold-bg)",
                      border: "var(--glass-gold-border)",
                    }}
                  >
                    <Command className="h-4 w-4 text-gold" />
                  </div>
                  <div>
                    <h2
                      id="cmd-center-title"
                      className="font-display text-lg font-semibold text-foreground"
                    >
                      Command Center
                    </h2>
                    <p className="text-[11px] text-muted-foreground tracking-wide">
                      Navigate the portfolio quickly
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-5 pt-3 pb-2">
                <div className="relative">
                  <motion.div
                    className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    animate={{ rotate: query ? 90 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <Search className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                      setQuery(e.target.value);
                      setSelectedIndex(0);
                    }}
                    placeholder="Search sections..."
                    role="combobox"
                    aria-expanded={filtered.length > 0}
                    aria-controls="cmd-list"
                    aria-activedescendant={
                      filtered[selectedIndex] ? `cmd-opt-${filtered[selectedIndex].id}` : undefined
                    }
                    aria-label="Search sections"
                    className="w-full rounded-xl bg-accent/10 border border-border/50 px-9 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none focus:border-gold/40 focus:ring-2 focus:ring-gold/10 transition-all"
                  />
                  <kbd className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 rounded-md border border-border/50 bg-background/50 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground/60">
                    {getModifier()}K
                  </kbd>
                </div>
              </div>

              <div
                ref={listRef}
                id="cmd-list"
                role="listbox"
                aria-label="Commands"
                className="px-3 pb-3 max-h-[320px] overflow-y-auto"
              >
                {filtered.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="py-8 text-center"
                    role="status"
                    aria-live="polite"
                  >
                    <p className="text-sm text-muted-foreground">
                      No results for &ldquo;{query}&rdquo;
                    </p>
                    <p className="text-[11px] text-muted-foreground/50 mt-1">
                      Try a different search term
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    variants={listContainer}
                    initial="hidden"
                    animate="show"
                    className="space-y-0.5"
                  >
                    {filtered.map((command, i) => (
                      <motion.button
                        key={command.id}
                        id={`cmd-opt-${command.id}`}
                        role="option"
                        aria-selected={i === selectedIndex}
                        variants={listItem}
                        onClick={() => executeCommand(command)}
                        onMouseEnter={() => setSelectedIndex(i)}
                        className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-150 ${
                          i === selectedIndex ? "shadow-sm" : "hover:bg-accent/5"
                        }`}
                        style={
                          i === selectedIndex
                            ? {
                                background: "var(--glass-gold-bg)",
                                border: "var(--glass-gold-border)",
                              }
                            : {}
                        }
                      >
                        <div
                          className="grid h-8 w-8 shrink-0 place-items-center rounded-lg"
                          style={
                            i === selectedIndex
                              ? {
                                  background: "var(--glass-gold-bg)",
                                  border: "var(--glass-gold-border)",
                                }
                              : { background: "var(--glass-bg)", border: "var(--glass-border)" }
                          }
                        >
                          <span
                            className={
                              i === selectedIndex ? "text-gold" : "text-muted-foreground/70"
                            }
                          >
                            {command.icon}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className={`text-sm font-medium ${i === selectedIndex ? "text-foreground" : "text-foreground/80"}`}
                          >
                            {command.title}
                          </div>
                          <div className="text-[11px] text-muted-foreground/70 truncate">
                            {command.description}
                          </div>
                        </div>
                        <ArrowRight
                          className={`h-3.5 w-3.5 shrink-0 transition-all duration-200 ${
                            i === selectedIndex
                              ? "text-gold translate-x-0.5 opacity-100"
                              : "text-muted-foreground/20 opacity-0"
                          }`}
                        />
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>

              <div className="px-5 py-2.5 border-t border-border/50 flex items-center gap-4 text-[10px] text-muted-foreground/60">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border/50 bg-background/50 px-1 py-0.5 font-mono leading-none">
                    &#8593;
                  </kbd>
                  <kbd className="rounded border border-border/50 bg-background/50 px-1 py-0.5 font-mono leading-none">
                    &#8595;
                  </kbd>
                  <span>navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border/50 bg-background/50 px-1.5 py-0.5 font-mono leading-none">
                    &#8617;
                  </kbd>
                  <span>select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border border-border/50 bg-background/50 px-1.5 py-0.5 font-mono leading-none">
                    esc
                  </kbd>
                  <span>close</span>
                </span>
                <span
                  className="ml-auto text-[10px] text-muted-foreground/40"
                  role="status"
                  aria-live="polite"
                >
                  {filtered.length} commands
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {mounted && !isOpen && (
        <button
          onClick={open}
          className="fixed bottom-6 right-6 z-50 grid h-12 w-12 place-items-center rounded-full shadow-lg sm:hidden"
          style={{
            background: "var(--glass-gold-bg)",
            border: "var(--glass-gold-border)",
            backdropFilter: "blur(20px) saturate(180%)",
            boxShadow: "var(--shadow-gold)",
          }}
          aria-label="Open Command Center"
        >
          <Command className="h-5 w-5 text-gold" />
        </button>
      )}
    </CommandCenterContext.Provider>
  );
}

export function useCommandCenter(): CommandCenterContextType {
  const ctx = useContext(CommandCenterContext);
  if (!ctx) throw new Error("useCommandCenter must be used within CommandCenterProvider");
  return ctx;
}
