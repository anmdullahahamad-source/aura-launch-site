export type FeatureStatus = "registered" | "active" | "inactive" | "error";

export type CleanupFn = () => void;

export interface IFeature {
  id: string;
  name: string;
  version?: string;
  priority?: number;
  onRegister?(controller: IInteractionController): void | Promise<void>;
  onActivate?(controller: IInteractionController): void | Promise<void>;
  onDeactivate?(controller: IInteractionController): void | Promise<void>;
  onCleanup?(controller: IInteractionController): void | Promise<void>;
}

export interface RegisteredFeature {
  feature: IFeature;
  status: FeatureStatus;
  registeredAt: number;
  activatedAt?: number;
  deactivatedAt?: number;
  error?: Error;
}

export interface TrackedListener {
  featureId: string;
  target: EventTarget;
  type: string;
  handler: EventListener;
  options?: AddEventListenerOptions;
}

export interface IInteractionController {
  register(feature: IFeature): void;
  unregister(id: string): boolean;
  activate(id: string): Promise<boolean>;
  deactivate(id: string): Promise<boolean>;
  getFeature(id: string): RegisteredFeature | undefined;
  getActive(): RegisteredFeature[];
  getAll(): RegisteredFeature[];
  isActive(id: string): boolean;
  addEventListener(
    featureId: string,
    target: EventTarget,
    type: string,
    handler: EventListener,
    options?: AddEventListenerOptions,
  ): void;
  removeEventListener(
    featureId: string,
    target: EventTarget,
    type: string,
    handler: EventListener,
  ): void;
  requestAnimationFrame(featureId: string, callback: (time: number) => void): void;
  cancelAnimationFrame(featureId: string): void;
  destroy(): void;
}
