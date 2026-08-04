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
    <div ref={rootRef}>
      <div>
        <header>
          <p ref={labelRef}>The Next Chapter</p>

          <h2 ref={headlineRef}>
            Rooh Afza.
            <br />
            Ready For Tomorrow.
          </h2>

          <p ref={introRef}>
            A century of trust transformed into a future-focused brand built
            for new generations across the world.
          </p>
        </header>

        <div ref={cardsRef}>
          <article>
            <h3>Heritage</h3>
            <p>
              Preserving the emotional connection that has made Rooh Afza a
              household name for generations.
            </p>
          </article>

          <article>
            <h3>Innovation</h3>
            <p>
              Creating modern experiences through products, technology, and
              digital connections.
            </p>
          </article>

          <article>
            <h3>Global Future</h3>
            <p>
              Carrying Indian culture and identity to consumers around the
              world.
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
