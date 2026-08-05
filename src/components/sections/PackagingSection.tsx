import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { PACKAGING_ANIM } from "./packagingAnimations";
import { animationRegistry } from "../../lib/animations/registry";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";
import ImageAsset from "../ui/ImageAsset";

gsap.registerPlugin(ScrollTrigger);

export default function PackagingSection() {
  const rootRef = useRef<HTMLDivElement>(null);

  const labelRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const reducedMotion = useReducedMotion();

  const features = [
    {
      title: "Heritage Reimagined",
      description:
        "A modern packaging language that respects Rooh Afza's century-old legacy while connecting with new generations.",
    },
    {
      title: "Premium Experience",
      description:
        "Thoughtful design, refined materials, and visual storytelling transform every bottle into a memorable experience.",
    },
    {
      title: "Sustainable Future",
      description:
        "Packaging designed with responsible materials and future-focused environmental thinking.",
    },
    {
      title: "Global Identity",
      description:
        "A distinctive visual system that carries Indian heritage to consumers around the world.",
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

    const productEl = root.querySelector(".product-hero__visual");
    const captionEl = root.querySelector(".product-hero__caption");

    const ctx = gsap.context(() => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: PACKAGING_ANIM.scroll.start,
        },
      });

      timeline
        .from(labelRef.current, {
          ...PACKAGING_ANIM.header.label,
          opacity: 0,
          ease: PACKAGING_ANIM.easing.reveal,
        })
        .from(headlineRef.current, {
          ...PACKAGING_ANIM.header.headline,
          opacity: 0,
          ease: PACKAGING_ANIM.easing.reveal,
        })
        .from(introRef.current, {
          ...PACKAGING_ANIM.header.intro,
          opacity: 0,
          ease: PACKAGING_ANIM.easing.reveal,
        });

      if (productEl) {
        gsap.from(productEl, {
          opacity: 0,
          scale: PACKAGING_ANIM.product.scale,
          duration: PACKAGING_ANIM.product.duration,
          ease: PACKAGING_ANIM.easing.reveal,
          scrollTrigger: {
            trigger: productEl,
            start: PACKAGING_ANIM.scroll.start,
          },
        });
      }

      if (captionEl) {
        gsap.from(captionEl, {
          opacity: 0,
          y: PACKAGING_ANIM.caption.y,
          duration: PACKAGING_ANIM.caption.duration,
          ease: PACKAGING_ANIM.easing.reveal,
          scrollTrigger: {
            trigger: captionEl,
            start: PACKAGING_ANIM.scroll.start,
          },
        });
      }

      const cards = cardsRef.current?.children;

      if (cards) {
        gsap.from(cards, {
          ...PACKAGING_ANIM.features,
          opacity: 0,
          stagger: PACKAGING_ANIM.features.stagger,
          ease: PACKAGING_ANIM.easing.reveal,
          scrollTrigger: {
            trigger: cardsRef.current,
            start: PACKAGING_ANIM.scroll.start,
          },
        });
      }

      animationRegistry.register(root, "packaging-header", timeline);
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
          <p ref={labelRef} className="section-label">Packaging Evolution</p>

          <h2 ref={headlineRef} className="section-title">
            A Century of
            <br />
            Heritage, Redesigned
          </h2>

          <p ref={introRef} className="section-intro">
            Reimagining Rooh Afza packaging for modern consumers while
            preserving the emotional connection built across generations.
          </p>
        </header>

        <div className="product-hero">
          <div className="product-hero__visual">
            <ImageAsset
              src="/assets/images/packaging/bottles.jpg"
              alt="Three redesigned Rooh Afza bottles — mango, rose, and pineapple — on dark background"
              aspect="video"
              animation="scale"
              className="product-hero__image"
            />
          </div>
          <p className="product-hero__caption">
            Heritage preserved. Design reinvented.
          </p>
        </div>

        <div ref={cardsRef} className="product-features">
          {features.map((feature) => (
            <div key={feature.title} className="product-feature">
              <h3 className="product-feature__title">{feature.title}</h3>
              <p className="product-feature__description">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="section-cta">
          <a href="#innovation" className="cta-button">
            Experience The Redesign <span aria-hidden="true">&rarr;</span>
          </a>
        </div>
      </div>
    </div>
  );
}
