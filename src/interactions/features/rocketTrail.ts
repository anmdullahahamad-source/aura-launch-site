import type { IFeature } from "../core/types";

export const rocketTrailState = {
  active: true,
};

const ROCKET_TRAIL_FEATURE: IFeature = {
  id: "rocket-trail",
  name: "Rocket Trail Effect",
  version: "1.0.0",
  priority: 1,

  onDeactivate() {
    rocketTrailState.active = false;
  },

  onCleanup() {
    rocketTrailState.active = false;
  },
};

export default ROCKET_TRAIL_FEATURE;
