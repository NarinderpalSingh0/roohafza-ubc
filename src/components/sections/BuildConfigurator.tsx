import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { gsap } from "../../lib/gsap";
import { useInView } from "../../lib/animations/useInView";
import { RoseIcon, MintIcon, LemonIcon, IceIcon, MilkIcon, SparkleIcon } from "../ui/IngredientIcons";

type Ingredient = {
  id: string;
  name: string;
  flavor: string;
  color: string;
  glowColor: string;
  icon: React.ReactNode;
};

const INGREDIENTS: Ingredient[] = [
  { id: "rose", name: "Rose", flavor: "Sweet Floral", color: "#C94C72", glowColor: "rgba(201, 76, 114, 0.4)", icon: <RoseIcon className="ingredient-icon" /> },
  { id: "mint", name: "Mint", flavor: "Fresh Cool", color: "#4CAF50", glowColor: "rgba(76, 175, 80, 0.4)", icon: <MintIcon className="ingredient-icon" /> },
  { id: "lemon", name: "Lemon", flavor: "Tangy Bright", color: "#FDD835", glowColor: "rgba(253, 216, 53, 0.4)", icon: <LemonIcon className="ingredient-icon" /> },
  { id: "ice", name: "Ice", flavor: "Chilled Crisp", color: "#81D4FA", glowColor: "rgba(129, 212, 250, 0.4)", icon: <IceIcon className="ingredient-icon" /> },
  { id: "milk", name: "Milk", flavor: "Creamy Smooth", color: "#FAFAFA", glowColor: "rgba(255, 255, 255, 0.3)", icon: <MilkIcon className="ingredient-icon" /> },
  { id: "sparkling", name: "Sparkling", flavor: "Effervescent", color: "#D4AF37", glowColor: "rgba(212, 175, 55, 0.4)", icon: <SparkleIcon className="ingredient-icon" /> },
];

function getBlendName(selected: string[]) {
  if (selected.length === 0) return "Your Blend";
  if (selected.length === 1) return `${INGREDIENTS.find(i => i.id === selected[0])?.name} Essence`;
  if (selected.length === 2) {
    const names = selected.map(id => INGREDIENTS.find(i => i.id === id)?.name);
    return `${names[0]} ${names[1]}`;
  }
  const main = INGREDIENTS.find(i => i.id === selected[0])?.name;
  return `${main} Fusion`;
}

function getFlavorNotes(selected: string[]) {
  return selected.map(id => INGREDIENTS.find(i => i.id === id)?.flavor).filter(Boolean);
}

function getRating(selected: string[]) {
  if (selected.length === 0) return 0;
  if (selected.length === 1) return 3;
  if (selected.length === 2) return 4;
  return 5;
}

