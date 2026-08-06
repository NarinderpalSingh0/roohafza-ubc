import { useInView } from "../../lib/animations/useInView";

export default function Footer() {
  const { ref: sectionRef, isInView } = useInView();

  return (
    <footer ref={sectionRef} className="brand-section brand-section--dark" style={{ paddingBottom: "clamp(3rem, 6vw, 4rem)" }}>
      <div className="section-container">
        <div className={`${isInView ? 'fade-in-up is-visible' : 'fade-in-up'}`} style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(2rem, 4vw, 3rem)",
          textAlign: "center",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <h2 style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(1.25rem, 2vw, 1.5rem)",
              fontWeight: 600,
              color: "var(--color-text-inverse)",
              margin: 0,
            }}>
              Rooh Afza Reimagined
            </h2>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.8125rem",
              color: "rgba(255, 255, 255, 0.5)",
              margin: 0,
            }}>
              UBC Brand Relaunch Challenge 2026
            </p>
          </div>

          <div style={{
            display: "flex",
            gap: "1.5rem",
            alignItems: "center",
          }}>
            <a
              href="https://www.instagram.com/roohfza_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow on Instagram"
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-gold)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)"; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="mailto:sipandslayroohafza@gmail.com"
              aria-label="Send us an email"
              style={{
                color: "rgba(255, 255, 255, 0.6)",
                transition: "color 0.3s ease",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--color-gold)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255, 255, 255, 0.6)"; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          </div>

          <div style={{
            width: "100%",
            maxWidth: "32rem",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            paddingTop: "1.5rem",
          }}>
            <p style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.75rem",
              color: "rgba(255, 255, 255, 0.4)",
              margin: 0,
            }}>
              &copy; 2026 Rooh Afza Reimagined. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
