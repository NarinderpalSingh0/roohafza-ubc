import { useRef, useEffect } from "react";
import { gsap } from "../../lib/gsap";
import { animationRegistry } from "../../lib/animations/registry";
import { useReducedMotion } from "../../lib/scroll/useReducedMotion";
import { HERO_ANIM } from "./heroAnimations";

const HERO_HEADLINE = "Rooh Afza";
const HERO_SUBTITLE = "A Century of Tradition. Reimagined for a New Generation.";
const HERO_CTA_LABEL = "Explore The New Rooh Afza";
const HERO_SCROLL_LABEL = "Scroll to explore";

const styles = {
  root: {
    position: "relative" as const,
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "var(--color-bg-hero)",
    overflow: "hidden",
  },
  background: {
    position: "absolute" as const,
    inset: 0,
    background: "linear-gradient(160deg, var(--color-primary) 0%, var(--color-primary-dark) 50%, var(--color-charcoal) 100%)",
    zIndex: 0,
  },
  content: {
    position: "relative" as const,
    zIndex: 1,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center" as const,
    padding: "var(--spacing-container-padding)",
    maxWidth: "var(--spacing-container-max)",
    width: "100%",
  },
  brandMark: {
    fontFamily: "var(--font-heading)",
    fontSize: "var(--font-size-xs, 0.75rem)",
    fontWeight: 600,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "var(--color-text-gold)",
    marginBottom: "2rem",
  },
  headline: {
    fontFamily: "var(--font-heading)",
    fontSize: "clamp(3rem, 8vw, 8rem)",
    fontWeight: 700,
    lineHeight: 1.05,
    letterSpacing: "-0.03em",
    color: "var(--color-text-inverse)",
    margin: "0 0 1.5rem",
  },
  subtitle: {
    fontFamily: "var(--font-body)",
    fontSize: "clamp(1rem, 2vw, 1.375rem)",
    fontWeight: 400,
    lineHeight: 1.6,
    color: "rgba(255, 255, 255, 0.8)",
    maxWidth: "36rem",
    margin: "0 0 2.5rem",
  },
  cta: {
    display: "inline-flex",
    alignItems: "center",
    gap: "0.75rem",
    padding: "1.25rem 2.5rem",
    fontFamily: "var(--font-body)",
    fontSize: "1rem",
    fontWeight: 700,
    letterSpacing: "0.04em",
    textTransform: "uppercase" as const,
    color: "var(--color-text-inverse)",
    backgroundColor: "var(--color-gold)",
    border: "none",
    borderRadius: "var(--radius-md)",
    cursor: "pointer",
    textDecoration: "none",
    transition: "background-color 0.2s ease, transform 0.2s ease",
  },
  scrollIndicator: {
    position: "absolute" as const,
    bottom: "2rem",
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    gap: "0.5rem",
    color: "rgba(255, 255, 255, 0.6)",
    fontFamily: "var(--font-body)",
    fontSize: "0.75rem",
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
  },
  scrollLine: {
    width: "1px",
    height: "2.5rem",
    backgroundColor: "rgba(255, 255, 255, 0.4)",
  },
} as const;

function setInitialState(
  refs: {
    background: HTMLDivElement;
    brandMark: HTMLParagraphElement;
    headline: HTMLHeadingElement;
    subtitle: HTMLParagraphElement;
    cta: HTMLAnchorElement;
    scrollIndicator: HTMLDivElement;
  },
  reduced: boolean,
) {
  if (reduced) {
    gsap.set(refs.background, { opacity: 1 });
    gsap.set(refs.brandMark, { opacity: 1, y: 0 });
    gsap.set(refs.headline, { opacity: 1, y: 0 });
    gsap.set(refs.subtitle, { opacity: 1, y: 0 });
    gsap.set(refs.cta, { opacity: 1, scale: 1 });
    gsap.set(refs.scrollIndicator, { opacity: 1 });
    return;
  }

  gsap.set(refs.background, { opacity: 0 });
  gsap.set(refs.brandMark, { opacity: 0, y: HERO_ANIM.entrance.brandMark.y });
  gsap.set(refs.headline, { opacity: 0, y: HERO_ANIM.entrance.headline.y });
  gsap.set(refs.subtitle, { opacity: 0, y: HERO_ANIM.entrance.subtitle.y });
  gsap.set(refs.cta, { opacity: 0, scale: HERO_ANIM.entrance.cta.scale });
  gsap.set(refs.scrollIndicator, { opacity: 0 });
}