export default function BuildConfigurator() {
  const { ref: sectionRef, isInView } = useInView();
  const [selected, setSelected] = useState<string[]>([]);
  const [bottleFill, setBottleFill] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const bottleRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const currentGlow = selected.length > 0
    ? INGREDIENTS.find(i => i.id === selected[selected.length - 1])?.glowColor || "rgba(212, 175, 55, 0.2)"
    : "rgba(212, 175, 55, 0.2)";

  const currentColor = selected.length > 0
    ? INGREDIENTS.find(i => i.id === selected[selected.length - 1])?.color || "#C94C72"
    : "#C94C72";

  const particlePositions = useMemo(() =>
    Array.from({ length: 8 }).map((_, i) => ({
      left: `${20 + ((i * 7 + 3) % 60)}%`,
      top: `${10 + ((i * 11 + 5) % 80)}%`,
    })),
  []);

  const bubblePositions = useMemo(() =>
    Array.from({ length: 6 }).map((_, i) => ({
      left: `${30 + ((i * 8 + 2) % 40)}%`,
      duration: `${2 + ((i * 3) % 2)}s`,
    })),
  []);

  // Animate bottle fill
  useEffect(() => {
    const target = (selected.length / INGREDIENTS.length) * 100;
    gsap.to({ val: bottleFill }, {
      val: target,
      duration: 0.8,
      ease: "power2.out",
      onUpdate: function() {
        setBottleFill(Math.round(this.targets()[0].val));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.length]);

  // Animate glow color change
  useEffect(() => {
    if (glowRef.current) {
      gsap.to(glowRef.current, {
        background: `radial-gradient(circle, ${currentGlow} 0%, transparent 70%)`,
        duration: 0.6,
        ease: "power2.out",
      });
    }
  }, [currentGlow]);

  // Floating particles
  useEffect(() => {
    if (!particlesRef.current || !isInView) return;
    const particles = particlesRef.current.children;
    Array.from(particles).forEach((particle, i) => {
      gsap.to(particle, {
        y: `random(-20, 20)`,
        x: `random(-10, 10)`,
        duration: `random(3, 6)`,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.2,
      });
    });
  }, [isInView]);

  // Breathing animation on bottle
  useEffect(() => {
    if (!bottleRef.current || !isInView) return;
    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(bottleRef.current, {
      scale: 1.01,
      duration: 4,
      ease: "sine.inOut",
    });
    return () => { tl.kill(); };
  }, [isInView]);

  const toggleIngredient = useCallback((id: string) => {
    setSelected(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length >= 4) return prev;
      return [...prev, id];
    });
  }, []);

  const handleSurprise = useCallback(() => {
    const shuffled = [...INGREDIENTS].sort(() => Math.random() - 0.5);
    const count = Math.floor(Math.random() * 3) + 2;
    setSelected(shuffled.slice(0, count).map(i => i.id));
  }, []);

  const handleReset = useCallback(() => {
    setSelected([]);
    setShowResult(false);
  }, []);

  const handleBuild = useCallback(() => {
    if (selected.length === 0) return;
    setShowResult(true);
    if (resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [selected]);

  const handleExport = useCallback(() => {
    const blend = getBlendName(selected);
    const flavors = getFlavorNotes(selected).join(", ");
    const text = `${blend}\nIngredients: ${selected.map(id => INGREDIENTS.find(i => i.id === id)?.name).join(", ")}\nFlavor Notes: ${flavors}\n\nCrafted with Rooh Afza Reimagined`;
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${blend.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [selected]);

  const handleShare = useCallback(() => {
    const blend = getBlendName(selected);
    const text = `I crafted "${blend}" with Rooh Afza Reimagined! 🌹`;
    if (navigator.share) {
      navigator.share({ title: blend, text });
    } else {
      navigator.clipboard.writeText(text);
    }
  }, [selected]);

  return (
    <div ref={sectionRef} className="brand-section brand-section--dark">
      <div className="section-container">
        <header className={`section-header ${isInView ? 'fade-in-up is-visible' : 'fade-in-up'}`}>
          <p className="section-label">Build Your Own</p>
          <h2 className="section-title section-title--light">Craft Your Signature Blend</h2>
        </header>

        <div className={`build-layout ${isInView ? 'fade-in-up is-visible animate-delay-2' : 'fade-in-up'}`}>
          {/* Left: Bottle Preview */}
          <div className="build-bottle-area">
            <div className="build-bottle-wrapper">
              {/* Gold ring behind bottle */}
              <div className="build-bottle-ring" />

              {/* Glow effect */}
              <div
                ref={glowRef}
                className="build-bottle-glow"
                style={{ background: `radial-gradient(circle, ${currentGlow} 0%, transparent 70%)` }}
              />

              {/* Floating particles */}
              <div ref={particlesRef} className="build-particles">
                {particlePositions.map((pos, i) => (
                  <div key={i} className="build-particle" style={{
                    left: pos.left,
                    top: pos.top,
                    animationDelay: `${i * 0.3}s`,
                  }} />
                ))}
              </div>

              {/* Progress ring */}
              <svg className="build-progress-ring" viewBox="0 0 200 200">
                <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" />
                <circle
                  cx="100" cy="100" r="90"
                  fill="none"
                  stroke="var(--color-gold)"
                  strokeWidth="2"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 * Math.PI * 90 * (1 - selected.length / INGREDIENTS.length)}`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                  style={{ transition: "stroke-dashoffset 0.6s ease" }}
                />
                {INGREDIENTS.map((_, i) => {
                  const angle = (i / INGREDIENTS.length) * 2 * Math.PI - Math.PI / 2;
                  const x = 100 + 90 * Math.cos(angle);
                  const y = 100 + 90 * Math.sin(angle);
                  const isActive = i < selected.length;
                  return (
                    <circle
                      key={i}
                      cx={x} cy={y} r="4"
                      fill={isActive ? "var(--color-gold)" : "rgba(255,255,255,0.2)"}
                      style={{ transition: "fill 0.3s ease" }}
                    />
                  );
                })}
              </svg>

              {/* Bottle */}
              <div ref={bottleRef} className="build-bottle">
                <svg viewBox="0 0 120 280" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Bottle body */}
                  <path d="M35 60h50v180c0 10-10 20-25 20s-25-10-25-20V60z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  {/* Neck */}
                  <path d="M45 20h30v40H45V20z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                  {/* Cap */}
                  <rect x="42" y="8" width="36" height="14" rx="3" fill="var(--color-gold)" opacity="0.8" />
                  {/* Label area */}
                  <rect x="40" y="100" width="40" height="60" rx="4" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                  <text x="60" y="125" textAnchor="middle" fill="var(--color-gold)" fontSize="6" fontFamily="var(--font-heading)" fontWeight="600">ROOH</text>
                  <text x="60" y="135" textAnchor="middle" fill="var(--color-gold)" fontSize="5" fontFamily="var(--font-heading)">AFZA</text>
                  {/* Liquid fill */}
                  <clipPath id="bottleClip">
                    <path d="M36 61h48v179c0 9-9 19-24 19s-24-10-24-19V61z" />
                  </clipPath>
                  <g clipPath="url(#bottleClip)">
                    <rect
                      x="36"
                      y={240 - (bottleFill / 100) * 179}
                      width="48"
                      height={(bottleFill / 100) * 179}
                      fill={currentColor}
                      opacity="0.6"
                      style={{ transition: "y 0.8s ease, height 0.8s ease, fill 0.6s ease" }}
                    />
                  </g>
                  {/* Reflection */}
                  <path d="M42 70v160" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                </svg>
              </div>

              {/* Bubbles for sparkling */}
              {selected.includes("sparkling") && (
                <div className="build-bubbles">
                  {bubblePositions.map((pos, i) => (
                    <div key={i} className="build-bubble" style={{
                      left: pos.left,
                      animationDelay: `${i * 0.5}s`,
                      animationDuration: pos.duration,
                    }} />
                  ))}
                </div>
              )}
            </div>

            {/* Recipe Card */}
            <div className="build-recipe-card glass-card">
              <div className="build-recipe-header">
                <span className="build-recipe-label">Signature Blend</span>
                <div className="build-recipe-rating">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < getRating(selected) ? "star--active" : "star--inactive"}>&#9733;</span>
                  ))}
                </div>
              </div>
              <h3 className="build-recipe-name">{getBlendName(selected)}</h3>
              {selected.length > 0 && (
                <div className="build-recipe-notes">
                  {getFlavorNotes(selected).map((note, i) => (
                    <span key={i} className="build-recipe-note">{note}</span>
                  ))}
                </div>
              )}
              <div className="build-recipe-actions">
                <button className="build-btn build-btn--secondary" onClick={handleSurprise}>
                  <span>&#127922;</span> Surprise Me
                </button>
                <button className="build-btn build-btn--secondary" onClick={handleReset}>
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Right: Ingredient Library */}
          <div className="build-ingredients-area">
            <div className="build-ingredients-header">
              <h3 className="build-ingredients-title">Ingredient Library</h3>
              <span className="build-ingredients-count">{selected.length}/4 selected</span>
            </div>

            <div className="build-ingredients-grid">
              {INGREDIENTS.map((ingredient, index) => {
                const isSelected = selected.includes(ingredient.id);
                return (
                  <button
                    key={ingredient.id}
                    className={`build-ingredient-card glass-card ${isSelected ? 'build-ingredient-card--selected' : ''}`}
                    onClick={() => toggleIngredient(ingredient.id)}
                    style={{
                      transitionDelay: `${index * 0.05}s`,
                      borderColor: isSelected ? ingredient.color : undefined,
                    }}
                  >
                    <div className="build-ingredient-icon" style={{ color: ingredient.color }}>
                      {ingredient.icon}
                    </div>
                    <span className="build-ingredient-name">{ingredient.name}</span>
                    <span className="build-ingredient-flavor">{ingredient.flavor}</span>
                    {isSelected && (
                      <div className="build-ingredient-check" style={{ backgroundColor: ingredient.color }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Ingredients Summary */}
            {selected.length > 0 && (
              <div className="build-selected-summary glass-card">
                <h4 className="build-selected-title">Your Blend</h4>
                <div className="build-selected-list">
                  {selected.map(id => {
                    const ing = INGREDIENTS.find(i => i.id === id)!;
                    return (
                      <div key={id} className="build-selected-item" style={{ borderColor: ing.color }}>
                        <span className="build-selected-dot" style={{ backgroundColor: ing.color }} />
                        <span>{ing.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Build Button */}
            <button
              className="build-btn build-btn--primary"
              onClick={handleBuild}
              disabled={selected.length === 0}
            >
              Build My Blend
            </button>
          </div>
        </div>

        {/* Result Screen */}
        {showResult && selected.length > 0 && (
          <div ref={resultRef} className={`build-result glass-card ${isInView ? 'scale-in is-visible' : 'scale-in'}`}>
            <div className="build-result-inner">
              <p className="build-result-label">Your Blend</p>
              <h3 className="build-result-name">{getBlendName(selected)}</h3>
              <div className="build-result-notes">
                {getFlavorNotes(selected).map((note, i) => (
                  <span key={i} className="build-result-note">{note}</span>
                ))}
              </div>
              <div className="build-result-rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={i < getRating(selected) ? "star--active" : "star--inactive"}>&#9733;</span>
                ))}
              </div>
              <div className="build-result-actions">
                <button className="build-btn build-btn--primary" onClick={handleExport}>
                  Export Recipe
                </button>
                <button className="build-btn build-btn--secondary" onClick={handleShare}>
                  Share My Blend
                </button>
                <button className="build-btn build-btn--secondary" onClick={handleReset}>
                  Make Another
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
