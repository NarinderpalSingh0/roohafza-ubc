import Lenis from "lenis";

let lenis: Lenis | null = null;
let rafId: number | null = null;

function raf(time: number): void {
  lenis?.raf(time);
  rafId = requestAnimationFrame(raf);
}

export function initLenis(): Lenis {
  if (lenis) return lenis;

  lenis = new Lenis({
    smoothWheel: true,
    duration: 1.2,
    lerp: 0.1,
  });

  rafId = requestAnimationFrame(raf);

  return lenis;
}

export function getLenis(): Lenis | null {
  return lenis;
}

export function destroyLenis(): void {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  lenis?.destroy();
  lenis = null;
}
