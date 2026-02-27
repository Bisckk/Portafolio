"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import "./HeroBissck.css";

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

        // ── Cover Image Calculation (avoid distortion on mobile/different aspects) ──
        const imgW = imgBW.width;
        const imgH = imgBW.height;
        let scale, drawX, drawY;

        if (w < h) {
          // Vista Portrait (Móvil): Evitar el zoom extremo
          // Escalamos basándonos en el ancho pero con un multiplicador moderado
          scale = Math.max((w / imgW) * 1.8, (h / imgH) * 0.6);
          const drawW = imgW * scale;
          const drawH = imgH * scale;
          drawX = (w - drawW) / 2;
          drawY = h * 0.05; // Anclar más hacia arriba
        } else {
          // Vista Desktop: object-fit cover clásico
          scale = Math.max(w / imgW, h / imgH);
          const drawW = imgW * scale;
          const drawH = imgH * scale;
          drawX = (w - drawW) / 2;
          drawY = (h - drawH) / 2;
        }

        const drawW = imgW * scale;
        const drawH = imgH * scale;

        // ── Pre-rendered color image buffer to improve 60FPS performance ──
        if (!window.__colorBufCanvas) {
          window.__colorBufCanvas = document.createElement("canvas");
          window.__colorBufCtx = window.__colorBufCanvas.getContext("2d", { willReadFrequently: false });
          window.__lastW = 0;
          window.__lastH = 0;
        }
        const colorBufCanvas = window.__colorBufCanvas;
        const colorBufCtx = window.__colorBufCtx;

        if (w !== window.__lastW || h !== window.__lastH) {
          colorBufCanvas.width = w;
          colorBufCanvas.height = h;
          colorBufCtx.clearRect(0, 0, w, h);

          // A: Draw color image with boosted contrast & saturation
          colorBufCtx.filter = "contrast(1.3) saturate(1.8)";
          colorBufCtx.drawImage(imgColor, drawX, drawY, drawW, drawH);
          colorBufCtx.filter = "none";

          // B: Aggressive red boost — color-dodge (strong)
          colorBufCtx.save();
          colorBufCtx.globalAlpha = 0.35;
          colorBufCtx.globalCompositeOperation = "color-dodge";
          colorBufCtx.fillStyle = "#CC2200";
          colorBufCtx.fillRect(0, 0, w, h);
          colorBufCtx.restore();

          // C: Red overlay for intensity
          colorBufCtx.save();
          colorBufCtx.globalAlpha = 0.25;
          colorBufCtx.globalCompositeOperation = "overlay";
          colorBufCtx.fillStyle = "#DD1100";
          colorBufCtx.fillRect(0, 0, w, h);
          colorBufCtx.restore();

          // D: Extra warmth via soft-light (high)
          colorBufCtx.save();
          colorBufCtx.globalAlpha = 0.22;
          colorBufCtx.globalCompositeOperation = "soft-light";
          colorBufCtx.fillStyle = "#FF4400";
          colorBufCtx.fillRect(0, 0, w, h);
          colorBufCtx.restore();

          window.__lastW = w;
          window.__lastH = h;
        }

        // ═══ 1. B&W background (always drawn) ═══
        ctx.drawImage(imgBW, drawX, drawY, drawW, drawH);

        // ═══ 2. Soft reveal — color image with red boost ═══
        if (revealAlpha > 0.005 && smoothMouse.x > 0) {
          // Optimization: Only clear and redraw the bounding box of the reveal
          const r = REVEAL_RADIUS;
          const mx = smoothMouse.x;
          const my = smoothMouse.y;

          const boxX = Math.max(0, mx - r - 10);
          const boxY = Math.max(0, my - r - 10);
          const boxW = r * 2 + 20;
          const boxH = r * 2 + 20;

          revealCtx.clearRect(boxX, boxY, boxW, boxH);

          // Draw the smooth radial mask
          revealCtx.save();
          const grad = revealCtx.createRadialGradient(mx, my, 0, mx, my, r);
          const a = revealAlpha;
          grad.addColorStop(0, `rgba(255,255,255,${(a * 0.85).toFixed(3)})`);
          grad.addColorStop(0.25, `rgba(255,255,255,${(a * 0.7).toFixed(3)})`);
          grad.addColorStop(0.5, `rgba(255,255,255,${(a * 0.45).toFixed(3)})`);
          grad.addColorStop(0.7, `rgba(255,255,255,${(a * 0.2).toFixed(3)})`);
          grad.addColorStop(0.85, `rgba(255,255,255,${(a * 0.07).toFixed(3)})`);
          grad.addColorStop(1, "rgba(255,255,255,0)");

          revealCtx.fillStyle = grad;
          revealCtx.fillRect(boxX, boxY, boxW, boxH);

          // source-in: keeps the colorBuf ONLY where the mask was drawn
          revealCtx.globalCompositeOperation = "source-in";
          revealCtx.drawImage(colorBufCanvas, boxX, boxY, boxW, boxH, boxX, boxY, boxW, boxH);
          revealCtx.restore();

          // D: Composite onto main canvas in the restricted area
          ctx.drawImage(revealCanvas, boxX, boxY, boxW, boxH, boxX, boxY, boxW, boxH);
        }

        // ═══ 3. Vignette ═══
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, w, h);

        // ═══ 4. Bottom edge Blur / Fade ═══
        // Dinamically blend the bottom edge of the image to #080808 (var(--black))
        const imgBottom = drawY + drawH;
        // Empezamos a difuminar 150px antes del corte, y llega al 100% de intensidad justo en el corte
        const bottomFade = ctx.createLinearGradient(0, imgBottom - 150, 0, imgBottom);
        bottomFade.addColorStop(0, "rgba(8,8,8,0)");
        bottomFade.addColorStop(1, "rgba(8,8,8,1)");

        ctx.fillStyle = bottomFade;
        // Rellenamos desde donde empieza el difuminado hasta la parte inferior del canvas
        // Así aseguramos que si sobra canvas por debajo de la foto, quede totalmente negro
        ctx.fillRect(0, imgBottom - 150, w, h - (imgBottom - 150));

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
            <a
              href="#works"
              className="hero-cta"
              onClick={(e) => {
                e.preventDefault();
                window.dispatchEvent(new Event("open-works-modal"));
              }}
            >
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
