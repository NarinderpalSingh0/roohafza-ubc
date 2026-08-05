import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { FINAL_ANIM } from "./finalAnimations";
import { animationRegistry } from "../../lib/animations/registry";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function FinalSection() {
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
          start: FINAL_ANIM.scroll.start,
        },
      });

      timeline
        .from(labelRef.current, {
          ...FINAL_ANIM.header.label,
          opacity: 0,
          ease: FINAL_ANIM.easing.reveal,
        })
        .from(headlineRef.current, {
          ...FINAL_ANIM.header.headline,
          opacity: 0,
          ease: FINAL_ANIM.easing.reveal,
        })
        .from(introRef.current, {
          ...FINAL_ANIM.header.intro,
          opacity: 0,
          ease: FINAL_ANIM.easing.reveal,
        });

      const cards = cardsRef.current?.children;

      if (cards) {
        gsap.from(cards, {
          ...FINAL_ANIM.cards,
          opacity: 0,
          stagger: FINAL_ANIM.cards.stagger,
          ease: FINAL_ANIM.easing.reveal,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: FINAL_ANIM.scroll.start,
          },
        });
      }

      animationRegistry.register(root, "final-main", timeline);
    }, root);

    return () => {
      ctx.revert();
      animationRegistry.killAll(root);
    };
  }, [reducedMotion]);

  return (
    <div ref={rootRef} className="brand-section brand-section--dark">
      <div className="section-container">
        <header className="section-header">
          <p ref={labelRef} className="section-label">The Next Chapter</p>
        </header>

        <div ref={cardsRef} className="final-closing">
          <h2 ref={headlineRef} className="final-closing__headline">
            Rooh Afza.
          </h2>
          <p ref={introRef} className="final-closing__statement">
            A century of trust.
            <br />
            The next century of imagination.
          </p>
        </div>
      </div>
    </div>
  );
}
