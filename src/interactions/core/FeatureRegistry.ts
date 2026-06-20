import type { IFeature, FeatureStatus, RegisteredFeature } from "./types";

export class FeatureRegistry {
  private features = new Map<string, RegisteredFeature>();

  register(feature: IFeature): void {
    if (this.features.has(feature.id)) {
      console.warn(`[Interaction] Feature "${feature.id}" is already registered. Skipping.`);
      return;
    }
    this.features.set(feature.id, {
      feature,
      status: "registered",
      registeredAt: Date.now(),
    });
  }

  unregister(id: string): boolean {
    if (!this.features.has(id)) return false;
    this.features.delete(id);
    return true;
  }

  get(id: string): RegisteredFeature | undefined {
    return this.features.get(id);
  }

  getAll(): RegisteredFeature[] {
    return Array.from(this.features.values());
  }

  getActive(): RegisteredFeature[] {
    return this.getAll().filter((f) => f.status === "active");
  }

  has(id: string): boolean {
    return this.features.has(id);
  }

  setStatus(id: string, status: FeatureStatus): void {
    const entry = this.features.get(id);
    if (!entry) return;
    entry.status = status;
    if (status === "active") {
      entry.activatedAt = Date.now();
      entry.deactivatedAt = undefined;
    }
    if (status === "inactive" || status === "error") {
      entry.deactivatedAt = Date.now();
    }
  }

  clear(): void {
    this.features.clear();
  }

  get size(): number {
    return this.features.size;
  }
}
