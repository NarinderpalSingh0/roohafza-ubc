import type { SectionId } from "../../types";
import { getLenis } from "../lenis";

export type ScrollDirection = "up" | "down" | "none";

export type ScrollSnapshot = {
  readonly activeSection: SectionId | null;
  readonly progress: number;
  readonly direction: ScrollDirection;
  readonly velocity: number;
  readonly scrollY: number;
};

export type ScrollListener = (snapshot: ScrollSnapshot) => void;

export class ScrollController {
  private observers = new Map<SectionId, IntersectionObserver>();
  private listeners = new Set<ScrollListener>();
  private sectionElements = new Map<SectionId, HTMLElement>();
  private activeSection: SectionId | null = null;
  private previousScrollY = 0;
  private snapshot: ScrollSnapshot = {
    activeSection: null,
    progress: 0,
    direction: "none",
    velocity: 0,
    scrollY: 0,
  };

  private handleScroll = (): void => {
    const lenis = getLenis();
    const scrollY = lenis?.scroll ?? window.scrollY;
    const maxScroll = lenis?.limit ?? document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? scrollY / maxScroll : 0;
    const delta = scrollY - this.previousScrollY;
    const direction: ScrollDirection = delta > 0 ? "down" : delta < 0 ? "up" : "none";
    const velocity = Math.abs(delta);

    this.previousScrollY = scrollY;
    this.snapshot = {
      activeSection: this.activeSection,
      progress,
      direction,
      velocity,
      scrollY,
    };
    this.notify();
  };

  private handleIntersection = (entries: IntersectionObserverEntry[]): void => {
    for (const entry of entries) {
      const sectionId = entry.target.getAttribute("data-section-id") as SectionId | null;
      if (!sectionId) continue;

      if (entry.isIntersecting) {
        this.activeSection = sectionId;
        this.handleScroll();
      }
    }
  };

  registerSection(id: SectionId, element: HTMLElement): void {
    this.sectionElements.set(id, element);

    if (!this.observers.has(id)) {
      const observer = new IntersectionObserver(this.handleIntersection, {
        rootMargin: "-40% 0px -40% 0px",
        threshold: 0,
      });
      this.observers.set(id, observer);
    }

    this.observers.get(id)?.observe(element);
  }

  unregisterSection(id: SectionId): void {
    const observer = this.observers.get(id);
    if (observer) {
      observer.disconnect();
      this.observers.delete(id);
    }
    this.sectionElements.delete(id);
  }

  scrollTo(id: SectionId): void {
    const element = this.sectionElements.get(id);
    if (element) {
      const lenis = getLenis();
      lenis?.scrollTo(element, { offset: 0, duration: 1.2 });
    }
  }

  subscribe(listener: ScrollListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener(this.snapshot);
    }
  }

  getSnapshot(): ScrollSnapshot {
    return this.snapshot;
  }

  attachScrollListener(): void {
    const lenis = getLenis();
    if (lenis) {
      lenis.on("scroll", this.handleScroll);
    } else {
      window.addEventListener("scroll", this.handleScroll, { passive: true });
    }
  }

  detachScrollListener(): void {
    const lenis = getLenis();
    if (lenis) {
      lenis.off("scroll", this.handleScroll);
    } else {
      window.removeEventListener("scroll", this.handleScroll);
    }
  }

  destroy(): void {
    for (const observer of this.observers.values()) {
      observer.disconnect();
    }
    this.observers.clear();
    this.sectionElements.clear();
    this.listeners.clear();
    this.detachScrollListener();
  }
}

export function createScrollController(): ScrollController {
  return new ScrollController();
}
