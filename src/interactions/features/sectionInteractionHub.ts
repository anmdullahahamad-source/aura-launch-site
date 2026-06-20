import { useState, useCallback, useEffect, useRef } from "react";
import type { IFeature, IInteractionController } from "../core/types";

export type SectionId =
  | "education"
  | "experience"
  | "leadership"
  | "achievements"
  | "testimonials"
  | "contact"
  | "gallery"
  | "community"
  | "hero";

export const sectionHub = {
  _counters: {} as Partial<Record<SectionId, number>>,

  get(sectionId: SectionId): number {
    return this._counters[sectionId] ?? 0;
  },

  trigger(sectionId: SectionId): number {
    this._counters[sectionId] = (this._counters[sectionId] ?? 0) + 1;
    return this._counters[sectionId];
  },

  reset(sectionId: SectionId): void {
    this._counters[sectionId] = 0;
  },

  resetAll(): void {
    this._counters = {};
  },
};

export function useSectionInteraction(sectionId: SectionId, onActivate?: () => void) {
  const [hovered, setHovered] = useState(false);
  const [activated, setActivated] = useState(0);
  const [showGlow, setShowGlow] = useState(false);
  const lastTrigger = useRef(0);
  const glowTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const onActivateRef = useRef(onActivate);
  onActivateRef.current = onActivate;

  const handleClick = useCallback(() => {
    const now = Date.now();
    if (now - lastTrigger.current < 200) return;
    lastTrigger.current = now;
    sectionHub.trigger(sectionId);
    setActivated((p) => p + 1);
    setShowGlow(true);
    onActivateRef.current?.();
    if (glowTimer.current) clearTimeout(glowTimer.current);
    glowTimer.current = setTimeout(() => setShowGlow(false), 1200);
  }, [sectionId]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleClick();
      }
    },
    [handleClick],
  );

  useEffect(() => {
    return () => {
      if (glowTimer.current) clearTimeout(glowTimer.current);
    };
  }, []);

  return { hovered, setHovered, activated, showGlow, handleClick, handleKeyDown };
}

const SECTION_INTERACTION_HUB_FEATURE: IFeature = {
  id: "section-interaction-hub",
  name: "Section Interaction Hub",
  version: "1.0.0",
  priority: 3,

  onRegister(controller: IInteractionController) {
    sectionHub.resetAll();
  },

  onDeactivate() {
    sectionHub.resetAll();
  },

  onCleanup() {
    sectionHub.resetAll();
  },
};

export default SECTION_INTERACTION_HUB_FEATURE;
