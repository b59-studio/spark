"use client";
/* eslint-disable react/no-unescaped-entities */

import { useEffect, useRef, type CSSProperties } from "react";
import "./branding.css";

// Parse inline style strings to React CSSProperties
function parseStyle(str: string): CSSProperties {
  const obj: Record<string, string> = {};
  str.split(";").forEach((part) => {
    const colon = part.indexOf(":");
    if (colon > 0) {
      const k = part.slice(0, colon).trim().replace(/-([a-z])/g, (_, l) => l.toUpperCase());
      const v = part.slice(colon + 1).trim();
      if (k && v) obj[k] = v;
    }
  });
  return obj as React.CSSProperties;
}

export default function BrandingPage() {
  const starfieldRef = useRef<HTMLDivElement>(null);

  const showDeck = (n: number) => {
    ["panel-0", "panel-1", "panel-2", "panel-3"].forEach((id, i) => {
      document.getElementById(id)?.classList.toggle("active", i === n);
    });
    document.querySelectorAll(".deck-tab").forEach((t, i) => {
      t.classList.toggle("active", i === n);
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const sf = starfieldRef.current;
    if (sf) {
      for (let i = 0; i < 80; i++) {
        const s = document.createElement("div");
        s.className = "star";
        s.style.cssText = `left:${Math.random() * 100}%;top:${Math.random() * 100}%;--d:${3 + Math.random() * 6}s;--dl:${Math.random() * 6}s;--op:${0.2 + Math.random() * 0.8}`;
        if (Math.random() > 0.7) {
          s.style.width = s.style.height = "3px";
        }
        sf.appendChild(s);
      }
    }
    document.querySelector(".deck-tab")?.classList.add("active");
  }, []);

  return (
    <div className="branding-page">
{/* CSS in branding.css */}

{/* ===== NAV ===== */}
<nav className="top-nav">
  <div className="nav-brand"><span>tx_spark</span> / brand guidelines</div>
  <div className="deck-tabs">
    <button className="deck-tab" onClick={() => showDeck(0)}>Cover</button>
    <button className="deck-tab" onClick={() => showDeck(1)}>Deck 1 — Starfield Drifter</button>
    <button className="deck-tab" onClick={() => showDeck(2)}>Deck 2 — Hill Country Heat</button>
    <button className="deck-tab" onClick={() => showDeck(3)}>Deck 3 — Live Wire</button>
  </div>
</nav>

{/* ===== COVER ===== */}
<div id="panel-0" className="deck-panel active">
<div className="cover">
  <div className="cover-bg"></div>
  <div className="cover-stars" id="starfield" ref={starfieldRef}></div>
  <div className="cover-content">
    <div className="cover-logo-wrap">
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="36" cy="36" r="35" stroke="rgba(248,244,237,0.15)" strokeWidth="1"/>
        <path d="M36 14 L44 30 L62 32 L50 44 L53 62 L36 54 L19 62 L22 44 L10 32 L28 30 Z" fill="none" stroke="rgba(248,244,237,0.25)" strokeWidth="1"/>
        <path d="M30 36 L36 22 L42 36 L36 42 Z" fill="#00C4A7" opacity="0.9"/>
        <circle cx="36" cy="36" r="4" fill="#F0B429"/>
      </svg>
    </div>
    <div className="cover-eyebrow">Brand Identity System · 2025</div>
    <h1 className="cover-title">tx_spark</h1>
    <div className="cover-subtitle">Brand Guidelines</div>
    <p className="cover-desc">Three complete brand directions for a data-first, people-centered political action committee sparking grassroots change across Texas.</p>
    <div className="cover-cta">
      <button className="btn-deck btn-deck-1" onClick={() => showDeck(1)}>Starfield Drifter</button>
      <button className="btn-deck btn-deck-2" onClick={() => showDeck(2)}>Hill Country Heat</button>
      <button className="btn-deck btn-deck-3" onClick={() => showDeck(3)}>Live Wire</button>
    </div>
  </div>
</div>
{/* About Block */}
<div className="section" style={parseStyle("padding-top:3rem;padding-bottom:3rem;")}>
  <div style={parseStyle("display:grid;grid-template-columns:1fr 1fr;gap:40px;max-width:900px;margin:0 auto;")}>
    <div>
      <div className="section-label" style={parseStyle("color:#00C4A7")}>About tx_spark</div>
      <p style={parseStyle("font-size:15px;line-height:1.8;opacity:0.65;margin-bottom:1rem")}>A data and technology state PAC based in Austin, TX, founded in May 2025 by a team of local organizers and data aficionados.</p>
      <p style={parseStyle("font-size:15px;line-height:1.8;opacity:0.65")}>With roots in Democratic organizing, data science, product design, and policy advocacy — built by Texans, for Texans.</p>
    </div>
    <div>
      <div className="section-label" style={parseStyle("color:#F0B429")}>The Brand Challenge</div>
      <p style={parseStyle("font-size:15px;line-height:1.8;opacity:0.65;margin-bottom:1rem")}>Communicate technical credibility and grassroots warmth simultaneously. Be approachable without being soft. Be professional without being corporate.</p>
      <p style={parseStyle("font-size:15px;line-height:1.8;opacity:0.65")}>The guiding spirit: <em style={parseStyle("color:#F8F4ED")}>"Cosmic Cowboy"</em> — Austin's signature blend of frontier independence and progressive imagination.</p>
    </div>
  </div>
  <div className="divider" style={parseStyle("margin:3rem 0 2rem")}></div>
  <div style={parseStyle("display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:16px;max-width:900px;margin:0 auto;")}>
    <div style={parseStyle("padding:1.25rem;border:1px solid rgba(255,255,255,0.07);border-radius:10px")}>
      <div style={parseStyle("font-size:11px;letter-spacing:0.1em;text-transform:uppercase;opacity:0.35;margin-bottom:8px;font-family:'Fira Code',monospace")}>Deck 1</div>
      <div style={parseStyle("font-size:16px;font-weight:700;margin-bottom:6px")}>Starfield Drifter</div>
      <div style={parseStyle("font-size:12px;opacity:0.5;line-height:1.5")}>Night-sky navy, electric teal, gold. Polished, data-forward, sky-gazing optimism.</div>
    </div>
    <div style={parseStyle("padding:1.25rem;border:1px solid rgba(255,255,255,0.07);border-radius:10px")}>
      <div style={parseStyle("font-size:11px;letter-spacing:0.1em;text-transform:uppercase;opacity:0.35;margin-bottom:8px;font-family:'Fira Code',monospace")}>Deck 2</div>
      <div style={parseStyle("font-size:16px;font-weight:700;margin-bottom:6px")}>Hill Country Heat</div>
      <div style={parseStyle("font-size:12px;opacity:0.5;line-height:1.5")}>Terracotta, sage, limestone. Earthy, grassroots, community-first warmth.</div>
    </div>
    <div style={parseStyle("padding:1.25rem;border:1px solid rgba(255,255,255,0.07);border-radius:10px")}>
      <div style={parseStyle("font-size:11px;letter-spacing:0.1em;text-transform:uppercase;opacity:0.35;margin-bottom:8px;font-family:'Fira Code',monospace")}>Deck 3</div>
      <div style={parseStyle("font-size:16px;font-weight:700;margin-bottom:6px")}>Live Wire</div>
      <div style={parseStyle("font-size:12px;opacity:0.5;line-height:1.5")}>Black, vermillion, electric blue. Bold, urgent, editorial political energy.</div>
    </div>
  </div>
</div>
</div>

{/* ===================================================
     DECK 1 — STARFIELD DRIFTER
     =================================================== */}
<div id="panel-1" className="deck-panel">
<div id="deck-1">

{/* HERO */}
<div className="deck-hero">
  <div className="deck-hero-content">
    <div className="deck-hero-number">Brand Direction 01 / 03</div>
    <h2 className="deck-hero-name">Starfield <em>Drifter</em></h2>
    <p className="deck-hero-tagline">Riding into the digital frontier under a wide Texas sky — elegant, data-literate, quietly confident.</p>
  </div>
</div>

{/* POSITIONING */}
<div className="section">
  <div className="section-label">Brand Positioning</div>
  <h2 className="section-title">The Brand Story</h2>
  <div className="positioning-block pb-1">
    <div className="positioning-word">Positioning Statement</div>
    <p className="positioning-statement">"tx_spark is the quiet intelligence behind grassroots Texas — a trusted guide that makes complex data feel like a clear night sky: vast, navigable, and full of possibility."</p>
    <div className="positioning-pillars">
      <span className="pillar-tag" style={parseStyle("background:rgba(0,196,167,0.12);color:#00C4A7")}>Trusted Guide</span>
      <span className="pillar-tag" style={parseStyle("background:rgba(240,180,41,0.12);color:#F0B429")}>Data-Literate</span>
      <span className="pillar-tag" style={parseStyle("background:rgba(168,197,216,0.12);color:#A8C5D8")}>Quietly Confident</span>
      <span className="pillar-tag" style={parseStyle("background:rgba(255,255,255,0.07);color:rgba(248,244,237,0.6)")}>Approachable</span>
      <span className="pillar-tag" style={parseStyle("background:rgba(255,255,255,0.07);color:rgba(248,244,237,0.6)")}>Forward-Looking</span>
    </div>
  </div>

  <div className="section-desc">The Starfield Drifter direction positions tx_spark as a sophisticated yet accessible organization — think a data scientist who also plays in a band on Red River Street. Smart tools delivered with warmth.</div>
</div>

{/* COLORS */}
<div className="section" style={parseStyle("padding-top:0")}>
  <div className="section-label">01 — Color System</div>
  <h2 className="section-title">Color Palette</h2>
  <p className="section-desc">Drawn from the Texas Hill Country at midnight — the deep indigo of the night sky, the electric teal of a data display, the warm gold of Austin streetlights on limestone.</p>

  <div className="color-grid">
    <div className="color-swatch">
      <div className="swatch-color d1-night" style={parseStyle("height:110px")}>
        <span style={parseStyle("font-family:'Fira Code',monospace;font-size:10px;color:rgba(248,244,237,0.4)")}>PRIMARY</span>
      </div>
      <div className="swatch-info">
        <div className="swatch-name">Night Sky</div>
        <div className="swatch-hex">#0A1628</div>
        <div className="swatch-role">Primary / Background</div>
      </div>
    </div>
    <div className="color-swatch">
      <div className="swatch-color d1-teal" style={parseStyle("height:110px")}>
        <span style={parseStyle("font-family:'Fira Code',monospace;font-size:10px;color:rgba(10,22,40,0.5)")}>SECONDARY</span>
      </div>
      <div className="swatch-info">
        <div className="swatch-name">Electric Teal</div>
        <div className="swatch-hex">#00C4A7</div>
        <div className="swatch-role">Secondary / Action</div>
      </div>
    </div>
    <div className="color-swatch">
      <div className="swatch-color d1-gold" style={parseStyle("height:110px")}>
        <span style={parseStyle("font-family:'Fira Code',monospace;font-size:10px;color:rgba(10,22,40,0.4)")}>ACCENT</span>
      </div>
      <div className="swatch-info">
        <div className="swatch-name">Austin Gold</div>
        <div className="swatch-hex">#F0B429</div>
        <div className="swatch-role">Accent / Highlight</div>
      </div>
    </div>
    <div className="color-swatch">
      <div className="swatch-color d1-paper" style={parseStyle("height:110px;border:1px solid rgba(255,255,255,0.08)")}>
        <span style={parseStyle("font-family:'Fira Code',monospace;font-size:10px;color:rgba(10,22,40,0.4)")}>BACKGROUND</span>
      </div>
      <div className="swatch-info">
        <div className="swatch-name">Warm Paper</div>
        <div className="swatch-hex">#F8F4ED</div>
        <div className="swatch-role">Light Mode Base</div>
      </div>
    </div>
    <div className="color-swatch">
      <div className="swatch-color d1-mist" style={parseStyle("height:110px")}>
        <span style={parseStyle("font-family:'Fira Code',monospace;font-size:10px;color:rgba(10,22,40,0.5)")}>SUPPORT</span>
      </div>
      <div className="swatch-info">
        <div className="swatch-name">Horizon Mist</div>
        <div className="swatch-hex">#A8C5D8</div>
        <div className="swatch-role">Supporting / Subtle</div>
      </div>
    </div>
    <div className="color-swatch">
      <div className="swatch-color d1-slate" style={parseStyle("height:110px")}>
        <span style={parseStyle("font-family:'Fira Code',monospace;font-size:10px;color:rgba(248,244,237,0.4)")}>NEUTRAL</span>
      </div>
      <div className="swatch-info">
        <div className="swatch-name">Slate Ridge</div>
        <div className="swatch-hex">#3D5068</div>
        <div className="swatch-role">Neutral / Muted Text</div>
      </div>
    </div>
  </div>

  <div style={parseStyle("padding:1.5rem;border:1px solid rgba(255,255,255,0.06);border-radius:12px;background:rgba(255,255,255,0.02)")}>
    <div className="component-label-row">Color Usage Ratios</div>
    <div style={parseStyle("display:flex;gap:4px;height:28px;border-radius:6px;overflow:hidden;margin-bottom:12px")}>
      <div style={parseStyle("background:#0A1628;flex:6;display:flex;align-items:center;justify-content:center;font-size:10px;font-family:'Fira Code',monospace;color:rgba(255,255,255,0.4)")}>60%</div>
      <div style={parseStyle("background:#00C4A7;flex:2;display:flex;align-items:center;justify-content:center;font-size:10px;font-family:'Fira Code',monospace;color:rgba(10,22,40,0.7)")}>20%</div>
      <div style={parseStyle("background:#F0B429;flex:1;display:flex;align-items:center;justify-content:center;font-size:10px;font-family:'Fira Code',monospace;color:rgba(10,22,40,0.7)")}>10%</div>
      <div style={parseStyle("background:#A8C5D8;flex:1;display:flex;align-items:center;justify-content:center;font-size:10px;font-family:'Fira Code',monospace;color:rgba(10,22,40,0.5)")}>10%</div>
    </div>
    <p style={parseStyle("font-size:13px;opacity:0.5;line-height:1.5")}>Dominant night sky · Secondary teal for action and data · Gold sparingly as spark moments · Mist for supporting information</p>
  </div>
</div>

{/* TYPOGRAPHY */}
<div className="section" style={parseStyle("padding-top:0")}>
  <div className="section-label">02 — Typography</div>
  <h2 className="section-title">Type System</h2>
  <p className="section-desc">Cormorant Garamond brings the elegance of a worn Texas almanac. Plus Jakarta Sans keeps interfaces modern and readable. Fira Code grounds the data work in technical credibility.</p>

  <div className="type-specimen display">
    <div className="type-meta">DISPLAY — Cormorant Garamond 600 · Headings, hero text, editorial moments</div>
    <div className="type-sample-xl" style={parseStyle("font-family:'Cormorant Garamond',serif;font-weight:600;color:#F8F4ED")}>Spark <em style={parseStyle("color:#00C4A7")}>Grassroots</em> Change</div>
    <div className="type-sample-sm" style={parseStyle("font-family:'Fira Code',monospace")}>Cormorant Garamond — SemiBold 600 · Tracking: -0.02em · Use for: hero titles, section openers, pull quotes</div>
  </div>

  <div className="type-specimen heading">
    <div className="type-meta">HEADING — Plus Jakarta Sans 700 · Section titles, card headers, navigation</div>
    <div className="type-sample-lg" style={parseStyle("font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;color:#F8F4ED")}>People-Powered. Data-Driven.</div>
    <div className="type-sample-sm" style={parseStyle("font-family:'Fira Code',monospace")}>Plus Jakarta Sans — Bold 700 · Tracking: 0 · Use for: H2–H4, UI labels, navigation items</div>
  </div>

  <div className="type-specimen body">
    <div className="type-meta">BODY — Plus Jakarta Sans 300–400 · Paragraphs, descriptions, captions</div>
    <div className="type-sample-md" style={parseStyle("font-family:'Plus Jakarta Sans',sans-serif;font-weight:300;color:#F8F4ED")}>tx_spark provides accessible resources and tools developed by Texans for Texans — and the pro-democracy groups that serve them. Every tool we build starts with a person, not a dataset.</div>
    <div className="type-sample-sm" style={parseStyle("font-family:'Fira Code',monospace")}>Plus Jakarta Sans — Light 300 / Regular 400 · Line height: 1.7 · Use for: paragraphs, descriptions, UI copy</div>
  </div>

  <div className="type-specimen mono">
    <div className="type-meta">DATA / CODE — Fira Code 400 · Data labels, code snippets, technical callouts</div>
    <div className="type-sample-sm" style={parseStyle("font-family:'Fira Code',monospace;font-size:15px;color:#00C4A7")}>tx_spark.pal → 1,247 bills tracked · 89 active campaigns · 14,382 constituents reached</div>
    <div className="type-sample-sm" style={parseStyle("font-family:'Fira Code',monospace;margin-top:8px")}>Fira Code — Regular 400 · Use for: data readouts, tool labels, CLI-style interfaces, metrics</div>
  </div>
</div>

{/* LOGO */}
<div className="section" style={parseStyle("padding-top:0")}>
  <div className="section-label">03 — Logo System</div>
  <h2 className="section-title">Logo Concepts</h2>
  <p className="section-desc">Three logo lockups sharing a common mark: a constellation-form spark — a nod to both Texas's star identity and the data network that powers grassroots work.</p>

  <div className="logo-grid">
    {/* Logo 1A: Full Horizontal */}
    <div className="logo-card">
      <div className="logo-preview" style={parseStyle("background:#0A1628")}>
        <svg width="220" height="60" viewBox="0 0 220 60" fill="none">
          {/* Constellation mark */}
          <circle cx="20" cy="30" r="2.5" fill="#A8C5D8"/>
          <circle cx="34" cy="18" r="2" fill="#A8C5D8"/>
          <circle cx="34" cy="42" r="2" fill="#A8C5D8"/>
          <circle cx="48" cy="30" r="3.5" fill="#00C4A7"/>
          <circle cx="58" cy="18" r="1.5" fill="#F0B429"/>
          <line x1="20" y1="30" x2="34" y2="18" stroke="rgba(168,197,216,0.4)" strokeWidth="0.8"/>
          <line x1="20" y1="30" x2="34" y2="42" stroke="rgba(168,197,216,0.4)" strokeWidth="0.8"/>
          <line x1="34" y1="18" x2="48" y2="30" stroke="rgba(0,196,167,0.5)" strokeWidth="0.8"/>
          <line x1="34" y1="42" x2="48" y2="30" stroke="rgba(0,196,167,0.5)" strokeWidth="0.8"/>
          <line x1="48" y1="30" x2="58" y2="18" stroke="rgba(240,180,41,0.5)" strokeWidth="0.8"/>
          {/* Wordmark */}
          <text x="72" y="26" fontFamily="Cormorant Garamond, serif" fontSize="20" fontWeight="600" fill="#F8F4ED" letterSpacing="-0.02em">tx_</text>
          <text x="103" y="26" fontFamily="Cormorant Garamond, serif" fontSize="20" fontWeight="600" fill="#00C4A7" letterSpacing="-0.02em">spark</text>
          <text x="72" y="42" fontFamily="'Fira Code', monospace" fontSize="8" fill="rgba(248,244,237,0.35)" letterSpacing="0.18em">SPARKING GRASSROOTS CHANGE</text>
        </svg>
      </div>
      <div className="logo-info">
        <div className="logo-info-name">Primary Horizontal</div>
        <div className="logo-info-desc">Default lockup for headers, digital applications, and print.</div>
      </div>
    </div>

    {/* Logo 1B: Stacked */}
    <div className="logo-card">
      <div className="logo-preview" style={parseStyle("background:#0A1628")}>
        <svg width="120" height="110" viewBox="0 0 120 110" fill="none">
          <circle cx="60" cy="22" r="2" fill="#A8C5D8"/>
          <circle cx="46" cy="34" r="2" fill="#A8C5D8"/>
          <circle cx="74" cy="34" r="2" fill="#A8C5D8"/>
          <circle cx="60" cy="46" r="3.5" fill="#00C4A7"/>
          <circle cx="46" cy="58" r="1.5" fill="#F0B429"/>
          <circle cx="74" cy="58" r="1.5" fill="#F0B429"/>
          <line x1="60" y1="22" x2="46" y2="34" stroke="rgba(168,197,216,0.35)" strokeWidth="0.8"/>
          <line x1="60" y1="22" x2="74" y2="34" stroke="rgba(168,197,216,0.35)" strokeWidth="0.8"/>
          <line x1="46" y1="34" x2="60" y2="46" stroke="rgba(0,196,167,0.5)" strokeWidth="0.8"/>
          <line x1="74" y1="34" x2="60" y2="46" stroke="rgba(0,196,167,0.5)" strokeWidth="0.8"/>
          <line x1="60" y1="46" x2="46" y2="58" stroke="rgba(240,180,41,0.4)" strokeWidth="0.8"/>
          <line x1="60" y1="46" x2="74" y2="58" stroke="rgba(240,180,41,0.4)" strokeWidth="0.8"/>
          <text x="60" y="82" fontFamily="Cormorant Garamond, serif" fontSize="22" fontWeight="600" fill="#F8F4ED" textAnchor="middle" letterSpacing="-0.02em">tx_spark</text>
          <text x="60" y="97" fontFamily="'Fira Code', monospace" fontSize="7.5" fill="rgba(248,244,237,0.3)" textAnchor="middle" letterSpacing="0.18em">TEXAS · 2025</text>
        </svg>
      </div>
      <div className="logo-info">
        <div className="logo-info-name">Stacked / Vertical</div>
        <div className="logo-info-desc">Social profiles, square applications, merchandise.</div>
      </div>
    </div>

    {/* Logo 1C: Mark only */}
    <div className="logo-card">
      <div className="logo-preview" style={parseStyle("background:#0A1628")}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" stroke="rgba(0,196,167,0.2)" strokeWidth="1"/>
          <circle cx="40" cy="18" r="2.5" fill="#A8C5D8"/>
          <circle cx="22" cy="30" r="2" fill="#A8C5D8"/>
          <circle cx="58" cy="30" r="2" fill="#A8C5D8"/>
          <circle cx="28" cy="54" r="1.5" fill="#F0B429"/>
          <circle cx="52" cy="54" r="1.5" fill="#F0B429"/>
          <circle cx="40" cy="42" r="5" fill="#00C4A7"/>
          <line x1="40" y1="18" x2="22" y2="30" stroke="rgba(168,197,216,0.3)" strokeWidth="0.8"/>
          <line x1="40" y1="18" x2="58" y2="30" stroke="rgba(168,197,216,0.3)" strokeWidth="0.8"/>
          <line x1="22" y1="30" x2="40" y2="42" stroke="rgba(0,196,167,0.5)" strokeWidth="0.8"/>
          <line x1="58" y1="30" x2="40" y2="42" stroke="rgba(0,196,167,0.5)" strokeWidth="0.8"/>
          <line x1="40" y1="42" x2="28" y2="54" stroke="rgba(240,180,41,0.4)" strokeWidth="0.8"/>
          <line x1="40" y1="42" x2="52" y2="54" stroke="rgba(240,180,41,0.4)" strokeWidth="0.8"/>
        </svg>
      </div>
      <div className="logo-info">
        <div className="logo-info-name">Constellation Mark</div>
        <div className="logo-info-desc">Favicon, app icon, stamp. Used alone only at very small sizes.</div>
      </div>
    </div>
  </div>

  <div style={parseStyle("padding:1.5rem;border:1px solid rgba(255,255,255,0.06);border-radius:12px;margin-top:1rem")}>
    <div className="component-label-row">Logo on Light Background</div>
    <div style={parseStyle("background:#F8F4ED;padding:2rem;border-radius:8px;display:flex;align-items:center;justify-content:center")}>
      <svg width="200" height="50" viewBox="0 0 220 60" fill="none">
        <circle cx="20" cy="30" r="2.5" fill="#3D5068"/>
        <circle cx="34" cy="18" r="2" fill="#3D5068"/>
        <circle cx="34" cy="42" r="2" fill="#3D5068"/>
        <circle cx="48" cy="30" r="3.5" fill="#00C4A7"/>
        <circle cx="58" cy="18" r="1.5" fill="#F0B429"/>
        <line x1="20" y1="30" x2="34" y2="18" stroke="rgba(61,80,104,0.3)" strokeWidth="0.8"/>
        <line x1="20" y1="30" x2="34" y2="42" stroke="rgba(61,80,104,0.3)" strokeWidth="0.8"/>
        <line x1="34" y1="18" x2="48" y2="30" stroke="rgba(0,196,167,0.4)" strokeWidth="0.8"/>
        <line x1="34" y1="42" x2="48" y2="30" stroke="rgba(0,196,167,0.4)" strokeWidth="0.8"/>
        <line x1="48" y1="30" x2="58" y2="18" stroke="rgba(240,180,41,0.4)" strokeWidth="0.8"/>
        <text x="72" y="26" fontFamily="Cormorant Garamond, serif" fontSize="20" fontWeight="600" fill="#0A1628" letterSpacing="-0.02em">tx_</text>
        <text x="103" y="26" fontFamily="Cormorant Garamond, serif" fontSize="20" fontWeight="600" fill="#00C4A7" letterSpacing="-0.02em">spark</text>
        <text x="72" y="42" fontFamily="'Fira Code', monospace" fontSize="8" fill="rgba(10,22,40,0.35)" letterSpacing="0.18em">SPARKING GRASSROOTS CHANGE</text>
      </svg>
    </div>
  </div>
</div>

{/* VOICE & TONE */}
<div className="section" style={parseStyle("padding-top:0")}>
  <div className="section-label">04 — Voice & Tone</div>
  <h2 className="section-title">How We Speak</h2>
  <p className="section-desc">tx_spark communicates like the smartest person at the volunteer table — never condescending, always clear, occasionally irreverent, always on the side of the people doing the work.</p>

  <div className="tone-grid">
    <div className="tone-card">
      <div className="tone-tag tone-do">We Are</div>
      <div className="tone-title">Plainspoken & Precise</div>
      <div className="tone-body">We translate data complexity into clear, actionable language. We don't hide behind jargon — we use it only when it serves the reader.</div>
      <div className="tone-example">"Here's what this bill means for your district — and here's what you can do about it today."</div>
    </div>
    <div className="tone-card">
      <div className="tone-tag tone-do">We Are</div>
      <div className="tone-title">Grounded & Texan</div>
      <div className="tone-body">We write like people who live here. We know the land, the lege, and the culture. We don't talk at Texans — we talk with them.</div>
      <div className="tone-example">"The session's in full swing. Let's make some noise before sine die."</div>
    </div>
    <div className="tone-card">
      <div className="tone-tag tone-do">We Are</div>
      <div className="tone-title">Optimistic & Urgent</div>
      <div className="tone-body">We believe change is possible. We communicate momentum and possibility — but never at the cost of accuracy about what's hard.</div>
      <div className="tone-example">"This tracker shows 14 bills that need your voice this week."</div>
    </div>
    <div className="tone-card">
      <div className="tone-tag tone-dont">We're Not</div>
      <div className="tone-title">Alarmist or Defeatist</div>
      <div className="tone-body">We don't use fear to motivate. We don't catastrophize. We trust people to respond to honest, clear information.</div>
      <div className="tone-example" style={parseStyle("color:#FF8060")}>❌ "This bill WILL DESTROY everything we've worked for!!!"</div>
    </div>
    <div className="tone-card">
      <div className="tone-tag tone-dont">We're Not</div>
      <div className="tone-title">Corporate or Stiff</div>
      <div className="tone-body">We're a grassroots org. We can be funny. We can be direct. We are not a nonprofit comms department from 2012.</div>
      <div className="tone-example" style={parseStyle("color:#FF8060")}>❌ "We are pleased to announce our strategic partnership initiative..."</div>
    </div>
    <div className="tone-card">
      <div className="tone-tag tone-dont">We're Not</div>
      <div className="tone-title">Insider-Only</div>
      <div className="tone-body">Every tool and communication should work for a first-time volunteer, not just a seasoned organizer. Accessibility is a core brand value.</div>
      <div className="tone-example" style={parseStyle("color:#FF8060")}>❌ Unexplained acronyms, assumed legislative knowledge</div>
    </div>
  </div>
</div>

{/* IMAGERY */}
<div className="section" style={parseStyle("padding-top:0")}>
  <div className="section-label">05 — Imagery Direction</div>
  <h2 className="section-title">Visual Language</h2>
  <p className="section-desc">Photography and illustration should feel like the Texas night sky: wide, deep, and full of individual points of light. Real people, real places — never stock-photo generic.</p>

  <div className="imagery-grid">
    <div className="imagery-card">
      <div className="imagery-thumb photo-thumb-1">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="8" fill="none" stroke="rgba(248,244,237,0.4)" strokeWidth="1"/><circle cx="20" cy="20" r="2" fill="#00C4A7"/><line x1="20" y1="4" x2="20" y2="12" stroke="rgba(248,244,237,0.3)" strokeWidth="0.8"/><line x1="20" y1="28" x2="20" y2="36" stroke="rgba(248,244,237,0.3)" strokeWidth="0.8"/></svg>
      </div>
      <div className="imagery-info">
        <div className="imagery-info-name">Night Sky + Data</div>
        <div className="imagery-info-desc">Star fields, long exposure shots, charts that mirror constellations</div>
      </div>
    </div>
    <div className="imagery-card">
      <div className="imagery-thumb photo-thumb-2">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><rect x="8" y="20" width="24" height="14" rx="2" fill="none" stroke="rgba(248,244,237,0.4)" strokeWidth="1"/><line x1="8" y1="25" x2="32" y2="25" stroke="rgba(0,196,167,0.4)" strokeWidth="0.5"/><circle cx="14" cy="16" r="4" fill="none" stroke="rgba(248,244,237,0.3)" strokeWidth="0.8"/><circle cx="26" cy="14" r="3" fill="none" stroke="rgba(248,244,237,0.3)" strokeWidth="0.8"/></svg>
      </div>
      <div className="imagery-info">
        <div className="imagery-info-name">People + Screens</div>
        <div className="imagery-info-desc">Authentic organizers in real environments, tools visible</div>
      </div>
    </div>
    <div className="imagery-card">
      <div className="imagery-thumb photo-thumb-3">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><path d="M10 30 L20 10 L30 30" stroke="rgba(248,244,237,0.4)" strokeWidth="1" fill="none"/><path d="M14 24 L26 24" stroke="rgba(0,196,167,0.4)" strokeWidth="0.5"/></svg>
      </div>
      <div className="imagery-info">
        <div className="imagery-info-name">Texas Landscape</div>
        <div className="imagery-info-desc">Hill Country, Capitol dome, wide open sky and horizon</div>
      </div>
    </div>
    <div className="imagery-card">
      <div className="imagery-thumb" style={parseStyle("background:#243448")}>
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="12" cy="28" r="6" fill="none" stroke="#A8C5D8" strokeWidth="0.8"/><circle cx="24" cy="24" r="5" fill="none" stroke="#00C4A7" strokeWidth="0.8"/><circle cx="32" cy="28" r="4" fill="none" stroke="#F0B429" strokeWidth="0.8"/></svg>
      </div>
      <div className="imagery-info">
        <div className="imagery-info-name">Data Visualization</div>
        <div className="imagery-info-desc">Maps, charts, network diagrams that illuminate patterns</div>
      </div>
    </div>
  </div>

  <div className="do-dont-row">
    <div className="do-card">
      <span className="label">Use</span>
      <div className="dd-item">Real people in authentic Texas settings</div>
      <div className="dd-item">Night-toned photography with rich shadows</div>
      <div className="dd-item">Data visualizations as art — maps, networks, scatter plots</div>
      <div className="dd-item">Hand-drawn elements mixed with digital precision</div>
      <div className="dd-item">Wide horizon shots that suggest scale and possibility</div>
    </div>
    <div className="dont-card">
      <span className="label">Avoid</span>
      <div className="dd-item">Generic stock photography of "diverse hands holding laptops"</div>
      <div className="dd-item">Bright white, overexposed tech startup aesthetics</div>
      <div className="dd-item">Clip art or cartoon-style political graphics</div>
      <div className="dd-item">Photos from campaign season 2018 that feel dated</div>
      <div className="dd-item">Any imagery that feels aspirational without being real</div>
    </div>
  </div>
</div>

{/* COMPONENTS */}
<div className="section" style={parseStyle("padding-top:0")}>
  <div className="section-label">06 — UI Components</div>
  <h2 className="section-title">Sample Interface Elements</h2>

  <div className="component-label-row">Buttons</div>
  <div className="component-row">
    <button style={parseStyle("padding:10px 22px;background:#00C4A7;color:#0A1628;border:none;border-radius:7px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:13px;letter-spacing:0.04em;cursor:pointer")}>Take Action</button>
    <button style={parseStyle("padding:10px 22px;background:transparent;color:#00C4A7;border:1.5px solid #00C4A7;border-radius:7px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:13px;letter-spacing:0.04em;cursor:pointer")}>View Bill</button>
    <button style={parseStyle("padding:10px 22px;background:#F0B429;color:#0A1628;border:none;border-radius:7px;font-family:'Plus Jakarta Sans',sans-serif;font-weight:700;font-size:13px;letter-spacing:0.04em;cursor:pointer")}>Join Campaign</button>
    <button style={parseStyle("padding:10px 22px;background:transparent;color:rgba(248,244,237,0.5);border:1px solid rgba(255,255,255,0.15);border-radius:7px;font-family:'Plus Jakarta Sans',sans-serif;font-size:13px;cursor:pointer")}>Learn More</button>
  </div>

  <div className="component-label-row" style={parseStyle("margin-top:1rem")}>Data Cards</div>
  <div style={parseStyle("display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:12px;margin-bottom:2rem")}>
    <div style={parseStyle("padding:1.25rem;background:rgba(0,196,167,0.08);border:1px solid rgba(0,196,167,0.2);border-radius:10px")}>
      <div style={parseStyle("font-family:'Fira Code',monospace;font-size:11px;color:#00C4A7;letter-spacing:0.08em;margin-bottom:8px")}>BILLS TRACKED</div>
      <div style={parseStyle("font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:600;color:#F8F4ED")}>1,247</div>
      <div style={parseStyle("font-size:11px;color:rgba(248,244,237,0.4);margin-top:4px")}>89th Legislature</div>
    </div>
    <div style={parseStyle("padding:1.25rem;background:rgba(240,180,41,0.08);border:1px solid rgba(240,180,41,0.2);border-radius:10px")}>
      <div style={parseStyle("font-family:'Fira Code',monospace;font-size:11px;color:#F0B429;letter-spacing:0.08em;margin-bottom:8px")}>ACTIVE CALLS</div>
      <div style={parseStyle("font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:600;color:#F8F4ED")}>89</div>
      <div style={parseStyle("font-size:11px;color:rgba(248,244,237,0.4);margin-top:4px")}>Current campaigns</div>
    </div>
    <div style={parseStyle("padding:1.25rem;background:rgba(168,197,216,0.07);border:1px solid rgba(168,197,216,0.15);border-radius:10px")}>
      <div style={parseStyle("font-family:'Fira Code',monospace;font-size:11px;color:#A8C5D8;letter-spacing:0.08em;margin-bottom:8px")}>ORGANIZERS</div>
      <div style={parseStyle("font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:600;color:#F8F4ED")}>14K+</div>
      <div style={parseStyle("font-size:11px;color:rgba(248,244,237,0.4);margin-top:4px")}>Across Texas</div>
    </div>
  </div>
</div>
<div className="divider" style={parseStyle("margin:0 2rem")}></div>

</div>{/* end deck-1 */}
</div>{/* end panel-1 */}

{/* ===================================================
     DECK 2 — HILL COUNTRY HEAT
     =================================================== */}
<div id="panel-2" className="deck-panel">
<div id="deck-2">

<div className="deck-hero">
  <div className="deck-hero-content" style={parseStyle("position:relative;z-index:2")}>
    <div className="deck-hero-number">Brand Direction 02 / 03</div>
    <h2 className="deck-hero-name">Hill Country <em>Heat</em></h2>
    <p className="deck-hero-tagline" style={parseStyle("color:rgba(250,232,208,0.6)")}>Boots in the soil, eyes on the horizon — earthy, grounded, community-first warmth that earns trust.</p>
  </div>
</div>

{/* POSITIONING */}
<div className="section">
  <div className="section-label">Brand Positioning</div>
  <h2 className="section-title" style={parseStyle("font-family:'Fraunces',serif")}>The Brand Story</h2>
  <div className="positioning-block pb-2">
    <div className="positioning-word">Positioning Statement</div>
    <p className="positioning-statement">"tx_spark is the neighbor with the data — built from the same community it serves, powered by people who've knocked doors, made calls, and know exactly what's at stake in this Texas moment."</p>
    <div className="positioning-pillars">
      <span className="pillar-tag" style={parseStyle("background:rgba(232,143,90,0.18);color:#E88F5A")}>Community-First</span>
      <span className="pillar-tag" style={parseStyle("background:rgba(75,50,114,0.18);color:#C4B8DC")}>Grassroots</span>
      <span className="pillar-tag" style={parseStyle("background:rgba(250,241,227,0.08);color:rgba(250,241,227,0.6)")}>Earned Trust</span>
      <span className="pillar-tag" style={parseStyle("background:rgba(250,241,227,0.08);color:rgba(250,241,227,0.6)")}>Accessible</span>
      <span className="pillar-tag" style={parseStyle("background:rgba(250,241,227,0.08);color:rgba(250,241,227,0.6)")}>Warm</span>
    </div>
  </div>
  <p className="section-desc">Hill Country Heat anchors tx_spark's identity in the physical, human reality of Texas organizing. This is the direction that feels like a handshake — approachable to everyone from a Laredo first-timer to a veteran Austin activist.</p>
</div>

{/* COLORS */}
<div className="section" style={parseStyle("padding-top:0")}>
  <div className="section-label">01 — Color System</div>
  <h2 className="section-title" style={parseStyle("font-family:'Fraunces',serif")}>Color Palette</h2>
  <p className="section-desc">Texas earth and sky — the burnt sienna of red rock country, sage green of cedar and juniper, the limestone cream of Austin's building blocks, and the dust of a Hill Country afternoon.</p>

  <div className="color-grid">
    <div className="color-swatch">
      <div className="swatch-color d2-earth" style={parseStyle("height:110px")}><span style={parseStyle("font-family:'Fira Code',monospace;font-size:10px;color:rgba(250,232,208,0.35)")}>PRIMARY</span></div>
      <div className="swatch-info"><div className="swatch-name">Deep Earth</div><div className="swatch-hex">#2C1A0E</div><div className="swatch-role">Primary / Background</div></div>
    </div>
    <div className="color-swatch">
      <div className="swatch-color d2-rust" style={parseStyle("height:110px")}><span style={parseStyle("font-family:'Fira Code',monospace;font-size:10px;color:rgba(250,232,208,0.35)")}>BOLD</span></div>
      <div className="swatch-info"><div className="swatch-name">Cowboy Rust</div><div className="swatch-hex">#8B2A12</div><div className="swatch-role">Bold / Emphasis</div></div>
    </div>
    <div className="color-swatch">
      <div className="swatch-color d2-dust" style={parseStyle("height:110px")}><span style={parseStyle("font-family:'Fira Code',monospace;font-size:10px;color:rgba(44,26,14,0.5)")}>SECONDARY</span></div>
      <div className="swatch-info"><div className="swatch-name">Terracotta Dust</div><div className="swatch-hex">#E88F5A</div><div className="swatch-role">Primary Accent / Warm Action</div></div>
    </div>
    <div className="color-swatch">
      <div className="swatch-color d2-sage" style={parseStyle("height:110px")}><span style={parseStyle("font-family:'Fira Code',monospace;font-size:10px;color:rgba(44,26,14,0.4)")}>ACCENT</span></div>
      <div className="swatch-info"><div className="swatch-name">Rust Clay</div><div className="swatch-hex">#C8856A</div><div className="swatch-role">Rust · Secondary / Muted</div></div>
    </div>
    <div className="color-swatch">
      <div className="swatch-color d2-limestone" style={parseStyle("height:110px;border:1px solid rgba(255,255,255,0.06)")}><span style={parseStyle("font-family:'Fira Code',monospace;font-size:10px;color:rgba(44,26,14,0.4)")}>LIGHT</span></div>
      <div className="swatch-info"><div className="swatch-name">Surface Mist</div><div className="swatch-hex">#EDE9FA</div><div className="swatch-role">Light Surfaces (on site)</div></div>
    </div>
    <div className="color-swatch">
      <div className="swatch-color d2-sky" style={parseStyle("height:110px")}><span style={parseStyle("font-family:'Fira Code',monospace;font-size:10px;color:rgba(44,26,14,0.5)")}>COOL</span></div>
      <div className="swatch-info"><div className="swatch-name">Sky Blue</div><div className="swatch-hex">#6A9BAD</div><div className="swatch-role">Secondary Accent · Links / UI</div></div>
    </div>
  </div>

  <div style={parseStyle("padding:1.5rem;border:1px solid rgba(255,255,255,0.06);border-radius:12px;background:rgba(255,255,255,0.02)")}>
    <div className="component-label-row">Color Usage Ratios</div>
    <div style={parseStyle("display:flex;gap:4px;height:28px;border-radius:6px;overflow:hidden;margin-bottom:12px")}>
      <div style={parseStyle("background:#EDE9FA;flex:5;display:flex;align-items:center;justify-content:center;font-size:10px;font-family:'Fira Code',monospace;color:rgba(44,26,14,0.5)")}>50% Surface</div>
      <div style={parseStyle("background:#E88F5A;flex:2;display:flex;align-items:center;justify-content:center;font-size:10px;font-family:'Fira Code',monospace;color:rgba(44,26,14,0.7)")}>20%</div>
      <div style={parseStyle("background:#2C1A0E;flex:2;display:flex;align-items:center;justify-content:center;font-size:10px;font-family:'Fira Code',monospace;color:rgba(250,241,227,0.5)")}>20%</div>
      <div style={parseStyle("background:#4B3272;flex:1;display:flex;align-items:center;justify-content:center;font-size:10px;font-family:'Fira Code',monospace;color:rgba(237,233,250,0.85)")}>10%</div>
    </div>
    <p style={parseStyle("font-size:13px;opacity:0.5;line-height:1.5")}>Light surface as primary space · Warm accent for action · Deep earth for grounding · Purple depth for emphasis (live site uses #EDD9B0 page background)</p>
  </div>
</div>

{/* TYPOGRAPHY */}
<div className="section" style={parseStyle("padding-top:0")}>
  <div className="section-label">02 — Typography</div>
  <h2 className="section-title" style={parseStyle("font-family:'Fraunces',serif")}>Type System</h2>
  <p className="section-desc">Fraunces brings the warmth of an old Texas newspaper masthead — slightly quirky, deeply readable, with optical personality. Nunito keeps the digital layer friendly and accessible at any size.</p>

  <div className="type-specimen display">
    <div className="type-meta">DISPLAY — Fraunces 700 · Campaign titles, headlines, hero moments</div>
    <div className="type-sample-xl" style={parseStyle("font-family:'Fraunces',serif;font-weight:700;color:#FAE8D0")}>Your Voice,<br /><em style={parseStyle("color:#E88F5A")}>Their Vote.</em></div>
    <div className="type-sample-sm" style={parseStyle("font-family:'DM Mono',monospace")}>Fraunces — Bold 700 · Optical size responsive · Use for: hero, campaign titles, statements</div>
  </div>

  <div className="type-specimen heading">
    <div className="type-meta">HEADING — Nunito 700 · Subheadings, card headers, tool navigation</div>
    <div className="type-sample-lg" style={parseStyle("font-family:'Nunito',sans-serif;font-weight:700;color:#FAE8D0")}>Find Your Representatives</div>
    <div className="type-sample-sm" style={parseStyle("font-family:'DM Mono',monospace")}>Nunito — Bold 700 · Use for: H2–H5, navigation, UI section titles</div>
  </div>

  <div className="type-specimen body">
    <div className="type-meta">BODY — Nunito 300–400 · Descriptions, tool copy, explanatory text</div>
    <div className="type-sample-md" style={parseStyle("font-family:'Nunito',sans-serif;font-weight:300;color:#FAE8D0")}>These tools were made for you. Whether this is your first time contacting a legislator or you've been at it for decades, tx_spark has resources that meet you where you are.</div>
    <div className="type-sample-sm" style={parseStyle("font-family:'DM Mono',monospace")}>Nunito — Light 300 / Regular 400 · Line height: 1.75 · Ideal for long-form and accessibility-first reading</div>
  </div>

  <div className="type-specimen mono">
    <div className="type-meta">DATA — DM Mono 400 · Statistics, bill numbers, tracker data</div>
    <div className="type-sample-sm" style={parseStyle("font-family:'DM Mono',monospace;font-size:14px;color:#E88F5A")}>HB 0042 · Education · Committee: House Public Ed · Status: Referred · Action needed: CALL</div>
    <div className="type-sample-sm" style={parseStyle("font-family:'DM Mono',monospace;margin-top:8px")}>DM Mono — Regular · Use for: bill IDs, data tables, action codes, legislative tracking</div>
  </div>
</div>

{/* LOGO */}
<div className="section" style={parseStyle("padding-top:0")}>
  <div className="section-label">03 — Logo System</div>
  <h2 className="section-title" style={parseStyle("font-family:'Fraunces',serif")}>Logo Concepts</h2>
  <p className="section-desc">The Hill Country Heat mark centers on a flame-as-spark — an upward-reaching form that channels both the literal energy of organizing and the metaphor of igniting action. A lone star rests at the apex.</p>

  <div className="logo-grid">
    <div className="logo-card">
      <div className="logo-preview" style={parseStyle("background:#1A0A03")}>
        <svg width="200" height="80" viewBox="0 0 200 80" fill="none">
          {/* Flame mark */}
          <path d="M28 58 C28 42, 20 36, 24 24 C26 18, 30 16, 30 20 C30 24, 34 22, 36 16 C38 10, 40 6, 40 6 C40 6, 48 16, 44 28 C42 34, 46 32, 48 26 C52 38, 44 48, 44 58 Z" fill="#E88F5A" opacity="0.9"/>
          <path d="M32 58 C32 46, 28 42, 30 34 C32 30, 34 30, 34 32 C36 42, 40 44, 40 58 Z" fill="#8B2A12" opacity="0.6"/>
          {/* Star */}
          <polygon points="36,8 37.2,11.5 41,11.5 38,13.8 39.2,17.3 36,15 32.8,17.3 34,13.8 31,11.5 34.8,11.5" fill="#EDE9FA" opacity="0.9" transform="translate(0,-2)"/>
          {/* Wordmark */}
          <text x="58" y="34" fontFamily="Fraunces, serif" fontSize="22" fontWeight="700" fill="#FAE8D0" letterSpacing="-0.01em">tx_spark</text>
          <text x="58" y="52" fontFamily="'DM Mono', monospace" fontSize="9" fill="rgba(250,232,208,0.35)" letterSpacing="0.14em">SPARKING GRASSROOTS CHANGE</text>
          <text x="58" y="66" fontFamily="'DM Mono', monospace" fontSize="8" fill="rgba(250,232,208,0.2)" letterSpacing="0.1em">AUSTIN, TEXAS</text>
        </svg>
      </div>
      <div className="logo-info"><div className="logo-info-name">Primary Horizontal</div><div className="logo-info-desc">Default application for digital and print materials.</div></div>
    </div>

    <div className="logo-card">
      <div className="logo-preview" style={parseStyle("background:#EDE9FA")}>
        <svg width="100" height="120" viewBox="0 0 100 120" fill="none">
          <path d="M50 90 C50 68, 38 60, 42 40 C45 30, 50 26, 50 30 C50 36, 56 34, 58 26 C62 14, 66 6, 66 6 C66 6, 78 26, 70 44 C66 54, 72 50, 74 40 C80 60, 68 76, 68 90 Z" fill="#E88F5A" opacity="0.95"/>
          <path d="M54 90 C54 72, 48 66, 50 54 C52 48, 55 47, 55 50 C57 62, 62 66, 62 90 Z" fill="#8B2A12" opacity="0.5"/>
          <polygon points="58,9 60,14.5 66,14.5 61.5,18 63.5,23.5 58,20 52.5,23.5 54.5,18 50,14.5 56,14.5" fill="#2C1A0E" opacity="0.7"/>
          <text x="50" y="108" fontFamily="Fraunces, serif" fontSize="18" fontWeight="700" fill="#2C1A0E" textAnchor="middle">tx_spark</text>
        </svg>
      </div>
      <div className="logo-info"><div className="logo-info-name">Light Background</div><div className="logo-info-desc">For print, cream/white surfaces, documents.</div></div>
    </div>

    <div className="logo-card">
      <div className="logo-preview" style={parseStyle("background:#1A0A03")}>
        <svg width="70" height="70" viewBox="0 0 70 70" fill="none">
          <circle cx="35" cy="35" r="33" fill="rgba(232,143,90,0.08)" stroke="rgba(232,143,90,0.2)" strokeWidth="1"/>
          <path d="M35 56 C35 42, 26 36, 29 26 C31 20, 35 18, 35 21 C35 25, 39 23, 40 17 C43 9, 46 4, 46 4 C46 4, 53 14, 49 24 C47 30, 50 28, 51 23 C55 33, 48 44, 48 56 Z" fill="#E88F5A"/>
          <path d="M38 56 C38 46, 35 42, 36 36 C37 32, 39 32, 39 34 C40 42, 43 44, 43 56 Z" fill="#8B2A12" opacity="0.5"/>
          <polygon points="40.5,6 41.8,10 46,10 42.5,12.5 43.8,16.5 40.5,14 37.2,16.5 38.5,12.5 35,10 39.2,10" fill="#EDE9FA" opacity="0.9"/>
        </svg>
      </div>
      <div className="logo-info"><div className="logo-info-name">Flame Mark</div><div className="logo-info-desc">Standalone icon for app, favicon, social avatar.</div></div>
    </div>
  </div>
</div>

{/* VOICE & TONE */}
<div className="section" style={parseStyle("padding-top:0")}>
  <div className="section-label">04 — Voice & Tone</div>
  <h2 className="section-title" style={parseStyle("font-family:'Fraunces',serif")}>How We Speak</h2>
  <p className="section-desc">We are the neighbor with the spreadsheet, the organizer with the app. Our voice is warm, direct, and rooted in the real lives of Texans doing the work.</p>

  <div className="tone-grid">
    <div className="tone-card">
      <div className="tone-tag" style={parseStyle("background:rgba(232,143,90,0.12);color:#E88F5A")}>We Are</div>
      <div className="tone-title">Warm & Personal</div>
      <div className="tone-body">We speak to people, not at them. Every piece of communication should feel like it came from a trusted friend who happens to be really good with data.</div>
      <div className="tone-example">"We built this tool because we needed it ourselves. We hope it helps you too."</div>
    </div>
    <div className="tone-card">
      <div className="tone-tag" style={parseStyle("background:rgba(75,50,114,0.15);color:#C4B8DC")}>We Are</div>
      <div className="tone-title">Accessible & Patient</div>
      <div className="tone-body">We define our terms. We don't assume knowledge. We meet people where they are — and we make the complex feel manageable, never overwhelming.</div>
      <div className="tone-example">"The Texas Legislature meets every two years. Right now, your window to make a difference is open."</div>
    </div>
    <div className="tone-card">
      <div className="tone-tag" style={parseStyle("background:rgba(232,143,90,0.12);color:#E88F5A")}>We Are</div>
      <div className="tone-title">Honest & Specific</div>
      <div className="tone-body">We don't over-promise. We tell people specifically what action works, why it works, and what to expect — because that respect builds lasting trust.</div>
      <div className="tone-example">"Calling is more effective than emailing. Here's a script that takes 2 minutes."</div>
    </div>
    <div className="tone-card">
      <div className="tone-tag tone-dont">We're Not</div>
      <div className="tone-title">Preachy or Lecture-y</div>
      <div className="tone-body">We don't moralize. People know the stakes — we give them tools, not speeches. We respect their time and their intelligence.</div>
      <div className="tone-example" style={parseStyle("color:#FF8060")}>❌ "As engaged citizens who care deeply about democracy, we must all..."</div>
    </div>
    <div className="tone-card">
      <div className="tone-tag tone-dont">We're Not</div>
      <div className="tone-title">Abstract or Vague</div>
      <div className="tone-body">No platitudes about "fighting for Texas." Tell me which bill, which committee, which rep, and what I can do about it by Friday.</div>
      <div className="tone-example" style={parseStyle("color:#FF8060")}>❌ "Now more than ever, the future of our democracy depends on..."</div>
    </div>
    <div className="tone-card">
      <div className="tone-tag tone-dont">We're Not</div>
      <div className="tone-title">Austin-Bubble Only</div>
      <div className="tone-body">We serve all of Texas. Our language, examples, and tone must resonate in Lubbock and Laredo, not just South Congress. We celebrate Texas as a whole.</div>
      <div className="tone-example" style={parseStyle("color:#FF8060")}>❌ Cultural references that only land for Austin insiders</div>
    </div>
  </div>
</div>

{/* IMAGERY */}
<div className="section" style={parseStyle("padding-top:0")}>
  <div className="section-label">05 — Imagery Direction</div>
  <h2 className="section-title" style={parseStyle("font-family:'Fraunces',serif")}>Visual Language</h2>

  <div className="imagery-grid">
    <div className="imagery-card">
      <div className="imagery-thumb photo-thumb-4"></div>
      <div className="imagery-info"><div className="imagery-info-name">Texas Landscape</div><div className="imagery-info-desc">Hill Country sunsets, limestone outcroppings, oak canopy light</div></div>
    </div>
    <div className="imagery-card">
      <div className="imagery-thumb photo-thumb-5"></div>
      <div className="imagery-info"><div className="imagery-info-name">Community Moments</div><div className="imagery-info-desc">Town halls, clipboards, handshakes — real organizing, not staged</div></div>
    </div>
    <div className="imagery-card">
      <div className="imagery-thumb photo-thumb-6"></div>
      <div className="imagery-info"><div className="imagery-info-name">Growth & Action</div><div className="imagery-info-desc">Seedlings, roots, hands in soil — organic growth metaphors</div></div>
    </div>
    <div className="imagery-card">
      <div className="imagery-thumb" style={parseStyle("background:#353428")}></div>
      <div className="imagery-info"><div className="imagery-info-name">Sky at Transition</div><div className="imagery-info-desc">Dawn, dusk — moments of change and possibility</div></div>
    </div>
  </div>

  <div className="do-dont-row">
    <div className="do-card" style={parseStyle("border-left-color:#E88F5A;background:rgba(232,143,90,0.04)")}>
      <span className="label" style={parseStyle("color:#E88F5A")}>Use</span>
      <div className="dd-item">Photography with warmth — golden hour, soft natural light</div>
      <div className="dd-item">Diverse Texans in authentic settings across the state</div>
      <div className="dd-item">Textures — limestone, wood grain, woven fabric, paper</div>
      <div className="dd-item">Hand-drawn or hand-lettered elements for warmth</div>
      <div className="dd-item">Maps of Texas that make district data feel personal</div>
    </div>
    <div className="dont-card">
      <span className="label">Avoid</span>
      <div className="dd-item">Cold, blue-tinted photography that feels distant</div>
      <div className="dd-item">Stock imagery of generic crowds or protest clichés</div>
      <div className="dd-item">Slick, corporate data visualization aesthetics</div>
      <div className="dd-item">Any imagery that feels like coastal tech or DC politics</div>
      <div className="dd-item">Filters that desaturate the warmth from Texas life</div>
    </div>
  </div>
</div>

{/* COMPONENTS */}
<div className="section" style={parseStyle("padding-top:0")}>
  <div className="section-label">06 — UI Components</div>
  <h2 className="section-title" style={parseStyle("font-family:'Fraunces',serif")}>Sample Interface Elements</h2>

  <div className="component-label-row">Buttons</div>
  <div className="component-row">
    <button style={parseStyle("padding:10px 22px;background:#E88F5A;color:#1A1130;border:none;border-radius:8px;font-family:'Nunito',sans-serif;font-weight:700;font-size:14px;cursor:pointer")}>Contact Rep</button>
    <button style={parseStyle("padding:10px 22px;background:transparent;color:#E88F5A;border:1.5px solid #E88F5A;border-radius:8px;font-family:'Nunito',sans-serif;font-weight:700;font-size:14px;cursor:pointer")}>Track Bill</button>
    <button style={parseStyle("padding:10px 22px;background:#4B3272;color:#EDE9FA;border:none;border-radius:8px;font-family:'Nunito',sans-serif;font-weight:700;font-size:14px;cursor:pointer")}>Get Involved</button>
    <button style={parseStyle("padding:10px 22px;background:#EDE9FA;color:#1A1130;border:1px solid rgba(26,17,48,0.15);border-radius:8px;font-family:'Nunito',sans-serif;font-size:14px;cursor:pointer")}>Learn More</button>
  </div>

  <div className="component-label-row" style={parseStyle("margin-top:1.5rem")}>Bill Tracker Card</div>
  <div style={parseStyle("background:#EDE9FA;border-radius:12px;padding:1.5rem;border:1px solid rgba(44,26,14,0.08);margin-bottom:2rem;max-width:480px")}>
    <div style={parseStyle("display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:12px")}>
      <div>
        <div style={parseStyle("font-family:'DM Mono',monospace;font-size:11px;color:#8B2A12;letter-spacing:0.1em;margin-bottom:4px")}>HB 1247 · EDUCATION</div>
        <div style={parseStyle("font-family:'Fraunces',serif;font-size:16px;font-weight:700;color:#2C1A0E;line-height:1.3")}>Public School Funding Reform Act</div>
      </div>
      <span style={parseStyle("padding:4px 10px;background:#FEF0E7;border:1px solid rgba(232,143,90,0.3);border-radius:20px;font-family:'DM Mono',monospace;font-size:10px;color:#8B2A12;white-space:nowrap;margin-left:12px")}>ACTION NEEDED</span>
    </div>
    <p style={parseStyle("font-family:'Nunito',sans-serif;font-size:13px;color:rgba(44,26,14,0.65);line-height:1.6;margin-bottom:16px")}>This bill would increase per-pupil funding by 11% and add provisions for rural school districts facing population decline.</p>
    <div style={parseStyle("display:flex;gap:8px")}>
      <button style={parseStyle("flex:1;padding:9px;background:#E88F5A;color:#2C1A0E;border:none;border-radius:7px;font-family:'Nunito',sans-serif;font-weight:700;font-size:13px;cursor:pointer")}>Call Your Rep</button>
      <button style={parseStyle("flex:1;padding:9px;background:transparent;color:#2C1A0E;border:1px solid rgba(44,26,14,0.2);border-radius:7px;font-family:'Nunito',sans-serif;font-size:13px;cursor:pointer")}>Read Full Bill</button>
    </div>
  </div>
</div>
<div className="divider" style={parseStyle("margin:0 2rem")}></div>

</div>{/* end deck-2 */}
</div>{/* end panel-2 */}

{/* ===================================================
     DECK 3 — LIVE WIRE
     =================================================== */}
<div id="panel-3" className="deck-panel">
<div id="deck-3">

<div className="deck-hero">
  <div className="deck-hero-content" style={parseStyle("position:relative;z-index:2")}>
    <div className="deck-hero-number" style={parseStyle("color:rgba(249,249,247,0.3)")}>Brand Direction 03 / 03</div>
    <h2 className="deck-hero-name">LIVE <em>WIRE</em></h2>
    <p className="deck-hero-tagline" style={parseStyle("color:rgba(249,249,247,0.55)")}>Bold, urgent, electric — the editorial voice of a movement that doesn't have time to be subtle about what's at stake in Texas.</p>
  </div>
</div>

{/* POSITIONING */}
<div className="section">
  <div className="section-label" style={parseStyle("color:#FF4020")}>Brand Positioning</div>
  <h2 className="section-title" style={parseStyle("font-family:'Bebas Neue',sans-serif;letter-spacing:0.04em;color:#F9F9F7")}>THE BRAND STORY</h2>
  <div className="positioning-block pb-3">
    <div className="positioning-word">Positioning Statement</div>
    <p className="positioning-statement">"tx_spark is the high-voltage connection between raw data and real democracy — urgent, unapologetic, and built for the people who know that in Texas politics, every percentage point and every precinct counts."</p>
    <div className="positioning-pillars">
      <span className="pillar-tag" style={parseStyle("background:rgba(255,64,32,0.15);color:#FF4020")}>Urgent</span>
      <span className="pillar-tag" style={parseStyle("background:rgba(0,64,255,0.12);color:#6688FF")}>Precise</span>
      <span className="pillar-tag" style={parseStyle("background:rgba(255,214,0,0.12);color:#FFD600")}>Bold</span>
      <span className="pillar-tag" style={parseStyle("background:rgba(255,255,255,0.07);color:rgba(249,249,247,0.6)")}>Editorial</span>
      <span className="pillar-tag" style={parseStyle("background:rgba(255,255,255,0.07);color:rgba(249,249,247,0.6)")}>Unapologetic</span>
    </div>
  </div>
  <p className="section-desc">Live Wire is the direction for an org that's done playing nice. This is what tx_spark looks like when it stops apologizing for having a point of view. It's the zine energy of Keep Austin Weird meets the urgency of a contested precinct. Not for everyone — but unforgettable for who it is for.</p>
</div>

{/* COLORS */}
<div className="section" style={parseStyle("padding-top:0")}>
  <div className="section-label" style={parseStyle("color:#FF4020")}>01 — Color System</div>
  <h2 className="section-title" style={parseStyle("font-family:'Bebas Neue',sans-serif;letter-spacing:0.04em")}>COLOR PALETTE</h2>
  <p className="section-desc">Maximum contrast. Minimal compromise. The palette of a broadsheet newspaper that happens to know exactly which precinct is going to decide the election.</p>

  <div className="color-grid">
    <div className="color-swatch">
      <div className="swatch-color d3-black" style={parseStyle("height:110px;border:1px solid rgba(255,255,255,0.08)")}><span style={parseStyle("font-family:'Space Mono',monospace;font-size:10px;color:rgba(249,249,247,0.35)")}>PRIMARY</span></div>
      <div className="swatch-info"><div className="swatch-name">Wire Black</div><div className="swatch-hex">#0F0F0F</div><div className="swatch-role">Primary / Maximum contrast</div></div>
    </div>
    <div className="color-swatch">
      <div className="swatch-color d3-red" style={parseStyle("height:110px")}><span style={parseStyle("font-family:'Space Mono',monospace;font-size:10px;color:rgba(15,15,15,0.5)")}>ACTION</span></div>
      <div className="swatch-info"><div className="swatch-name">Vermillion</div><div className="swatch-hex">#FF4020</div><div className="swatch-role">Action / Alert / Primary Accent</div></div>
    </div>
    <div className="color-swatch">
      <div className="swatch-color d3-blue" style={parseStyle("height:110px")}><span style={parseStyle("font-family:'Space Mono',monospace;font-size:10px;color:rgba(249,249,247,0.4)")}>ELECTRIC</span></div>
      <div className="swatch-info"><div className="swatch-name">Electric Blue</div><div className="swatch-hex">#0040FF</div><div className="swatch-role">Data / Link / Secondary Accent</div></div>
    </div>
    <div className="color-swatch">
      <div className="swatch-color d3-white" style={parseStyle("height:110px;border:1px solid rgba(255,255,255,0.08)")}><span style={parseStyle("font-family:'Space Mono',monospace;font-size:10px;color:rgba(15,15,15,0.4)")}>BASE</span></div>
      <div className="swatch-info"><div className="swatch-name">Signal White</div><div className="swatch-hex">#F9F9F7</div><div className="swatch-role">Light Mode Base</div></div>
    </div>
    <div className="color-swatch">
      <div className="swatch-color d3-mid" style={parseStyle("height:110px")}><span style={parseStyle("font-family:'Space Mono',monospace;font-size:10px;color:rgba(249,249,247,0.4)")}>NEUTRAL</span></div>
      <div className="swatch-info"><div className="swatch-name">Wire Gray</div><div className="swatch-hex">#6B6B6B</div><div className="swatch-role">Supporting / Muted</div></div>
    </div>
    <div className="color-swatch">
      <div className="swatch-color d3-yellow" style={parseStyle("height:110px")}><span style={parseStyle("font-family:'Space Mono',monospace;font-size:10px;color:rgba(15,15,15,0.5)")}>HIGHLIGHT</span></div>
      <div className="swatch-info"><div className="swatch-name">Hot Yellow</div><div className="swatch-hex">#FFD600</div><div className="swatch-role">Highlight / Emphasis moments</div></div>
    </div>
  </div>

  <div style={parseStyle("padding:1.5rem;border:1px solid rgba(255,255,255,0.06);border-radius:12px;background:rgba(255,255,255,0.02)")}>
    <div className="component-label-row">Color Usage Ratios</div>
    <div style={parseStyle("display:flex;gap:4px;height:28px;border-radius:6px;overflow:hidden;margin-bottom:12px")}>
      <div style={parseStyle("background:#0F0F0F;flex:5;display:flex;align-items:center;justify-content:center;font-size:10px;font-family:'Space Mono',monospace;color:rgba(249,249,247,0.35)")}>50% Black</div>
      <div style={parseStyle("background:#F9F9F7;flex:2;display:flex;align-items:center;justify-content:center;font-size:10px;font-family:'Space Mono',monospace;color:rgba(15,15,15,0.5)")}>20% White</div>
      <div style={parseStyle("background:#FF4020;flex:2;display:flex;align-items:center;justify-content:center;font-size:10px;font-family:'Space Mono',monospace;color:rgba(15,15,15,0.6)")}>20%</div>
      <div style={parseStyle("background:#0040FF;flex:1")}></div>
    </div>
    <p style={parseStyle("font-size:13px;opacity:0.5;line-height:1.5")}>Black and white as primary contrast · Vermillion for every call to action · Electric blue for data and links · Yellow sparingly for maximum emphasis</p>
  </div>
</div>

{/* TYPOGRAPHY */}
<div className="section" style={parseStyle("padding-top:0")}>
  <div className="section-label" style={parseStyle("color:#FF4020")}>02 — Typography</div>
  <h2 className="section-title" style={parseStyle("font-family:'Bebas Neue',sans-serif;letter-spacing:0.04em")}>TYPE SYSTEM</h2>
  <p className="section-desc">Bebas Neue is the voice of a protest sign that went to college. Lato handles the information work. Space Mono stamps the data with authority. Together they feel like a paper that matters.</p>

  <div className="type-specimen display">
    <div className="type-meta">DISPLAY — Bebas Neue · Campaign titles, hero moments, impact statements</div>
    <div className="type-sample-xl" style={parseStyle("font-family:'Bebas Neue',sans-serif;letter-spacing:0.04em;color:#F9F9F7;font-weight:400;line-height:0.95")}>YOUR REP.<br /><span style={parseStyle("color:#FF4020")}>VOTED NO.</span></div>
    <div className="type-sample-sm" style={parseStyle("font-family:'Space Mono',monospace")}>Bebas Neue — Regular (display only) · Tracking: 0.04em · Pair with Lato body at 3:1 size ratio minimum</div>
  </div>

  <div className="type-specimen heading">
    <div className="type-meta">HEADING — Lato 700 · Subheadings, section titles, UI navigation</div>
    <div className="type-sample-lg" style={parseStyle("font-family:'Lato',sans-serif;font-weight:700;color:#F9F9F7;letter-spacing:0.01em")}>14,000 Texans Called Last Week</div>
    <div className="type-sample-sm" style={parseStyle("font-family:'Space Mono',monospace")}>Lato — Bold 700 · Tracking: 0.01em · Use for: H2–H4, UI labels</div>
  </div>

  <div className="type-specimen body">
    <div className="type-meta">BODY — Lato 300–400 · All explanatory and descriptive copy</div>
    <div className="type-sample-md" style={parseStyle("font-family:'Lato',sans-serif;font-weight:300;color:#F9F9F7")}>tx_spark gives organizers and advocates real-time data tools that work as hard as they do. No gatekeeping, no paywall, no asking permission. Built by Texans who are tired of waiting.</div>
    <div className="type-sample-sm" style={parseStyle("font-family:'Space Mono',monospace")}>Lato — Light 300 / Regular 400 · Line height: 1.65 · Never use Lato Light below 14px</div>
  </div>

  <div className="type-specimen mono">
    <div className="type-meta">DATA — Space Mono 400–700 · All statistics, bill identifiers, vote counts</div>
    <div className="type-sample-sm" style={parseStyle("font-family:'Space Mono',monospace;font-size:14px;color:#FF4020")}>TX-SD-14 // SB 0442 // VOTE: 21-10 // YOUR REP: NAY // NEXT: FLOOR VOTE FRI</div>
    <div className="type-sample-sm" style={parseStyle("font-family:'Space Mono',monospace;margin-top:8px")}>Space Mono — Regular + Bold · All caps optional for impact · Use for: vote records, bill IDs, data tables, metrics</div>
  </div>
</div>

{/* LOGO */}
<div className="section" style={parseStyle("padding-top:0")}>
  <div className="section-label" style={parseStyle("color:#FF4020")}>03 — Logo System</div>
  <h2 className="section-title" style={parseStyle("font-family:'Bebas Neue',sans-serif;letter-spacing:0.04em")}>LOGO CONCEPTS</h2>
  <p className="section-desc">The Live Wire mark is typographic and geometric — a bold "TX_" anchored by a sharp spark bolt, communicating both the state identity and the electrical charge of the mission.</p>

  <div className="logo-grid">
    <div className="logo-card">
      <div className="logo-preview" style={parseStyle("background:#0F0F0F")}>
        <svg width="220" height="70" viewBox="0 0 220 70" fill="none">
          {/* Spark bolt mark */}
          <polygon points="28,12 18,38 28,34 22,58 40,28 28,32" fill="#FF4020"/>
          {/* Wordmark */}
          <text x="52" y="36" fontFamily="'Bebas Neue', sans-serif" fontSize="32" fontWeight="400" fill="#F9F9F7" letterSpacing="0.04em">TX_SPARK</text>
          <text x="52" y="54" fontFamily="'Space Mono', monospace" fontSize="8.5" fill="rgba(249,249,247,0.3)" letterSpacing="0.15em">DATA-POWERED · PEOPLE-FIRST</text>
        </svg>
      </div>
      <div className="logo-info"><div className="logo-info-name">Primary Dark</div><div className="logo-info-desc">Default horizontal lockup on dark or black backgrounds.</div></div>
    </div>

    <div className="logo-card">
      <div className="logo-preview" style={parseStyle("background:#F9F9F7")}>
        <svg width="220" height="70" viewBox="0 0 220 70" fill="none">
          <polygon points="28,12 18,38 28,34 22,58 40,28 28,32" fill="#FF4020"/>
          <text x="52" y="36" fontFamily="'Bebas Neue', sans-serif" fontSize="32" fontWeight="400" fill="#0F0F0F" letterSpacing="0.04em">TX_SPARK</text>
          <text x="52" y="54" fontFamily="'Space Mono', monospace" fontSize="8.5" fill="rgba(15,15,15,0.3)" letterSpacing="0.15em">DATA-POWERED · PEOPLE-FIRST</text>
        </svg>
      </div>
      <div className="logo-info"><div className="logo-info-name">Primary Light</div><div className="logo-info-desc">For white/light surface applications, print, documents.</div></div>
    </div>

    <div className="logo-card">
      <div className="logo-preview" style={parseStyle("background:#FF4020")}>
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
          <polygon points="44,14 28,46 44,40 36,66 56,34 40,40" fill="#0F0F0F"/>
          <text
            x="40"
            y="78"
            fontFamily="'Space Mono', monospace"
            fontSize="8"
            fontWeight="700"
            fill="rgba(15,15,15,0.5)"
            textAnchor="middle"
            letterSpacing="0.1em"
          >
            TX
          </text>
        </svg>
      </div>
      <div className="logo-info"><div className="logo-info-name">Vermillion Mark</div><div className="logo-info-desc">Social avatar, app icon — maximum energy in minimum space.</div></div>
    </div>
  </div>
</div>

{/* VOICE & TONE */}
<div className="section" style={parseStyle("padding-top:0")}>
  <div className="section-label" style={parseStyle("color:#FF4020")}>04 — Voice & Tone</div>
  <h2 className="section-title" style={parseStyle("font-family:'Bebas Neue',sans-serif;letter-spacing:0.04em")}>HOW WE SPEAK</h2>
  <p className="section-desc">We speak like someone who has read every precinct report and doesn't have time to soften the message. Precise, urgent, and always pointing toward action.</p>

  <div className="tone-grid">
    <div className="tone-card">
      <div className="tone-tag" style={parseStyle("background:rgba(255,64,32,0.15);color:#FF4020")}>We Are</div>
      <div className="tone-title">Direct & Specific</div>
      <div className="tone-body">Every sentence earns its place. No filler. No winding up. Lead with what matters and get out of the way of the action.</div>
      <div className="tone-example">"SB 12 goes to the floor Friday. Your rep is on the fence. Call now."</div>
    </div>
    <div className="tone-card">
      <div className="tone-tag" style={parseStyle("background:rgba(0,64,255,0.12);color:#6688FF")}>We Are</div>
      <div className="tone-title">Data-Forward</div>
      <div className="tone-body">The numbers are our authority. We show the data, explain what it means, and trust people to be moved by facts — not manufactured emotion.</div>
      <div className="tone-example">"Turnout in HD-47 was 38% in 2022. Here's what 42% looks like."</div>
    </div>
    <div className="tone-card">
      <div className="tone-tag" style={parseStyle("background:rgba(255,64,32,0.15);color:#FF4020")}>We Are</div>
      <div className="tone-title">Unapologetically Texan</div>
      <div className="tone-body">We have a point of view. We're building tools for pro-democracy Texans, and we don't pretend to be neutral. Plainspoken pride in what we're doing.</div>
      <div className="tone-example">"Built in Austin. Built for all of Texas. Built to win."</div>
    </div>
    <div className="tone-card">
      <div className="tone-tag tone-dont">We're Not</div>
      <div className="tone-title">Sensationalist</div>
      <div className="tone-body">Bold is not the same as exaggerated. The facts are bad enough — we don't need to inflate them. Precision is more powerful than panic.</div>
      <div className="tone-example" style={parseStyle("color:#FF8060")}>❌ "EMERGENCY: Democracy COLLAPSING tonight!!!"</div>
    </div>
    <div className="tone-card">
      <div className="tone-tag tone-dont">We're Not</div>
      <div className="tone-title">Elitist or Exclusive</div>
      <div className="tone-body">Bold doesn't mean gatekept. The urgency of our voice should invite people in, not make them feel like they don't know enough to participate.</div>
      <div className="tone-example" style={parseStyle("color:#FF8060")}>❌ Insider jargon without context, unexplained acronyms</div>
    </div>
    <div className="tone-card">
      <div className="tone-tag tone-dont">We're Not</div>
      <div className="tone-title">Cynical or Nihilistic</div>
      <div className="tone-body">Urgency comes from believing change is possible. The Live Wire voice is high-energy because it believes in the work — not because it's performing outrage.</div>
      <div className="tone-example" style={parseStyle("color:#FF8060")}>❌ "Nothing ever changes, but you should still try..."</div>
    </div>
  </div>
</div>

{/* IMAGERY */}
<div className="section" style={parseStyle("padding-top:0")}>
  <div className="section-label" style={parseStyle("color:#FF4020")}>05 — Imagery Direction</div>
  <h2 className="section-title" style={parseStyle("font-family:'Bebas Neue',sans-serif;letter-spacing:0.04em")}>VISUAL LANGUAGE</h2>

  <div className="imagery-grid">
    <div className="imagery-card">
      <div className="imagery-thumb photo-thumb-7"></div>
      <div className="imagery-info"><div className="imagery-info-name">High Contrast</div><div className="imagery-info-desc">Graphic, high-contrast photography with strong silhouettes</div></div>
    </div>
    <div className="imagery-card">
      <div className="imagery-thumb photo-thumb-8"></div>
      <div className="imagery-info"><div className="imagery-info-name">Data as Art</div><div className="imagery-info-desc">Precinct maps, flow diagrams, vote matrices rendered as visuals</div></div>
    </div>
    <div className="imagery-card">
      <div className="imagery-thumb photo-thumb-9"></div>
      <div className="imagery-info"><div className="imagery-info-name">Editorial Typography</div><div className="imagery-info-desc">Type-as-image moments, numbers as heroes, key stats isolated</div></div>
    </div>
    <div className="imagery-card">
      <div className="imagery-thumb" style={parseStyle("background:#1a1a12")}></div>
      <div className="imagery-info"><div className="imagery-info-name">Moments of Action</div><div className="imagery-info-desc">Phone calls being made, canvassing, real campaign moments</div></div>
    </div>
  </div>

  <div className="do-dont-row">
    <div className="do-card" style={parseStyle("border-left-color:#FF4020;background:rgba(255,64,32,0.04)")}>
      <span className="label" style={parseStyle("color:#FF4020")}>Use</span>
      <div className="dd-item">Black and white photography with red or blue accents</div>
      <div className="dd-item">Data visualizations as hero graphics — maps, charts at scale</div>
      <div className="dd-item">Typography as image — key numbers, quotes, call-to-action text</div>
      <div className="dd-item">Gritty, real Texas organizing photography — no polish</div>
      <div className="dd-item">Duotone treatments (black + vermillion or black + blue)</div>
    </div>
    <div className="dont-card">
      <span className="label">Avoid</span>
      <div className="dd-item">Pastel or muted tones that soften the message</div>
      <div className="dd-item">Illustrated characters or cartoonish political graphics</div>
      <div className="dd-item">Gradients used decoratively (only for data encoding)</div>
      <div className="dd-item">Photography that feels polished, styled, or "branded"</div>
      <div className="dd-item">Anything that visually whispers when it should shout</div>
    </div>
  </div>
</div>

{/* COMPONENTS */}
<div className="section" style={parseStyle("padding-top:0")}>
  <div className="section-label" style={parseStyle("color:#FF4020")}>06 — UI Components</div>
  <h2 className="section-title" style={parseStyle("font-family:'Bebas Neue',sans-serif;letter-spacing:0.04em")}>SAMPLE INTERFACE ELEMENTS</h2>

  <div className="component-label-row">Buttons</div>
  <div className="component-row">
    <button style={parseStyle("padding:10px 22px;background:#FF4020;color:#0F0F0F;border:none;border-radius:4px;font-family:'Lato',sans-serif;font-weight:700;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer")}>CALL NOW</button>
    <button style={parseStyle("padding:10px 22px;background:transparent;color:#FF4020;border:2px solid #FF4020;border-radius:4px;font-family:'Lato',sans-serif;font-weight:700;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer")}>TRACK BILL</button>
    <button style={parseStyle("padding:10px 22px;background:#0040FF;color:#F9F9F7;border:none;border-radius:4px;font-family:'Lato',sans-serif;font-weight:700;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer")}>VIEW DATA</button>
    <button style={parseStyle("padding:10px 22px;background:transparent;color:rgba(249,249,247,0.5);border:1px solid rgba(249,249,247,0.2);border-radius:4px;font-family:'Lato',sans-serif;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer")}>LEARN MORE</button>
  </div>

  <div className="component-label-row" style={parseStyle("margin-top:1.5rem")}>Alert / Action Banner</div>
  <div style={parseStyle("border-left:4px solid #FF4020;padding:1.25rem 1.5rem;background:rgba(255,64,32,0.06);border-radius:0 6px 6px 0;margin-bottom:2rem;max-width:540px")}>
    <div style={parseStyle("font-family:'Space Mono',monospace;font-size:10px;color:#FF4020;letter-spacing:0.15em;margin-bottom:8px")}>⚡ ACTION NEEDED — EXPIRES FRI 5PM</div>
    <div style={parseStyle("font-family:'Bebas Neue',sans-serif;font-size:1.6rem;letter-spacing:0.04em;color:#F9F9F7;margin-bottom:8px")}>SB 42 GOES TO FLOOR VOTE FRIDAY</div>
    <p style={parseStyle("font-family:'Lato',sans-serif;font-size:14px;color:rgba(249,249,247,0.65);line-height:1.5;margin-bottom:14px")}>Your representative has not committed. 3-minute call. Here's the script.</p>
    <button style={parseStyle("padding:9px 20px;background:#FF4020;color:#0F0F0F;border:none;border-radius:4px;font-family:'Lato',sans-serif;font-weight:700;font-size:13px;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer")}>CALL YOUR REP NOW →</button>
  </div>
</div>
<div className="divider" style={parseStyle("margin:0 2rem")}></div>

</div>{/* end deck-3 */}
</div>{/* end panel-3 */}

{/* FOOTER */}
<div className="brand-footer">
  tx_spark brand guidelines · Austin, Texas · 2025 · Built by Texans for Texans
</div>
    </div>
  );
}
