import { useRef } from "react";

const HERO_HEADLINE = "Rooh Afza";
const HERO_SUBTITLE = "A timeless legacy, reimagined for a new generation.";
const HERO_CTA_LABEL = "Discover the Vision";
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
    gap: "0.5rem",
    padding: "1rem 2rem",
    fontFamily: "var(--font-body)",
    fontSize: "0.9375rem",
    fontWeight: 600,
    letterSpacing: "0.02em",
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

export default function HeroSection() {
  const rootRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const brandMarkRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLAnchorElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);

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
          <span aria-hidden="true">&darr;</span>
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
