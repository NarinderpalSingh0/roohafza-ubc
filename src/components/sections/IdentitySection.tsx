import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { IDENTITY_ANIM } from "./identityAnimations";
import { animationRegistry } from "../../lib/animations/registry";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";

gsap.registerPlugin(ScrollTrigger);

export default function IdentitySection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const oldSideRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const newSideRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useReducedMotion();

  const oldIdentity = ["Traditional summer drink", "Family household staple", "Local icon"];
  const newIdentity = ["Cultural lifestyle brand", "Everyday personal ritual", "Global symbol"];

  useLayoutEffect(() => {
    const root = rootRef.current;
    const oldSide = oldSideRef.current;
    const arrow = arrowRef.current;
    const newSide = newSideRef.current;
    if (!root || !oldSide || !arrow || !newSide) return;

    const headerElements = headerRef.current?.children;

    if (prefersReducedMotion) {
      if (headerElements) gsap.set(headerElements, { opacity: 1, y: 0 });
      gsap.set([oldSide, arrow, newSide], { opacity: 1, y: 0, x: 0 });
      return;
    }

    const a = IDENTITY_ANIM;

    if (headerElements) {
      gsap.set(headerElements, { opacity: 0, y: a.header.y });
    }
    gsap.set(oldSide, { opacity: 0, x: -a.side.x });
    gsap.set(arrow, { opacity: 0, scale: a.arrow.scale });
    gsap.set(newSide, { opacity: 0, x: a.side.x });

    const ctx = gsap.context(() => {
      const headerTl = gsap.timeline({
        defaults: { ease: a.ease },
      });

      if (headerElements) {
        headerTl.to(headerElements, {
          opacity: 1,
          y: 0,
          duration: a.header.duration,
          stagger: a.header.stagger,
        });
      }

      animationRegistry.register(root, "identity-header", headerTl);

      const transformTl = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: a.scrollTrigger.start,
          toggleActions: "play none none reverse",
        },
      });

      transformTl
        .to(oldSide, {
          opacity: 1,
          x: 0,
          duration: a.side.duration,
          ease: a.ease,
        })
        .to(arrow, {
          opacity: 1,
          scale: 1,
          duration: a.arrow.duration,
          ease: a.ease,
        }, "+=0.3")
        .to(newSide, {
          opacity: 1,
          x: 0,
          duration: a.side.duration,
          ease: a.ease,
        }, "+=0.1");

      animationRegistry.register(root, "identity-transform", transformTl);
    }, root);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion]);

  return (
    <div ref={rootRef} className="brand-section brand-section--secondary">
      <div className="section-container">
        <header ref={headerRef} className="section-header">
          <p className="section-label">Our Identity</p>

          <h2 className="section-title">
            Tradition Built
            <br />
            for Tomorrow
          </h2>

          <p className="section-intro">
            Rooh Afza is not only a product. It is a symbol of heritage,
            trust, and timeless connection across generations.
          </p>
        </header>

        <div className="transformation-grid">
          <div ref={oldSideRef} className="transformation-side transformation-side--old">
            <span className="transformation-label">Then</span>
            <ul className="transformation-keywords">
              {oldIdentity.map((keyword) => (
                <li key={keyword} className="transformation-keyword">
                  {keyword}
                </li>
              ))}
            </ul>
          </div>

          <div ref={arrowRef} className="transformation-arrow" aria-hidden="true">
            <span className="transformation-arrow__symbol">&rarr;</span>
          </div>

          <div ref={newSideRef} className="transformation-side transformation-side--new">
            <span className="transformation-label">Now</span>
            <ul className="transformation-keywords">
              {newIdentity.map((keyword) => (
                <li key={keyword} className="transformation-keyword">
                  {keyword}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
