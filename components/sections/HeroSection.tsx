"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import * as THREE from "three";
import { scrollTo } from "@/hooks/useLenis";
import { Download, ChevronDown } from "lucide-react";

// ── Shared Utility for Mouse Position ──────────────────────────────────────────
function useMousePosition() {
    const mouse = useRef({ x: 0, y: 0 });
    const smoothMouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return { mouse, smoothMouse };
}

// ── Starfield Canvas ─────────────────────────────────────────────────────────
function StarfieldCanvas({ mouseRef, smoothMouseRef }: { mouseRef: React.MutableRefObject<{ x: number, y: number }>, smoothMouseRef: React.MutableRefObject<{ x: number, y: number }> }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
        renderer.setClearColor(0x000000, 0); // Transparent background
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);

        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
        camera.position.z = 30;

        const scene = new THREE.Scene();

        // Increase particle count for a denser "stardust" feel
        const count = 3000;
        const positions = new Float32Array(count * 3);
        const velocities = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        // Add color array for varied stars
        const colors = new Float32Array(count * 3);

        // Color palette mimicking the title's gradient (#c585eb, #a855f7, #e879f9)
        const palette = [
            new THREE.Color("#c585eb"),
            new THREE.Color("#a855f7"),
            new THREE.Color("#e879f9"),
            new THREE.Color("#c585eb")
        ];

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;
            // Spread across the viewable frustum
            positions[i3] = THREE.MathUtils.randFloatSpread(100);
            positions[i3 + 1] = THREE.MathUtils.randFloatSpread(60);
            positions[i3 + 2] = THREE.MathUtils.randFloatSpread(20) - 5; // Slight depth

            // Very slow drift
            velocities[i3] = (Math.random() - 0.5) * 0.001;
            velocities[i3 + 1] = (Math.random() - 0.5) * 0.001;
            velocities[i3 + 2] = 0;

            // Varied sizes for depth perception
            if (Math.random() < 0.8) {
                sizes[i] = 0.5 + Math.random() * 1.5;
            } else {
                sizes[i] = 2.0 + Math.random() * 2.0; // occasional larger "stars"
            }

            // Assign random color from palette (mostly whites)
            const color = Math.random() < 0.8 ? palette[0] : palette[Math.floor(Math.random() * palette.length)];
            colors[i3] = color.r;
            colors[i3 + 1] = color.g;
            colors[i3 + 2] = color.b;
        }

        const basePositions = positions.slice() as Float32Array;

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

        // Create a softer circular sprite
        const spriteCanvas = document.createElement("canvas");
        spriteCanvas.width = 64;
        spriteCanvas.height = 64;
        const ctx = spriteCanvas.getContext("2d");
        if (ctx) {
            const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
            g.addColorStop(0, "rgba(255,255,255,1)");
            g.addColorStop(0.2, "rgba(255,255,255,0.8)");
            g.addColorStop(0.5, "rgba(255,255,255,0.2)");
            g.addColorStop(1, "rgba(255,255,255,0)");
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, 64, 64);
        }
        const sprite = new THREE.CanvasTexture(spriteCanvas);
        sprite.colorSpace = THREE.SRGBColorSpace;

        const material = new THREE.PointsMaterial({
            map: sprite,
            vertexColors: true,
            size: 0.25,
            sizeAttenuation: true,
            transparent: true,
            opacity: 0.8,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        const onResize = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
        };
        window.addEventListener("resize", onResize);

        let animId: number;
        const clock = new THREE.Clock();
        const animate = () => {
            animId = requestAnimationFrame(animate);
            const t = clock.getElapsedTime();

            // Smooth mouse interpolation
            smoothMouseRef.current.x += (mouseRef.current.x - smoothMouseRef.current.x) * 0.04;
            smoothMouseRef.current.y += (mouseRef.current.y - smoothMouseRef.current.y) * 0.04;

            const worldMX = smoothMouseRef.current.x * 50;
            const worldMY = smoothMouseRef.current.y * 30;
            const repelRadiusPx = 120;
            const radiusWorld = repelRadiusPx * Math.min(100 / window.innerWidth, 60 / window.innerHeight);
            const radius2 = radiusWorld * radiusWorld;

            for (let i = 0; i < count; i++) {
                const i3 = i * 3;

                positions[i3] += velocities[i3];
                positions[i3 + 1] += velocities[i3 + 1];

                // Spring back to base
                positions[i3] += (basePositions[i3] - positions[i3]) * 0.001;
                positions[i3 + 1] += (basePositions[i3 + 1] - positions[i3 + 1]) * 0.001;

                // Mouse repel logic
                const dx = positions[i3] - worldMX;
                const dy = positions[i3 + 1] - worldMY;
                const dist2 = dx * dx + dy * dy;
                if (dist2 < radius2) {
                    const dist = Math.sqrt(dist2) + 1e-6;
                    const falloff = 1 - dist / radiusWorld;
                    const influence = 0.25 * falloff * falloff;
                    positions[i3] += (dx / dist) * influence;
                    positions[i3 + 1] += (dy / dist) * influence;
                }

                // Wrap around edges to create infinite flow
                if (positions[i3] > 50) positions[i3] = -50;
                else if (positions[i3] < -50) positions[i3] = 50;

                if (positions[i3 + 1] > 30) positions[i3 + 1] = -30;
                else if (positions[i3 + 1] < -30) positions[i3 + 1] = 30;
            }
            (geometry.getAttribute("position") as THREE.BufferAttribute).needsUpdate = true;

            // Subtle camera breathing
            camera.position.x = Math.sin(t * 0.15) * 0.5 + smoothMouseRef.current.x * 2;
            camera.position.y = Math.cos(t * 0.1) * 0.5 + smoothMouseRef.current.y * 2;
            camera.lookAt(0, 0, 0);

            // Pulse opacity slightly
            material.opacity = 0.7 + Math.sin(t * 0.5) * 0.15;

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", onResize);
            geometry.dispose();
            material.dispose();
            sprite.dispose();
            renderer.dispose();
        };
    }, [mouseRef, smoothMouseRef]);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
            aria-hidden="true"
        />
    );
}

