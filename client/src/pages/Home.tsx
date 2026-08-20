/**
 * Roohafza design reminder:
 * Rose-pink poster fields, Urdu/Hindi-adjacent expressive typography, supplied cans
 * treated as the hero objects, and bright citrus-green highlights. Keep the energy
 * celebratory and original—never generic beverage catalogue UI.
 */
import { ArrowDownRight, ArrowUpRight, Check, Instagram, Menu, MoveUpRight, Sparkles, X } from "lucide-react";
import { CSSProperties, FormEvent, useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { StoreLocator } from "@/components/StoreLocator";
import { ShopSection } from "@/components/ShopSection";
import { CAMPAIGN_AUTOPLAY_ENABLED, CAMPAIGN_AUTOPLAY_MS, campaignSlides, getCampaignShopTarget, getNextCampaignIndex, getPreviousCampaignIndex } from "@/data/campaignSlides";

const products = [
  {
    name: "Berry Bust",
    subline: "A lively berry break",
    note: "Pink, playful, bright.",
    image: "/manus-storage/roohafza-berry-bust_52910888.png",
    className: "berry",
  },
  {
    name: "Straberry",
    subline: "A strawberry-forward sip",
    note: "Big warmth, sharp mood.",
    image: "/manus-storage/roohafza-no-chalan_ef606d6d.png",
    className: "red",
  },
  {
    name: "Rose",
    subline: "A rose-coloured moment",
    note: "Soft, fragrant, memorable.",
    image: "/manus-storage/roohafza-nam-rakh-lena_8d4ce84b.png",
    className: "cream",
  },
];

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function ProductCard({ product, index }: { product: (typeof products)[number]; index: number }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0, glowX: 50, glowY: 50 });
  const tiltStyle = {
    "--rotate-x": `${tilt.x}deg`,
    "--rotate-y": `${tilt.y}deg`,
    "--glow-x": `${tilt.glowX}%`,
    "--glow-y": `${tilt.glowY}%`,
  } as CSSProperties;

  return (
    <article
      className={`product-card ${product.className}`}
      style={tiltStyle}
      onPointerMove={(event) => {
        if (event.pointerType !== "mouse") return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        setTilt({ x: -y * 7, y: x * 8, glowX: (x + 0.5) * 100, glowY: (y + 0.5) * 100 });
      }}
      onPointerLeave={() => setTilt({ x: 0, y: 0, glowX: 50, glowY: 50 })}
    >
      <div className="card-halo" />
      <div className="product-card-top"><span>0{index + 1}</span><span>Roohafza cans</span></div>
      <img className="can-render" src={product.image} alt={`${product.name} Roohafza can`} />
      <div className="product-card-copy">
        <span>{product.subline}</span>
        <h3>{product.name}</h3>
        <p>{product.note}</p>
        <div className="tilt-hint">Move to tilt <MoveUpRight size={14} /></div>
      </div>
    </article>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [heroShift, setHeroShift] = useState({ x: 0, y: 0 });
  const [campaignIndex, setCampaignIndex] = useState(0);
  const [campaignPaused, setCampaignPaused] = useState(!CAMPAIGN_AUTOPLAY_ENABLED);
  const [campaignTouchStart, setCampaignTouchStart] = useState<number | null>(null);
  const newsletter = trpc.newsletter.subscribe.useMutation({
    onSuccess: () => {
      setSubscribed(true);
      setEmail("");
    },
  });

  const handleNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubscribed(false);
    newsletter.mutate({ email });
  };

  useEffect(() => {
    if (campaignPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setCampaignIndex(getNextCampaignIndex), CAMPAIGN_AUTOPLAY_MS);
    return () => window.clearInterval(timer);
  }, [campaignPaused]);

  const showCampaign = (index: number) => {
    setCampaignPaused(true);
    setCampaignIndex(index);
  };

  const openCampaignProduct = (handle: string) => {
    setCampaignPaused(true);
    const productCard = document.getElementById(getCampaignShopTarget(handle)) ?? document.getElementById("shop");
    productCard?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const finishCampaignSwipe = (clientX: number) => {
    if (campaignTouchStart === null) return;
    const distance = clientX - campaignTouchStart;
    setCampaignTouchStart(null);
    if (Math.abs(distance) < 44) return;
    setCampaignPaused(true);
    setCampaignIndex(distance < 0 ? getNextCampaignIndex : getPreviousCampaignIndex);
  };

  const navItems = [
    ["The cans", "cans"],
    ["Shop", "shop"],
    ["Find us", "stores"],
    ["Seasonal drops", "newsletter"],
  ] as const;

  return (
    <div className="rooh-site">
      <header className="rooh-nav">
        <a className="rooh-logo" href="#top" aria-label="Roohafza home"><img src="/manus-storage/roohafza-wordmark_3d050812.png" alt="Roohafza" /></a>
        <nav className="rooh-desktop-nav" aria-label="Primary navigation">
          {navItems.map(([label, id]) => <button key={id} onClick={() => scrollToId(id)}>{label}</button>)}
        </nav>
        <a className="nav-instagram" href="https://www.instagram.com/roohfza_?utm_source=ig_web_button_share_sheet" target="_blank" rel="noreferrer" aria-label="Visit Roohafza on Instagram"><Instagram size={16} /></a>
        <button className="rooh-nav-cta" onClick={() => scrollToId("stores")}>Find a can <ArrowUpRight size={16} /></button>
        <button className="rooh-menu" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
        {menuOpen && <nav className="rooh-mobile-nav" aria-label="Mobile navigation">{navItems.map(([label, id]) => <button key={id} onClick={() => { scrollToId(id); setMenuOpen(false); }}>{label}<ArrowUpRight size={18} /></button>)}<a className="mobile-instagram" href="https://www.instagram.com/roohfza_?utm_source=ig_web_button_share_sheet" target="_blank" rel="noreferrer"><Instagram size={17} />Follow us on Instagram <ArrowUpRight size={17} /></a></nav>}
      </header>

      <main id="top">
        <section className="campaign-stage section-pad" aria-label="Roohafza campaign carousel" onFocusCapture={() => setCampaignPaused(true)}>
          <div className="campaign-viewport" role="region" aria-roledescription="carousel" aria-label="Roohafza campaign stories" onTouchStart={(event) => setCampaignTouchStart(event.touches[0]?.clientX ?? null)} onTouchEnd={(event) => finishCampaignSwipe(event.changedTouches[0]?.clientX ?? 0)}>
            <div className="campaign-track" style={{ transform: `translateX(-${campaignIndex * 100}%)` }}>
              {campaignSlides.map((slide, index) => (
                <article className={`campaign-feature ${slide.tone}`} id={`campaign-slide-${index + 1}`} key={slide.handle} aria-hidden={campaignIndex !== index} inert={campaignIndex !== index}>
                  <div className="campaign-art">
                    <img className="campaign-art-media" src={slide.image} alt={slide.alt} />
                    <span className="campaign-art-sidecopy">{slide.imageNote}</span>
                    <span className="campaign-art-caption">{slide.caption}</span>
                  </div>
                  <div className="campaign-copy">
                    <span className="campaign-ticket">{slide.label}</span>
                    <p className="campaign-eyebrow">{slide.eyebrow}</p>
                    <h2>{slide.title}</h2>
                    <button className="campaign-cta" type="button" onClick={() => openCampaignProduct(slide.handle)}>Shop {slide.flavor} <ArrowDownRight size={17} /></button>
                    <span className="campaign-legal">330 ml of bright breaks · ₹99 each</span>
                  </div>
                  <div className="campaign-footer"><span>Roohafza · your mood, your can</span><b>✦</b><span>{slide.footer}</span></div>
                </article>
              ))}
            </div>
          </div>
          <div className="campaign-controls">
            <div className={`campaign-progress${campaignPaused ? " is-paused" : ""}`} style={{ "--campaign-duration": `${CAMPAIGN_AUTOPLAY_MS}ms` } as CSSProperties} aria-label={campaignPaused ? "Carousel timing paused" : "Next carousel slide progress"}><span key={campaignIndex} /></div>
            <div className="campaign-dots" role="tablist" aria-label="Choose a Roohafza campaign story">
              {campaignSlides.map((slide, index) => <button type="button" key={slide.handle} role="tab" aria-selected={campaignIndex === index} aria-controls={`campaign-slide-${index + 1}`} aria-label={`Show ${slide.flavor} campaign`} className={campaignIndex === index ? "is-active" : ""} onClick={() => showCampaign(index)} />)}
            </div>
            <button className="campaign-autoplay-toggle" type="button" onClick={() => setCampaignPaused((paused) => !paused)} aria-label={campaignPaused ? "Play campaign carousel" : "Pause campaign carousel"}>{campaignPaused ? "Play stories" : "Pause stories"}</button>
          </div>
        </section>
        <section className="rooh-hero section-pad" aria-labelledby="hero-title">
          <div className="hero-waves" aria-hidden="true"><i /><i /><i /></div>
          <div className="rooh-hero-copy">
            <span className="section-kicker light"><i />A feeling in a can</span>
            <h1 id="hero-title">Dil se<br /><em>cool.</em><br />Dil se yours.</h1>
            <p>Roohafza shows up when the day needs a little colour, a little kindness, and a cooler point of view.</p>
            <div className="rooh-hero-actions"><button className="cream-button" onClick={() => scrollToId("cans")}>Meet the cans <ArrowDownRight size={18} /></button><button className="hero-text-button" onClick={() => scrollToId("stores")}>Find nearby <span>↗</span></button></div>
            <div className="hero-footnote"><span>01 / 03</span><i /><span>More than a drink.</span></div>
          </div>

          <div className="rooh-hero-product" onPointerMove={(event) => {
            if (event.pointerType !== "mouse") return;
            const bounds = event.currentTarget.getBoundingClientRect();
            setHeroShift({ x: ((event.clientX - bounds.left) / bounds.width - 0.5) * 10, y: ((event.clientY - bounds.top) / bounds.height - 0.5) * 8 });
          }} onPointerLeave={() => setHeroShift({ x: 0, y: 0 })}>
            <div className="hero-sunburst" />
            <div className="hero-petal petal-a" /><div className="hero-petal petal-b" /><div className="hero-petal petal-c" />
            <img src="/manus-storage/roohafza-berry-bust_52910888.png" alt="Roohafza Berry Bust can" style={{ transform: `translate3d(${heroShift.x}px, ${heroShift.y}px, 0) rotate(${heroShift.x * .18}deg)` }} />
            <div className="hero-sticker"><Sparkles size={17} /><span>Har sip<br />ek feeling</span></div>
            <div className="hero-product-note"><span>Berry Bust</span><b>make your<br />health worth<br />enjoying</b></div>
          </div>
        </section>

        <section className="rooh-ribbon" aria-label="Roohafza brand statement"><div><span>Meetha. Thanda. Yaadgaar.</span><b>✦</b><span>Meetha. Thanda. Yaadgaar.</span><b>✦</b><span>Meetha. Thanda. Yaadgaar.</span><b>✦</b><span>Meetha. Thanda. Yaadgaar.</span></div></section>

        <section className="can-section section-pad" id="cans" aria-labelledby="cans-title">
          <div className="can-intro"><div><span className="section-kicker"><i />Pick your poster</span><h2 id="cans-title">Little cans.<br /><em>Large feelings.</em></h2></div><p>Every can arrives with its own mood, colour, and a little story on the side. Follow the one that feels like you.</p></div>
          <div className="product-grid">{products.map((product, index) => <ProductCard product={product} index={index} key={product.name} />)}</div>
          <p className="tilt-caption">Hover the cans to catch the light. On touch, the showcase stays composed and easy to browse.</p>
        </section>

        <section className="story-section section-pad" id="story" aria-labelledby="story-title">
          <div className="story-poster"><div className="story-circle" /><img src="/manus-storage/roohafza-no-chalan_ef606d6d.png" alt="Roohafza Straberry can" /><span>Too cool<br />to rush.</span></div>
          <div className="story-copy"><span className="section-kicker"><i />A new kind of familiar</span><h2 id="story-title">The taste of<br /><em>being yourself.</em></h2><p>Roohafza has always known how to colour a moment. These cans bring that familiar warmth into the pace of now—ready when the plan changes, the gang gathers, or the day needs a little lift.</p><div className="story-facts"><span>Bold colour</span><span>Everyday ease</span><span>Designed to share</span></div><div className="story-mood-bar" aria-label="Your mood. Your can."><span>Your mood.</span><b>✦</b><span>Your can.</span></div></div>
        </section>

        <ShopSection />

        <StoreLocator />

        <section className="newsletter-section section-pad" id="newsletter" aria-labelledby="newsletter-title">
          <div className="newsletter-art"><div className="newsletter-flower">✦</div><div className="newsletter-can"><img src="/manus-storage/roohafza-nam-rakh-lena_8d4ce84b.png" alt="Roohafza Rose can" /></div></div>
          <div className="newsletter-copy"><span className="section-kicker light"><i />Seasonal drops</span><h2 id="newsletter-title">Be first to<br />catch the <em>feeling.</em></h2><p>New flavours, fresh artwork, and the next little reason to open something bright.</p>{subscribed ? <div className="newsletter-success" role="status"><Check size={18} />You’re on the list. See you at the next drop.</div> : <form className="newsletter-form" onSubmit={handleNewsletter}><label htmlFor="newsletter-email">Your email address</label><div><input id="newsletter-email" type="email" value={email} required onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" /><button type="submit" disabled={newsletter.isPending}>{newsletter.isPending ? "Joining…" : "Keep me posted"}<ArrowUpRight size={17} /></button></div>{newsletter.error && <p className="newsletter-error" role="alert">{newsletter.error.message}</p>}</form>}<small>By joining, you agree to receive Roohafza launch updates. You can unsubscribe anytime.</small></div>
        </section>
      </main>

      <footer className="rooh-footer"><div className="footer-brandline"><a href="#top"><img src="/manus-storage/roohafza-wordmark_3d050812.png" alt="Roohafza" /></a><p>For every mood in between.</p><div className="footer-actions"><a href="https://www.instagram.com/roohfza_?utm_source=ig_web_button_share_sheet" target="_blank" rel="noreferrer"><Instagram size={16} />Instagram</a><button onClick={() => scrollToId("top")}>Back to top <ArrowUpRight size={16} /></button></div></div><div className="footer-bottom"><span>© 2026 Roohafza</span><span>Made for bright breaks</span><span>India · English</span></div></footer>
    </div>
  );
}
