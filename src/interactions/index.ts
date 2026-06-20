export { InteractionController } from "./core/InteractionController";
export { FeatureRegistry } from "./core/FeatureRegistry";
export {
  InteractionProvider,
  useInteraction,
  useFeatureRegistration,
  useFeatureActivation,
} from "./core/InteractionProvider";
export type {
  IFeature,
  IInteractionController,
  RegisteredFeature,
  FeatureStatus,
  CleanupFn,
  TrackedListener,
} from "./core/types";

export { default as navLinksFeature } from "./features/navLinks";
export { NAV_LINKS, scrollToSection } from "./features/navLinks";
export type { NavLink } from "./features/navLinks";

export { default as commandCenterFeature } from "./features/commandCenter";
export { cmdState } from "./features/commandCenter";

export { default as loadingExperienceFeature } from "./features/loadingExperience";
export { loadingState } from "./features/loadingExperience";

export { default as ghostModeFeature } from "./features/ghostMode";
export { ghostState } from "./features/ghostMode";

export { default as rocketTrailFeature } from "./features/rocketTrail";
export { rocketTrailState } from "./features/rocketTrail";

export { default as sectionInteractionHubFeature } from "./features/sectionInteractionHub";
export { sectionHub, useSectionInteraction } from "./features/sectionInteractionHub";
