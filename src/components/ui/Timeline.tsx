import { useRef, type ReactNode } from "react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface TimelineProps {
  children: ReactNode;
  className?: string;
}

export function Timeline({ children, className = "" }: TimelineProps) {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start center", "end center"],
  });

  const lineScaleY = useTransform(scrollYProgress, [0.1, 0.9], [0, 1]);

  return (
    <div ref={ref} className={`relative max-w-3xl mx-auto ${className}`}>
      <div
        aria-hidden="true"
        className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 overflow-hidden"
      >
        {prefersReduced || isMobile ? (
          <div className="h-full w-full" style={{ background: "var(--timeline-line)" }} />
        ) : (
          <motion.div
            className="h-full w-full origin-top"
            style={{
              background: "var(--timeline-line)",
              scaleY: lineScaleY,
            }}
          />
        )}
      </div>
      {children}
    </div>
  );
}

interface TimelineItemProps {
  icon?: ReactNode;
  date?: string;
  title: string;
  org?: string;
  description?: string;
  children?: ReactNode;
  index?: number;
  side?: "left" | "right";
  className?: string;
}

export function TimelineItem({
  icon,
  date,
  title,
  org,
  description,
  children,
  index = 0,
  side = "left",
  className = "",
}: TimelineItemProps) {
  const prefersReduced = useReducedMotion();
  const isMobile = useIsMobile();
  const isLeft = side === "left";

  return (
    <div
      className={`relative flex mb-10 last:mb-0 ${className}`}
    >
      <div className={`flex-1 ${isLeft ? "pr-8 sm:pr-12" : "pl-8 sm:pl-12"}`}>
        <div
          className="glass rounded-2xl p-5 sm:p-6 transition-all duration-400"
          style={{
            background: "var(--glass-bg)",
            border: "var(--glass-border)",
          }}
        >
          {icon && (
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-gold mb-2">
              {icon}
              {date}
            </div>
          )}
          {!icon && date && (
            <div className="text-xs uppercase tracking-widest text-gold mb-2">{date}</div>
          )}
          <h3 className="font-display text-lg sm:text-xl font-semibold leading-tight">{title}</h3>
          {org && <div className="text-sm text-muted-foreground mt-1">{org}</div>}
          {description && (
            <p className="text-sm text-muted-foreground/80 mt-3 leading-relaxed">{description}</p>
          )}
          {children}
        </div>
      </div>

      <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 top-6 z-10">
        {prefersReduced || isMobile ? (
          <div className="grid h-4 w-4 place-items-center">
            <div className="h-3 w-3 rounded-full bg-gradient-to-br from-gold to-emerald-glow" style={{ boxShadow: "var(--timeline-dot-shadow)" }} />
          </div>
        ) : (
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 12,
              delay: index * 0.12 + 0.15,
            }}
            className="grid h-4 w-4 place-items-center"
          >
            <div className="h-3 w-3 rounded-full bg-gradient-to-br from-gold to-emerald-glow" style={{ boxShadow: "var(--timeline-dot-shadow)" }} />
          </motion.div>
        )}
      </div>

      <div className="flex-1 hidden sm:block" />
    </div>
  );
}

export function TimelineLeft({
  icon,
  date,
  title,
  org,
  description,
  children,
  index = 0,
  className = "",
}: TimelineItemProps) {
  return (
    <TimelineItem
      icon={icon}
      date={date}
      title={title}
      org={org}
      description={description}
      children={children}
      index={index}
      side="left"
      className={className}
    />
  );
}

export function TimelineRight({
  icon,
  date,
  title,
  org,
  description,
  children,
  index = 0,
  className = "",
}: TimelineItemProps) {
  return (
    <TimelineItem
      icon={icon}
      date={date}
      title={title}
      org={org}
      description={description}
      children={children}
      index={index}
      side="right"
      className={className}
    />
  );
}
