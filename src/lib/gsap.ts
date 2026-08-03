import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let initialized = false;

export function initGsap(): typeof gsap {
  if (!initialized) {
    gsap.registerPlugin(ScrollTrigger);
    initialized = true;
  }
  return gsap;
}

export { gsap, ScrollTrigger };
