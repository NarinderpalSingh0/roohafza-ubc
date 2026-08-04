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

  const visionPoints = [
    {
      title: "Preserve Heritage",
      description:
        "Protecting the emotional connection and cultural identity that made Rooh Afza iconic.",
    },
    {
      title: "Create Relevance",
      description:
        "Building experiences that connect with new generations of consumers.",
    },
    {
      title: "Lead Tomorrow",
      description:
        "Transforming a century-old brand into a future-ready global identity.",
    },
  ];

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
    <div ref={rootRef}>
      <div>
        <header>
          <p ref={labelRef}>Future Vision</p>

          <h2 ref={headlineRef}>
            A Legacy That
            <br />
            Continues Forward.
          </h2>

          <p ref={introRef}>
            Reimagining Rooh Afza as a global cultural brand while keeping its
            timeless emotional connection alive.
          </p>
        </header>

        <div ref={cardsRef}>
          {visionPoints.map((point) => (
            <article key={point.title}>
              <h3>{point.title}</h3>
              <p>{point.description}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
