import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { InteractionController } from "./InteractionController";
import type { IFeature, IInteractionController, RegisteredFeature } from "./types";

interface InteractionContextValue {
  controller: IInteractionController;
  register: (feature: IFeature) => void;
  unregister: (id: string) => boolean;
  activate: (id: string) => Promise<boolean>;
  deactivate: (id: string) => Promise<boolean>;
  getFeature: (id: string) => RegisteredFeature | undefined;
  getActive: () => RegisteredFeature[];
  getAll: () => RegisteredFeature[];
  isActive: (id: string) => boolean;
}

const InteractionContext = createContext<InteractionContextValue | null>(null);

export function InteractionProvider({ children }: { children: ReactNode }) {
  const controllerRef = useRef<InteractionController>(null);

  if (!controllerRef.current) {
    controllerRef.current = new InteractionController();
  }

  useEffect(() => {
    const controller = controllerRef.current;
    return () => {
      controller.destroy();
      controllerRef.current = null;
    };
  }, []);

  const controller = controllerRef.current;

  const register = useCallback((feature: IFeature) => controller.register(feature), [controller]);
  const unregister = useCallback((id: string) => controller.unregister(id), [controller]);
  const activate = useCallback((id: string) => controller.activate(id), [controller]);
  const deactivate = useCallback((id: string) => controller.deactivate(id), [controller]);
  const getFeature = useCallback((id: string) => controller.getFeature(id), [controller]);
  const getActive = useCallback(() => controller.getActive(), [controller]);
  const getAll = useCallback(() => controller.getAll(), [controller]);
  const isActive = useCallback((id: string) => controller.isActive(id), [controller]);

  const value = useMemo<InteractionContextValue>(
    () => ({
      controller,
      register,
      unregister,
      activate,
      deactivate,
      getFeature,
      getActive,
      getAll,
      isActive,
    }),
    [
      controller,
      register,
      unregister,
      activate,
      deactivate,
      getFeature,
      getActive,
      getAll,
      isActive,
    ],
  );

  return <InteractionContext.Provider value={value}>{children}</InteractionContext.Provider>;
}

export function useInteraction(): InteractionContextValue {
  const ctx = useContext(InteractionContext);
  if (!ctx) {
    throw new Error("useInteraction must be used within an InteractionProvider");
  }
  return ctx;
}

export function useFeatureRegistration(feature: IFeature, deps: unknown[] = []) {
  const { register, unregister } = useInteraction();

  useEffect(() => {
    register(feature);
    return () => {
      unregister(feature.id);
    };
  }, deps);
}

export function useFeatureActivation(featureId: string, active: boolean) {
  const { activate, deactivate } = useInteraction();

  useEffect(() => {
    if (active) {
      activate(featureId);
    } else {
      deactivate(featureId);
    }
  }, [featureId, active]);
}