function buildEntranceTimeline(
  refs: {
    background: HTMLDivElement;
    brandMark: HTMLParagraphElement;
    headline: HTMLHeadingElement;
    subtitle: HTMLParagraphElement;
    cta: HTMLAnchorElement;
    scrollIndicator: HTMLDivElement;
  },
) {
  const { entrance: e } = HERO_ANIM;

  return gsap.timeline({
    defaults: { ease: HERO_ANIM.easing.entrance },
  })
    .to(refs.background, {
      opacity: 1,
      duration: e.background.duration,
      delay: e.background.delay,
    })
    .to(refs.brandMark, {
      opacity: 1,
      y: 0,
      duration: e.brandMark.duration,
      delay: e.brandMark.delay,
    }, "<")
    .to(refs.headline, {
      opacity: 1,
      y: 0,
      duration: e.headline.duration,
      delay: e.headline.delay,
    }, "<0.1")
    .to(refs.subtitle, {
      opacity: 1,
      y: 0,
      duration: e.subtitle.duration,
      delay: e.subtitle.delay,
    }, "<0.2")
    .to(refs.cta, {
      opacity: 1,
      scale: 1,
      duration: e.cta.duration,
      delay: e.cta.delay,
    }, "<0.1")
    .to(refs.scrollIndicator, {
      opacity: 1,
      duration: e.scrollIndicator.duration,
      delay: e.scrollIndicator.delay,
    }, "<0.3");
}

function buildScrollTimeline(
  refs: {
    root: HTMLDivElement;
    background: HTMLDivElement;
    headline: HTMLHeadingElement;
    subtitle: HTMLParagraphElement;
    cta: HTMLAnchorElement;
    scrollIndicator: HTMLDivElement;
  },
) {
  const { scroll: s } = HERO_ANIM;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: refs.root,
      start: "top top",
      end: "bottom top",
      scrub: true,
      pin: true,
      anticipatePin: 1,
    },
  });

  tl.to(refs.background, {
    y: s.backgroundY,
    ease: "none",
  }, 0)
    .to(refs.headline, {
      scale: s.headlineScale,
      ease: "none",
    }, 0)
    .to(refs.subtitle, {
      opacity: s.subtitleOpacity,
      ease: "none",
    }, 0)
    .to(refs.cta, {
      opacity: s.ctaOpacity,
      ease: "none",
    }, 0)
    .to(refs.scrollIndicator, {
      opacity: s.scrollIndicatorOpacity,
      ease: "none",
    }, 0);

  return tl;
}

export default function HeroSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const brandMarkRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const root = rootRef.current;
    const background = backgroundRef.current;
    const brandMark = brandMarkRef.current;
    const headline = headlineRef.current;
    const subtitle = subtitleRef.current;
    const cta = ctaRef.current;
    const scrollIndicator = scrollIndicatorRef.current;

    if (!root || !background || !brandMark || !headline || !subtitle || !cta || !scrollIndicator) {
      return;
    }

    const refs = { root, background, brandMark, headline, subtitle, cta, scrollIndicator };

    setInitialState(refs, reducedMotion);

    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      const entranceTl = buildEntranceTimeline(refs);
      animationRegistry.register(root, "hero-entrance", entranceTl);

      const scrollTl = buildScrollTimeline(refs);
      animationRegistry.register(root, "hero-scroll", scrollTl);
    });

    return () => {
      animationRegistry.killAll(root);
      ctx.revert();
    };
  }, [reducedMotion]);

  const handleCtaClick = () => {
    const heritageSection = document.getElementById("heritage");
    heritageSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div ref={rootRef} style={styles.root}>
      <div ref={backgroundRef} style={styles.background} aria-hidden="true" />

      <div style={styles.content}>
        <p ref={brandMarkRef} style={styles.brandMark} aria-hidden="true">
          Est. 1907
        </p>

        <h1 ref={headlineRef} style={styles.headline}>
          {HERO_HEADLINE}
        </h1>

        <p ref={subtitleRef} style={styles.subtitle}>
          {HERO_SUBTITLE}
        </p>

        <a
          ref={ctaRef}
          href="#heritage"
          style={styles.cta}
          onClick={(e) => {
            e.preventDefault();
            handleCtaClick();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleCtaClick();
            }
          }}
          aria-label={HERO_CTA_LABEL}
        >
          {HERO_CTA_LABEL}
          <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <div
        ref={scrollIndicatorRef}
        style={styles.scrollIndicator}
        aria-hidden="true"
      >
        <span>{HERO_SCROLL_LABEL}</span>
        <div style={styles.scrollLine} />
      </div>
    </div>
  );
}
