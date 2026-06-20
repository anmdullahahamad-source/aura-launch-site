import type { IFeature, IInteractionController } from "../core/types";

export const cmdState = {
  isOpen: false,
  open: () => {},
  close: () => {},
  toggle: () => {},
  setDispatch: (dispatch: { open: () => void; close: () => void; toggle: () => void }) => {
    cmdState.open = dispatch.open;
    cmdState.close = dispatch.close;
    cmdState.toggle = dispatch.toggle;
  },
};

const handleKeyDown = (e: Event) => {
  const ke = e as KeyboardEvent;
  if ((ke.metaKey || ke.ctrlKey) && ke.key === "k") {
    ke.preventDefault();
    cmdState.toggle();
  }
};

const COMMAND_CENTER_FEATURE: IFeature = {
  id: "command-center",
  name: "Command Center",
  version: "1.0.0",
  priority: 10,

  onActivate(controller: IInteractionController) {
    controller.addEventListener("command-center", window, "keydown", handleKeyDown);
  },

  onDeactivate() {
    cmdState.isOpen = false;
  },

  onCleanup() {
    cmdState.isOpen = false;
    cmdState.open = () => {};
    cmdState.close = () => {};
    cmdState.toggle = () => {};
    cmdState.setDispatch = () => {};
  },
};

export default COMMAND_CENTER_FEATURE;
