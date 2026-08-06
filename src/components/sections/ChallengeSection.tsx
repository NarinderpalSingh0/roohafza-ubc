import { useInView } from "../../lib/animations/useInView";

const CHALLENGE_LABEL = "The Challenge";
const CHALLENGE_HEADLINE = "Honouring Heritage in a Changing World";
const CHALLENGE_STATEMENT =
  "A century-old icon cannot survive on nostalgia alone. It must transform nostalgia into relevance.";

const PROBLEMS = [
  {
    id: "culture",
    title: "Culture Shift",
    description:
      "Younger consumers seek modern experiences, convenience, and stronger digital connections.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    id: "competition",
    title: "Competition",
    description:
      "The beverage market is crowded with new-age brands competing for attention.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5C7 4 6 9 6 9z" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5C17 4 18 9 18 9z" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
  {
    id: "digital",
    title: "Digital Shift",
    description:
      "Purchase decisions increasingly happen online, through social media and peer influence.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </svg>
    ),
  },
] as const;

export default function ChallengeSection() {
  const { ref: sectionRef, isInView } = useInView();

  return (
    <div ref={sectionRef} className="brand-section brand-section--primary">
      <div className="section-container">
        <header className={`section-header ${isInView ? 'fade-in-up is-visible' : 'fade-in-up'}`}>
          <p className="section-label">
            {CHALLENGE_LABEL}
          </p>
          <h2 className="section-title">
            {CHALLENGE_HEADLINE}
          </h2>
        </header>

        <p className={`${isInView ? 'fade-in-up is-visible animate-delay-2' : 'fade-in-up'} challenge-statement`}>
          {CHALLENGE_STATEMENT}
        </p>

        <div className={`${isInView ? 'fade-in-up is-visible animate-delay-3' : 'fade-in-up'}`}>
          <div className="problem-grid">
            {PROBLEMS.map((problem) => (
              <article key={problem.id} className="problem-card">
                <div className="problem-card__icon" aria-hidden="true">
                  {problem.icon}
                </div>
                <h3 className="problem-card__title">{problem.title}</h3>
                <p className="problem-card__description">
                  {problem.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
