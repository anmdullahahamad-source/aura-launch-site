import type { IFeature } from "../core/types";

export const loadingState = {
  pageLoaded: false,
  onPageReady: () => {},
  setDispatch: (dispatch: { onPageReady: () => void }) => {
    loadingState.onPageReady = dispatch.onPageReady;
  },
};

const LOADING_EXPERIENCE_FEATURE: IFeature = {
  id: "loading-experience",
  name: "Loading Experience",
  version: "1.0.0",
  priority: 1,

  onDeactivate() {
    loadingState.pageLoaded = true;
  },

  onCleanup() {
    loadingState.pageLoaded = true;
    loadingState.onPageReady = () => {};
    loadingState.setDispatch = () => {};
  },
};

export default LOADING_EXPERIENCE_FEATURE;