// ── Background Ambient Glow (Antigravity Style) ──────────────────────────────
function AmbientGlow({ smoothMouseRef }: { smoothMouseRef: React.MutableRefObject<{ x: number, y: number }> }) {
    const glowRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let animId: number;
        const updateGlow = () => {
            if (glowRef.current) {
                // Translate mouse coordinates (-1 to 1) to percentages (0% to 100%)
                const xPct = (smoothMouseRef.current.x + 1) * 50;
                // Y is inverted in our mouse hook, so we invert it back
                const yPct = (-smoothMouseRef.current.y + 1) * 50;

                // Smoothly move the background radial gradient
                glowRef.current.style.background = `radial-gradient(circle at ${xPct}% ${yPct}%, rgba(197, 133, 235, 0.15) 0%, rgba(168, 85, 247, 0.05) 35%, rgba(6, 8, 16, 0) 70%)`;
            }
            animId = requestAnimationFrame(updateGlow);
        };
        updateGlow();

        return () => cancelAnimationFrame(animId);
    }, [smoothMouseRef]);

    return (
        <div
            ref={glowRef}
            className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000 hidden dark:block"
            style={{
                background: "radial-gradient(circle at 50% 50%, rgba(197, 133, 235, 0.15) 0%, rgba(168, 85, 247, 0.05) 35%, rgba(6, 8, 16, 0) 70%)"
            }}
        />
    );
}

