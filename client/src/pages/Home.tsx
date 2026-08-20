/**
 * Kinetic Refreshment design reminder:
 * Campaign-placcard composition, Spark Crimson fields, cream editorial type,
 * fluid ribbons, and deliberate asymmetric spacing—never generic app UI.
 */
import { ArrowDownRight, ArrowUpRight, Menu, Plus, Sparkles, X } from "lucide-react";
import { useState } from "react";

const navItems = ["Flavours", "The ritual", "Our craft"];

const flavours = [
  {
    name: "Ruby Red",
    note: "Cherry + cola spice",
    color: "ruby",
    detail: "Deep, dark, dancing.",
  },
  {
    name: "Lime Lift",
    note: "Lime + bright fizz",
    color: "lime",
    detail: "A vivid little reset.",
  },
  {
    name: "Citrus Bloom",
    note: "Grapefruit + orange",
    color: "citrus",
    detail: "Tart, sunlit, sharp.",
  },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 8;
    const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 6;
    setParallax({ x, y });
  };

  return (
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="Crimson Spark home">
          <img src="/manus-storage/crimson-spark-mark_7ea00629.png" alt="" />
          <span>Crimson<br />Spark</span>
        </a>

        <nav className="desktop-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <button key={item} onClick={() => scrollToId(item === "Flavours" ? "flavours" : item === "The ritual" ? "ritual" : "craft")}>
              {item}
            </button>
          ))}
        </nav>

        <button className="nav-cta" onClick={() => scrollToId("flavours")}>
          <span>Find your fizz</span>
          <ArrowUpRight size={16} strokeWidth={2.4} />
        </button>

        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation" aria-expanded={menuOpen}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  scrollToId(item === "Flavours" ? "flavours" : item === "The ritual" ? "ritual" : "craft");
                  setMenuOpen(false);
                }}
              >
                {item}<ArrowUpRight size={18} />
              </button>
            ))}
          </nav>
        )}
      </header>

      <main id="top">
        <section className="hero section-pad" aria-labelledby="hero-title">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> From the first pop</div>
            <h1 id="hero-title">Make the<br /><em>break</em> brighter.</h1>
            <p>A crisp, bright sparkling drink built for late lunches, long drives, and the exact moment you need a lift.</p>
            <div className="hero-actions">
              <button className="button-light" onClick={() => scrollToId("flavours")}>Pour a spark <ArrowDownRight size={18} /></button>
              <button className="text-link" onClick={() => scrollToId("ritual")}>How it feels <span>↗</span></button>
            </div>
            <div className="hero-meta"><span>01 / 03</span><i /><span>crisp, not complicated</span></div>
          </div>

          <div className="hero-art" onPointerMove={handlePointerMove} onPointerLeave={() => setParallax({ x: 0, y: 0 })}>
            <div className="hero-orbit orbit-one" />
            <div className="hero-orbit orbit-two" />
            <div className="product-frame">
              <img
                className="hero-product"
                src="/manus-storage/crimson-spark-hero_a34aaa4a.jpg"
                alt="An unbranded crimson sparkling beverage bottle with ice and fizz"
                style={{ transform: `translate3d(${parallax.x}px, ${parallax.y}px, 0) rotate(${parallax.x * 0.09}deg)` }}
              />
              <div className="frame-plaque">
                <span>Cold, bright, alive</span>
                <b>RUBY<br />COLA</b>
              </div>
            </div>
            <div className="spark-burst"><Sparkles size={19} /><span>open joy</span></div>
          </div>
        </section>

        <section className="ribbon" aria-label="Brand statement">
          <div className="ribbon-track">
            <span>Never a small moment</span><b>✦</b><span>Never a small moment</span><b>✦</b><span>Never a small moment</span><b>✦</b><span>Never a small moment</span>
          </div>
        </section>

        <section className="flavour-section section-pad" id="flavours" aria-labelledby="flavour-title">
          <div className="section-intro">
            <div className="eyebrow dark"><span className="eyebrow-dot" /> Choose the mood</div>
            <h2 id="flavour-title">A little colour<br />for your <em>minute.</em></h2>
            <p>Three sharply tuned sparkling blends. No complicated rituals, just a flavour that knows where it’s going.</p>
          </div>

          <div className="flavour-grid">
            {flavours.map((flavour, index) => (
              <article className={`flavour-card ${flavour.color}`} key={flavour.name}>
                <div className="card-topline"><span>0{index + 1}</span><span>330 ML</span></div>
                {flavour.color === "lime" && <img src="/manus-storage/crimson-spark-lime_c05573a6.jpg" alt="Lime sparkling drink with ice and sliced limes" />}
                {flavour.color === "citrus" && <img src="/manus-storage/crimson-spark-fizz_47dfc430.jpg" alt="Abstract carbonation bubbles on red" />}
                {flavour.color === "ruby" && <div className="ruby-soda"><div className="ruby-soda-dot" /><div className="ruby-soda-bubble b-one" /><div className="ruby-soda-bubble b-two" /><div className="ruby-soda-bubble b-three" /><span>CS</span></div>}
                <div className="card-content">
                  <span>{flavour.note}</span>
                  <h3>{flavour.name}</h3>
                  <p>{flavour.detail}</p>
                  <button aria-label={`Learn about ${flavour.name}`}><Plus size={19} /></button>
                </div>
              </article>
            ))}
          </div>
          <button className="outline-button" onClick={() => scrollToId("ritual")}>Explore the full collection <ArrowUpRight size={17} /></button>
        </section>

        <section className="ritual-section section-pad" id="ritual" aria-labelledby="ritual-title">
          <div className="ritual-image-card">
            <img src="/manus-storage/crimson-spark-citrus_eaeb96e3.jpg" alt="Ruby sparkling beverage with grapefruit and orange peel" />
            <div className="image-stamp">Sip<br />slow.</div>
          </div>
          <div className="ritual-copy">
            <div className="eyebrow dark"><span className="eyebrow-dot" /> The everyday ritual</div>
            <h2 id="ritual-title">Keep a little<br /><em>sunshine</em> on hand.</h2>
            <p>Some days need a grand plan. Some days need a cool glass, the windows down, and five minutes that belong only to you.</p>
            <div className="ritual-steps">
              <div><span>01</span><p>Chill it until the first sip carries a clean snap.</p></div>
              <div><span>02</span><p>Pour over ice, or take it exactly as it is.</p></div>
              <div><span>03</span><p>Let the fizz turn the ordinary into a small celebration.</p></div>
            </div>
          </div>
        </section>

        <section className="craft-section section-pad" id="craft" aria-labelledby="craft-title">
          <div className="craft-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> Our craft</div>
            <h2 id="craft-title">Bright taste.<br /><em>Lighter trace.</em></h2>
            <p>We’re working toward packaging that spends more time in the loop and less time in the world. Because a bright moment should not leave a dull mark.</p>
            <a className="button-light" href="#footer">See what we’re changing <ArrowDownRight size={18} /></a>
          </div>
          <div className="craft-art">
            <div className="craft-bubble big">100%</div>
            <div className="craft-bubble small">∞</div>
            <div className="craft-ribbon" />
            <p>Designed<br />to circle<br />back.</p>
          </div>
        </section>

        <section className="closing section-pad">
          <div className="closing-visual"><img src="/manus-storage/crimson-spark-fizz_47dfc430.jpg" alt="Carbonation bubbles on a red field" /></div>
          <div className="closing-copy"><span className="eyebrow dark"><span className="eyebrow-dot" /> Keep it close</span><h2>Catch the<br />first <em>sparkle.</em></h2><a href="#flavours">Find your flavour <ArrowUpRight size={20} /></a></div>
        </section>
      </main>

      <footer id="footer" className="footer">
        <div className="footer-top">
          <a className="brand footer-brand" href="#top"><img src="/manus-storage/crimson-spark-mark_7ea00629.png" alt="" /><span>Crimson<br />Spark</span></a>
          <p>A small bright thing<br />for the middle of your day.</p>
          <a href="#top" className="back-top">Back to top <ArrowUpRight size={16} /></a>
        </div>
        <div className="footer-bottom"><span>© 2026 Crimson Spark</span><span>Made for bright breaks</span><span>India · English</span></div>
      </footer>
    </div>
  );
}
