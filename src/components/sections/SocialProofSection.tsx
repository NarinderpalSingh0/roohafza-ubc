export default function SocialProofSection() {
  const stats = [
    { number: "100+", label: "Years" },
    { number: "30+", label: "Ingredients" },
    { number: "4", label: "Generations" },
  ];

  return (
    <div className="social-proof">
      <div className="social-proof__inner">
        <p className="social-proof__headline">Trusted Across Generations</p>
        <div className="social-proof__stats">
          {stats.map((stat) => (
            <div key={stat.label} className="social-proof__stat">
              <span className="social-proof__number">{stat.number}</span>
              <span className="social-proof__label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
