import type { gsap } from "gsap";

type GsapTimeline = ReturnType<typeof gsap.timeline>;

export class AnimationRegistry {
  private store = new WeakMap<HTMLElement, Map<string, GsapTimeline>>();

  register(
    element: HTMLElement,
    animationId: string,
    timeline: GsapTimeline,
  ): void {
    let animations = this.store.get(element);
    if (!animations) {
      animations = new Map();
      this.store.set(element, animations);
    }
    animations.set(animationId, timeline);
  }

  get(element: HTMLElement, animationId: string): GsapTimeline | undefined {
    return this.store.get(element)?.get(animationId);
  }

  kill(element: HTMLElement, animationId: string): void {
    const animations = this.store.get(element);
    if (animations) {
      const timeline = animations.get(animationId);
      if (timeline) {
        timeline.kill();
        animations.delete(animationId);
      }
      if (animations.size === 0) {
        this.store.delete(element);
      }
    }
  }

  killAll(element: HTMLElement): void {
    const animations = this.store.get(element);
    if (animations) {
      for (const timeline of animations.values()) {
        timeline.kill();
      }
      this.store.delete(element);
    }
  }

  has(element: HTMLElement, animationId: string): boolean {
    return this.store.get(element)?.has(animationId) ?? false;
  }
}

export const animationRegistry = new AnimationRegistry();
