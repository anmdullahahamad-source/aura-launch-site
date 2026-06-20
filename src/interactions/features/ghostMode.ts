import type { IFeature } from "../core/types";

export const ghostState = {
  triggers: 0,
  active: false,
};

const GHOST_MODE_FEATURE: IFeature = {
  id: "ghost-mode",
  name: "Ghost Mode Easter Effect",
  version: "1.0.0",
  priority: 2,

  onDeactivate() {
    ghostState.triggers = 0;
    ghostState.active = false;
  },

  onCleanup() {
    ghostState.triggers = 0;
    ghostState.active = false;
  },
};

export default GHOST_MODE_FEATURE;
