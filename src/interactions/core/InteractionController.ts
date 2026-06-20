import { FeatureRegistry } from "./FeatureRegistry";
import type { IFeature, IInteractionController, RegisteredFeature, TrackedListener } from "./types";

export class InteractionController implements IInteractionController {
  private registry = new FeatureRegistry();
  private listeners: TrackedListener[] = [];
  private rafCallbacks = new Map<string, (time: number) => void>();
  private rafId: number | null = null;
  private destroyed = false;

  register(feature: IFeature): void {
    if (this.destroyed) return;
    this.registry.register(feature);
    feature.onRegister?.(this);
  }

  unregister(id: string): boolean {
    if (this.destroyed) return false;
    if (!this.registry.has(id)) return false;
    const entry = this.registry.get(id);
    if (entry?.status === "active") {
      entry.feature.onDeactivate?.(this);
    }
    entry?.feature.onCleanup?.(this);
    this.removeAllFeatureListeners(id);
    this.cancelAnimationFrame(id);
    return this.registry.unregister(id);
  }

  async activate(id: string): Promise<boolean> {
    if (this.destroyed) return false;
    const entry = this.registry.get(id);
    if (!entry) {
      console.warn(`[Interaction] Cannot activate unknown feature "${id}"`);
      return false;
    }
    if (entry.status === "active") return true;

    try {
      this.registry.setStatus(id, "active");
      await entry.feature.onActivate?.(this);
      this.startRafLoop();
      return true;
    } catch (err) {
      this.registry.setStatus(id, "error");
      entry.error = err instanceof Error ? err : new Error(String(err));
      console.error(`[Interaction] Failed to activate feature "${id}":`, err);
      return false;
    }
  }

  async deactivate(id: string): Promise<boolean> {
    if (this.destroyed) return false;
    const entry = this.registry.get(id);
    if (!entry || entry.status !== "active") return false;

    try {
      this.registry.setStatus(id, "inactive");
      await entry.feature.onDeactivate?.(this);
      this.removeAllFeatureListeners(id);
      this.cancelAnimationFrame(id);
      this.stopRafLoopIfEmpty();
      return true;
    } catch (err) {
      console.error(`[Interaction] Error deactivating feature "${id}":`, err);
      return false;
    }
  }

  getFeature(id: string): RegisteredFeature | undefined {
    return this.registry.get(id);
  }

  getActive(): RegisteredFeature[] {
    return this.registry.getActive();
  }

  getAll(): RegisteredFeature[] {
    return this.registry.getAll();
  }

  isActive(id: string): boolean {
    return this.registry.get(id)?.status === "active";
  }

  addEventListener(
    featureId: string,
    target: EventTarget,
    type: string,
    handler: EventListener,
    options?: AddEventListenerOptions,
  ): void {
    if (this.destroyed) return;
    const listener: TrackedListener = { featureId, target, type, handler, options };
    this.listeners.push(listener);
    target.addEventListener(type, handler, options);
  }

  removeEventListener(
    featureId: string,
    target: EventTarget,
    type: string,
    handler: EventListener,
  ): void {
    const idx = this.listeners.findIndex(
      (l) =>
        l.featureId === featureId &&
        l.target === target &&
        l.type === type &&
        l.handler === handler,
    );
    if (idx !== -1) {
      const [listener] = this.listeners.splice(idx, 1);
      listener.target.removeEventListener(listener.type, listener.handler, listener.options);
    }
  }

  private removeAllFeatureListeners(featureId: string): void {
    const remaining: TrackedListener[] = [];
    for (const listener of this.listeners) {
      if (listener.featureId === featureId) {
        listener.target.removeEventListener(listener.type, listener.handler, listener.options);
      } else {
        remaining.push(listener);
      }
    }
    this.listeners = remaining;
  }

  requestAnimationFrame(featureId: string, callback: (time: number) => void): void {
    this.rafCallbacks.set(featureId, callback);
    this.startRafLoop();
  }

  cancelAnimationFrame(featureId: string): void {
    this.rafCallbacks.delete(featureId);
    this.stopRafLoopIfEmpty();
  }

  private startRafLoop(): void {
    if (this.rafId !== null || this.destroyed) return;
    const loop = (time: number) => {
      if (this.destroyed) return;
      if (this.rafCallbacks.size === 0) {
        this.rafId = null;
        return;
      }
      for (const callback of this.rafCallbacks.values()) {
        try {
          callback(time);
        } catch (err) {
          console.error("[Interaction] Error in RAF callback:", err);
        }
      }
      this.rafId = requestAnimationFrame(loop);
    };
    this.rafId = requestAnimationFrame(loop);
  }

  private stopRafLoopIfEmpty(): void {
    if (this.rafCallbacks.size === 0 && this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  destroy(): void {
    this.destroyed = true;

    for (const entry of this.registry.getAll()) {
      if (entry.status === "active") {
        entry.feature.onDeactivate?.(this);
      }
      entry.feature.onCleanup?.(this);
    }

    for (const listener of this.listeners) {
      listener.target.removeEventListener(listener.type, listener.handler, listener.options);
    }
    this.listeners = [];

    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.rafCallbacks.clear();
    this.registry.clear();
  }

  get isDestroyed(): boolean {
    return this.destroyed;
  }

  get featureCount(): number {
    return this.registry.size;
  }
}
