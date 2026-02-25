"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

function GlitchText({ text }) {
  return (
    <span className="glitch" data-text={text}>
      {text}
    </span>
  );
}

export default function HeroBissck() {
  const t = useTranslations("hero");
  const [mounted, setMounted] = useState(false);
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const mouseRef = useRef({ x: -999, y: -999 });
  const heroRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ── Canvas animation ──
  useEffect(() => {
    if (!mounted) return;

    const canvas = canvasRef.current;
    const hero = heroRef.current;
    if (!canvas || !hero) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: false });

    // ── Load images ──
    const imgBW = new Image();
    const imgColor = new Image();
    imgBW.src = "/Photoblack.png";
    imgColor.src = "/Photorojo.png";

    let imagesLoaded = 0;

    // ── Reveal config ──
    const REVEAL_RADIUS = 260;      // Larger soft reveal radius
    const MOUSE_LERP = 0.1;         // Smooth mouse follow speed

    // ── Offscreen canvas for the reveal mask ──
    const revealCanvas = document.createElement("canvas");
    const revealCtx = revealCanvas.getContext("2d");

    // ── Cache gradients ──
    let vigGrad = null;
    let fadeGrad = null;
    let cachedW = 0;
    let cachedH = 0;

    const buildGradients = (w, h) => {
      vigGrad = ctx.createRadialGradient(w / 2, h / 2, h * 0.15, w / 2, h / 2, h * 0.85);
      vigGrad.addColorStop(0, "rgba(8,8,8,0)");
      vigGrad.addColorStop(1, "rgba(8,8,8,0.65)");

      fadeGrad = ctx.createLinearGradient(0, h * 0.45, 0, h);
      fadeGrad.addColorStop(0, "rgba(8,8,8,0)");
      fadeGrad.addColorStop(1, "rgba(8,8,8,0.97)");

      revealCanvas.width = w;
      revealCanvas.height = h;

      cachedW = w;
      cachedH = h;
    };

    const resize = () => {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
      buildGradients(canvas.width, canvas.height);
    };

    const onImageLoad = () => {
      imagesLoaded++;
      if (imagesLoaded === 2) startAnimation();
    };

    imgBW.onload = onImageLoad;
    imgColor.onload = onImageLoad;

    // ── Smooth mouse ──
    const smoothMouse = { x: -999, y: -999 };
    // Reveal intensity (smooth fade in/out)
    let revealAlpha = 0;

    const onMouseMove = (e) => {
      const rect = hero.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const onMouseLeave = () => {
      mouseRef.current = { x: -999, y: -999 };
    };

    hero.addEventListener("mousemove", onMouseMove);
    hero.addEventListener("mouseleave", onMouseLeave);
    window.addEventListener("resize", resize);
    resize();

    const startAnimation = () => {
      const draw = () => {
        const w = canvas.width;
        const h = canvas.height;

        if (w !== cachedW || h !== cachedH) buildGradients(w, h);

        // ── Smooth mouse interpolation ──
        const { x: targetX, y: targetY } = mouseRef.current;
        const mouseActive = targetX > 0;

        if (mouseActive) {
          if (smoothMouse.x < 0) {
            // First frame with mouse — snap
            smoothMouse.x = targetX;
            smoothMouse.y = targetY;
          } else {
            smoothMouse.x += (targetX - smoothMouse.x) * MOUSE_LERP;
            smoothMouse.y += (targetY - smoothMouse.y) * MOUSE_LERP;
          }
          // Fade in reveal
          revealAlpha += (1 - revealAlpha) * 0.06;
        } else {
          // Fade out reveal smoothly
          revealAlpha *= 0.94;
          if (revealAlpha < 0.005) revealAlpha = 0;
        }

        ctx.clearRect(0, 0, w, h);

        // ═══ 1. B&W background (always drawn) ═══
        ctx.drawImage(imgBW, 0, 0, w, h);

        // ═══ 2. Soft reveal — color image with red boost ═══
        if (revealAlpha > 0.005 && smoothMouse.x > 0) {
          revealCtx.clearRect(0, 0, w, h);

          // A: Draw color image with boosted contrast & saturation
          revealCtx.filter = "contrast(1.3) saturate(1.8)";
          revealCtx.drawImage(imgColor, 0, 0, w, h);
          revealCtx.filter = "none";

          // B: Aggressive red boost — color-dodge (strong)
          revealCtx.save();
          revealCtx.globalAlpha = 0.35;
          revealCtx.globalCompositeOperation = "color-dodge";
          revealCtx.fillStyle = "#CC2200";
          revealCtx.fillRect(0, 0, w, h);
          revealCtx.restore();

          // C: Red overlay for intensity
          revealCtx.save();
          revealCtx.globalAlpha = 0.25;
          revealCtx.globalCompositeOperation = "overlay";
          revealCtx.fillStyle = "#DD1100";
          revealCtx.fillRect(0, 0, w, h);
          revealCtx.restore();

          // D: Extra warmth via soft-light (high)
          revealCtx.save();
          revealCtx.globalAlpha = 0.22;
          revealCtx.globalCompositeOperation = "soft-light";
          revealCtx.fillStyle = "#FF4400";
          revealCtx.fillRect(0, 0, w, h);
          revealCtx.restore();

          // C: Mask with a single soft radial gradient (destination-in)
          revealCtx.save();
          revealCtx.globalCompositeOperation = "destination-in";

          const r = REVEAL_RADIUS;
          const mx = smoothMouse.x;
          const my = smoothMouse.y;

          const grad = revealCtx.createRadialGradient(mx, my, 0, mx, my, r);
          // Very soft gradient — lots of stops for smooth falloff
          const a = revealAlpha;
          grad.addColorStop(0, `rgba(255,255,255,${(a * 0.85).toFixed(3)})`);
          grad.addColorStop(0.25, `rgba(255,255,255,${(a * 0.7).toFixed(3)})`);
          grad.addColorStop(0.5, `rgba(255,255,255,${(a * 0.45).toFixed(3)})`);
          grad.addColorStop(0.7, `rgba(255,255,255,${(a * 0.2).toFixed(3)})`);
          grad.addColorStop(0.85, `rgba(255,255,255,${(a * 0.07).toFixed(3)})`);
          grad.addColorStop(1, "rgba(255,255,255,0)");

          revealCtx.fillStyle = grad;
          revealCtx.fillRect(mx - r, my - r, r * 2, r * 2);

          revealCtx.restore();

          // D: Composite onto main canvas
          ctx.drawImage(revealCanvas, 0, 0);
        }

        // ═══ 3. Vignette ═══
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, w, h);

        // ═══ 4. Bottom fade ═══
        ctx.fillStyle = fadeGrad;
        ctx.fillRect(0, 0, w, h);

        animRef.current = requestAnimationFrame(draw);
      };
      draw();
    };

    return () => {
      hero.removeEventListener("mousemove", onMouseMove);
      hero.removeEventListener("mouseleave", onMouseLeave);
      window.removeEventListener("resize", resize);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [mounted]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Space+Mono&display=swap');

        :root {
          --red:     #CC2200;
          --red-dim: #7a1500;
          --black:   #080808;
          --white:   #f0ede8;
        }

        /* ── Hero ── */
        .hero {
          position: relative;
          width: 100%;
          min-height: 100svh;
          background: var(--black);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          overflow: hidden;
          font-family: 'Space Mono', monospace;
        }

        .hero-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;
          display: block;
        }

        .hero-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
          opacity: 0.22;
          z-index: 2;
          pointer-events: none;
          mix-blend-mode: overlay;
        }

        /* ── Content ── */
        .hero-content {
          position: relative;
          z-index: 10;
          padding: clamp(2rem, 6vw, 5rem);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          max-width: 1400px;
          width: 100%;
        }

        .hero-tag {
          font-size: clamp(0.6rem, 1.2vw, 0.8rem);
          letter-spacing: 0.35em;
          text-transform: uppercase;
          color: var(--red);
          opacity: 0;
          animation: fadeUp 0.8s ease 0.2s forwards;
        }

        .hero-heading {
          font-family: 'Unbounded', sans-serif;
          font-weight: 900;
          font-size: clamp(3.5rem, 11vw, 10rem);
          line-height: 0.9;
          color: var(--white);
          text-transform: uppercase;
          letter-spacing: -0.02em;
          opacity: 0;
          animation: fadeUp 0.9s ease 0.4s forwards;
        }

        .glitch { position: relative; display: inline-block; }
        .glitch::before, .glitch::after {
          content: attr(data-text);
          position: absolute; top: 0; left: 0;
          width: 100%; height: 100%;
        }
        .glitch::before {
          color: var(--red);
          clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%);
          animation: glitch1 5s infinite step-start;
        }
        .glitch::after {
          color: #00e5ff;
          clip-path: polygon(0 65%, 100% 65%, 100% 100%, 0 100%);
          animation: glitch2 5s infinite step-start;
        }
        @keyframes glitch1 {
          0%,90%,100% { transform:translate(0);opacity:0; }
          92% { transform:translate(-4px,2px);opacity:.8; }
          94% { transform:translate(4px,-2px);opacity:.8; }
          96% { transform:translate(0);opacity:0; }
        }
        @keyframes glitch2 {
          0%,90%,100% { transform:translate(0);opacity:0; }
          93% { transform:translate(4px,-2px);opacity:.7; }
          95% { transform:translate(-4px,2px);opacity:.7; }
          97% { transform:translate(0);opacity:0; }
        }

        .hero-sub {
          display: flex; align-items: center; gap: 2rem;
          opacity: 0; animation: fadeUp 0.9s ease 0.65s forwards;
          flex-wrap: wrap;
        }
        .hero-sub p {
          font-size: clamp(0.75rem, 1.4vw, 0.9rem);
          color: rgba(240,237,232,0.45);
          max-width: 36ch; line-height: 1.7;
        }
        .hero-divider { width:1px; height:3rem; background:var(--red-dim); flex-shrink:0; }

        .hero-cta {
          display: inline-flex; align-items: center; gap: 0.75rem;
          padding: 0.9rem 2rem;
          border: 1px solid var(--red);
          color: var(--white);
          font-family: 'Space Mono', monospace;
          font-size: 0.75rem; letter-spacing: 0.2em; text-transform: uppercase;
          text-decoration: none; position: relative; overflow: hidden;
          transition: color 0.3s ease; background: transparent;
        }
        .hero-cta::before {
          content:''; position:absolute; inset:0;
          background:var(--red); transform:translateX(-101%);
          transition:transform 0.35s cubic-bezier(0.77,0,0.18,1);
        }
        .hero-cta:hover::before { transform:translateX(0); }
        .hero-cta span, .hero-cta .arrow { position:relative; z-index:1; }
        .hero-cta .arrow { transition:transform 0.3s ease; }
        .hero-cta:hover .arrow { transform:translateX(4px); }

        .hero-stats {
          display:flex; gap:clamp(2rem,5vw,5rem);
          opacity:0; animation:fadeUp 0.9s ease 0.85s forwards;
          padding-top:0.5rem;
          border-top:1px solid rgba(204,34,0,0.15);
        }
        .stat-number {
          font-family:'Unbounded',sans-serif;
          font-size:clamp(1.4rem,3vw,2.2rem);
          font-weight:700; color:var(--white); line-height:1;
        }
        .stat-label {
          font-size:0.65rem; letter-spacing:0.2em;
          text-transform:uppercase; color:var(--red); margin-top:0.3rem;
        }

        .scroll-hint {
          position:absolute; bottom:2.5rem; right:clamp(2rem,5vw,4rem);
          z-index:10; display:flex; flex-direction:column;
          align-items:center; gap:0.5rem;
          opacity:0; animation:fadeIn 1s ease 1.2s forwards;
        }
        .scroll-hint span {
          font-size:0.6rem; letter-spacing:0.25em;
          text-transform:uppercase; color:rgba(240,237,232,0.3);
          writing-mode:vertical-rl;
        }
        .scroll-line {
          width:1px; height:3rem;
          background:linear-gradient(to bottom,var(--red),transparent);
          animation:scrollPulse 2s ease-in-out infinite;
        }
        @keyframes scrollPulse { 0%,100%{opacity:.3} 50%{opacity:1} }

        .accent-line {
          position:absolute; top:0; left:0;
          width:100%; height:2px;
          background:linear-gradient(to right,var(--red),transparent 60%);
          z-index:10;
        }

        .mouse-hint {
          position:absolute; top:2rem; right:clamp(2rem,5vw,4rem);
          z-index:10; font-size:0.6rem; letter-spacing:0.2em;
          text-transform:uppercase; color:rgba(240,237,232,0.2);
          opacity:0; animation:fadeIn 1s ease 1.8s forwards;
        }

        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity:0; } to { opacity:1; }
        }
      `}</style>

      <section id="hero" className="hero" ref={heroRef}>
        {mounted && <canvas className="hero-canvas" ref={canvasRef} />}

        <div className="hero-grain" />
        <div className="accent-line" />
        <p className="mouse-hint">{t("mouse_hint")}</p>

        <div className="hero-content">
          <p className="hero-tag">{t("tag")}</p>

          <h1 className="hero-heading">
            <GlitchText text="Bissck" />
          </h1>

          <div className="hero-sub">
            <p>{t("description")}</p>
            <div className="hero-divider" />
            <a href="#projects" className="hero-cta">
              <span>{t("cta_projects")}</span>
              <span className="arrow">→</span>
            </a>
          </div>

          <div className="hero-stats">
            <div>
              <div className="stat-number">12+</div>
              <div className="stat-label">{t("stat_projects")}</div>
            </div>
            <div>
              <div className="stat-number">3</div>
              <div className="stat-label">{t("stat_years")}</div>
            </div>
            <div>
              <div className="stat-number">∞</div>
              <div className="stat-label">{t("stat_caffeine")}</div>
            </div>
          </div>
        </div>

        <div className="scroll-hint">
          <div className="scroll-line" />
          <span>{t("scroll_hint")}</span>
        </div>
      </section>
    </>
  );
}
