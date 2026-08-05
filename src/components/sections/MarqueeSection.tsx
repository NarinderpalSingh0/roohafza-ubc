export default function MarqueeSection() {
  const items = [
    "100+ YEARS OF TRUST",
    "30+ BOTANICAL INGREDIENTS",
    "4 GENERATIONS CONNECTED",
    "ONE TIMELESS LEGACY",
  ];

  const group = (
    <>
      {items.map((item, index) => (
        <span className="marquee__item" key={index}>
          {item}
          <span className="marquee__separator">&#10022;</span>
        </span>
      ))}
    </>
  );

  return (
    <div className="marquee">
      <div className="marquee__track">
        <div className="marquee__group">{group}</div>
        <div className="marquee__group">{group}</div>
      </div>
    </div>
  );
}