// ── Hero Text ───────────────────────────────────────────────────────────────
function HeroText({ t }: { t: (key: string) => string }) {
    const containerRef = useRef<HTMLDivElement>(null);
    const roleRef = useRef<HTMLParagraphElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const subtitleRef = useRef<HTMLSpanElement>(null);
    const btnsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const animate = async () => {
            const { gsap } = await import("@/lib/gsap-config");

            // Antigravity cinematic blur-in effect
            const tl = gsap.timeline({ defaults: { ease: "power4.out" }, delay: 0.2 });

            // Reset opacity immediately in case of remounts
            gsap.set([roleRef.current, titleRef.current, subtitleRef.current, btnsRef.current], {
                opacity: 0,
                y: 40,
                scale: 0.95,
                filter: "blur(10px)"
            });

            tl
                .to(roleRef.current, {
                    y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2
                })
                .to(titleRef.current, {
                    y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.5
                }, "-=1.0")
                .to(subtitleRef.current, {
                    y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.2
                }, "-=1.1")
                .to(btnsRef.current, {
                    y: 0, opacity: 1, scale: 1, filter: "blur(0px)", duration: 1.0
                }, "-=0.9");
        };
        animate();
    }, []);

    const handleAbout = () => {
        const el = document.getElementById("about");
        if (el) scrollTo(el);
    };

    return (
        <div ref={containerRef} className="relative z-20 flex flex-col items-center justify-center
      min-h-screen text-center px-4 pt-20">
            <p ref={roleRef}
                className="mb-6 text-sm sm:text-lg uppercase tracking-[0.4em] text-[#c585eb] font-semibold opacity-0">
                {t("role")}
            </p>

            <h1 ref={titleRef}
                className="text-[14vw] sm:text-7xl lg:text-8xl xl:text-9xl font-extrabold tracking-tighter opacity-0 leading-[1.05] drop-shadow-2xl break-words w-full px-2">
                <span className="animated-gradient-text">{t("name")}</span>
            </h1>

            <span ref={subtitleRef}
                className="mt-6 md:mt-8 text-lg sm:text-xl text-gray-600 dark:text-white/60 max-w-2xl font-light leading-relaxed opacity-0 block">
                React · Next.js · Three.js · GSAP
            </span>

            <div ref={btnsRef} className="mt-12 flex flex-col sm:flex-row gap-5 opacity-0 w-full sm:w-auto px-4">
                <button onClick={handleAbout}
                    className="hero-glass-btn-primary group relative px-10 py-4 rounded-full font-semibold text-sm transition-all duration-500 overflow-hidden w-full sm:w-auto flex justify-center items-center">
                    <span className="relative z-10">{t("cta_primary")}</span>
                    {/* Hover glow injected via CSS */}
                </button>
                <a href="/cv-bismarck.pdf" download
                    className="hero-glass-btn-secondary group relative px-10 py-4 rounded-full font-semibold text-sm flex items-center justify-center gap-3 transition-all duration-500 overflow-hidden w-full sm:w-auto">
                    <Download size={16} className="relative z-10 group-hover:-translate-y-1 transition-transform duration-300" />
                    <span className="relative z-10">{t("cta_secondary")}</span>
                </a>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col
        items-center gap-2 text-gray-900/30 dark:text-white/30 animate-bounce pointer-events-none z-20">
                <span className="text-[10px] tracking-widest uppercase font-medium">{t("scroll_hint")}</span>
                <ChevronDown size={14} className="opacity-50" />
            </div>
        </div>
    );
}

// ── Hero Section ──────────────────────────────────────────────────────────
export function HeroSection() {
    const t = useTranslations("hero");
    const { resolvedTheme } = useTheme();
    // Defaulting to dark as standard for this aesthetic
    const isDark = resolvedTheme !== "light";

    const { mouse, smoothMouse } = useMousePosition();

    return (
        <section id="hero"
            className="relative min-h-screen overflow-hidden bg-white dark:bg-[#060810] selection:bg-[#c585eb]/30">
            {/* Deep background glow */}
            <AmbientGlow smoothMouseRef={smoothMouse} />

            {/* Particle Canvas */}
            <StarfieldCanvas key={isDark ? "dark" : "light"} mouseRef={mouse} smoothMouseRef={smoothMouse} />

            {/* Foreground Content */}
            <HeroText t={t} />
        </section>
    );
}
