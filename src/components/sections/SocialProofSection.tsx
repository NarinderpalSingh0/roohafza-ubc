import { useInView } from "../../lib/animations/useInView";
import { useCounter } from "../../lib/animations/useCounter";

function StatCounter({ end, suffix, label }: { end: number; suffix: string; label: string }) {
  const { ref, count } = useCounter(end, 2000);

  return (
    <div className="social-proof__stat">
      <span ref={ref} className="social-proof__number counter">
        {count}{suffix}
      </span>
      <span className="social-proof__label">{label}</span>
    </div>
  );
}

export default function SocialProofSection() {
  const { ref: sectionRef, isInView } = useInView();

  return (
    <div ref={sectionRef} className={`${isInView ? 'fade-in-up is-visible' : 'fade-in-up'} social-proof`}>
      <div className="social-proof__inner">
        <p className="social-proof__headline">Trusted Across Generations</p>
        <div className={`${isInView ? 'fade-in-up is-visible animate-delay-2' : 'fade-in-up'}`}>
          <div className="social-proof__stats">
            <StatCounter end={100} suffix="+" label="Years" />
            <StatCounter end={30} suffix="+" label="Ingredients" />
            <StatCounter end={4} suffix="" label="Generations" />
          </div>
        </div>

        <div className={`${isInView ? 'fade-in-up is-visible animate-delay-3' : 'fade-in-up'}`}>
          <div className="social-proof__social-channels">
            <a
              href="https://www.instagram.com/roohfza_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
              target="_blank"
              rel="noopener noreferrer"
              className="social-proof__social-link"
              aria-label="Follow on Instagram"
            >
              <svg
                className="social-proof__social-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a
              href="mailto:sipandslayroohafza@gmail.com"
              className="social-proof__social-link"
              aria-label="Send us an email"
            >
              <svg
                className="social-proof__social-icon"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
