import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { VISION_ANIM } from "./visionAnimations";
import { animationRegistry } from "../../lib/animations/registry";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function VisionSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;

    if (!root) return;

    if (reducedMotion) {
      gsap.set(root.querySelectorAll("*"), {
        opacity: 1,
        y: 0,
      });
      return;
    }

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: VISION_ANIM.scroll.start,
        },
      });

      timeline
        .from(labelRef.current, {
          ...VISION_ANIM.header.label,
          opacity: 0,
          ease: VISION_ANIM.easing.reveal,
        })
        .from(headlineRef.current, {
          ...VISION_ANIM.header.headline,
          opacity: 0,
          ease: VISION_ANIM.easing.reveal,
        })
        .from(introRef.current, {
          ...VISION_ANIM.header.intro,
          opacity: 0,
          ease: VISION_ANIM.easing.reveal,
        });

      const cards = cardsRef.current?.children;

      if (cards) {
        gsap.from(cards, {
          ...VISION_ANIM.cards,
          opacity: 0,
          stagger: VISION_ANIM.cards.stagger,
          ease: VISION_ANIM.easing.reveal,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: VISION_ANIM.scroll.start,
          },
        });
      }

      animationRegistry.register(root, "vision-main", timeline);
    }, root);

    return () => {
      ctx.revert();
      animationRegistry.killAll(root);
    };
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="brand-section brand-section--primary">
      <div className="section-container">
        <header className="section-header">
          <p ref={labelRef} className="section-label">Future Vision</p>
        </header>

        <div ref={cardsRef} className="vision-statement">
          <h2 className="vision-statement__text">
            From a drink loved by generations,
            <br />
            to a culture carried worldwide.
          </h2>
        </div>
      </div>
    </div>
  );
}
