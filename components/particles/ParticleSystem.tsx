/**
 * ParticleSystem.tsx
 *
 * Pure Three.js WebGL renderer for the interactive particle effect.
 * All heavy lifting lives here: ShaderMaterial, BufferGeometry,
 * animation loop, resize observer, and cleanup.
 *
 * Props:
 *   positions  — { random, target, count } from useParticles
 *   hover      — whether the parent container is hovered
 *   isDark     — drives particle colour via uDarkMode uniform
 *   color      — optional override hex colour string (e.g. "#ffffffff")
 */

"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { type ParticlePositions } from "@/hooks/useParticles";

// ─── GLSL Shaders ─────────────────────────────────────────────────────────────

const VERTEX_SHADER = /* glsl */ `
  // Per-particle attributes (computed once, stored in BufferGeometry)
  attribute vec3  aRandom;   // dispersed position
  attribute vec3  aTarget;   // shape position
  attribute float aSize;     // base point size
  attribute float aSpeed;    // individual lerp speed offset

  // Uniforms
  uniform float uProgress;   // 0 = dispersed, 1 = formed
  uniform float uTime;       // elapsed time for organic motion
  uniform float uPixelRatio; // for consistent point size across displays

  varying float vAlpha;

  void main() {
    // ── 1. Dispersed Drift (Organic floating) ──
    float t = uTime * 0.35 + aSpeed * 6.283;
    vec3 driftDispersed = vec3(
      sin(t * 1.1 + aRandom.y * 3.7) * 0.035,
      cos(t * 0.9 + aRandom.x * 2.9) * 0.028,
      sin(t * 0.7 + aRandom.z * 4.1) * 0.01
    );

    // ── 2. Formed Drift (Breathing / "Alive" shape) ──
    // Slower, subtle movement to keep the shape "alive"
    float t2 = uTime * 0.6 + aSpeed * 4.0;
    vec3 driftFormed = vec3(
      sin(t2 * 1.5 + aRandom.y * 2.2) * 0.012,
      cos(t2 * 1.3 + aRandom.x * 1.9) * 0.012,
      0.0
    );

    // ── 3. Interpolation ──
    float p = smoothstep(0.0, 1.0, uProgress);

    // ── 4. Target Jitter (Elegant scattering / "Cloud" effect) ──
    // Use high frequency noise to scatter particles around the target shape
    // This creates the "volume" look instead of thin lines
    float noiseX = sin(aRandom.x * 123.456 + aRandom.y * 789.012);
    float noiseY = cos(aRandom.y * 321.654 + aRandom.z * 987.321);
    
    // Disperse more widely (0.12 range) but keep density near center
    // Using cubic falloff (pow 3) to concentrate particles near the line
    // ADJUST THIS VALUE: 0.0002 controls the thickness of the line (smaller = finer)
    float scatter = 0.01 * (1.0 - p * 0.5); 
    vec3 jitter = vec3(
      noiseX * scatter,
      noiseY * scatter,
      0.0
    );

    // ── 4. Interpolation ──
    // float p = smoothstep(0.0, 1.0, uProgress); // Already defined above
    
    // Mix the base positions: Random -> (Target + Jitter)
    // We add jitter to target to make it "fuzzy"
    vec3 finalTarget = aTarget + jitter;
    
    // ── 5. Movement Logic ──
    // When dispersed (p=0): Use pure random drift
    // When formed (p=1): Use formed drift around the target shape
    
    vec3 basePos = mix(aRandom, finalTarget, p);
    vec3 currentDrift = mix(driftDispersed, driftFormed, p);

    // Combine
    vec3 pos = basePos + currentDrift;
    
    // Remove scaling to avoid clipping particles outside the camera frustum ([-1, 1])
    // pos *= 1.15;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);

    // Static small size, but ensured visibility (2.0 - 3.0px)
    // Slightly larger when forming the shape to ensure the line is visible
    gl_PointSize = aSize * uPixelRatio * (1.0 + p * 0.2);

    // Fade alpha: disperse = dim, formed = bright but slightly transparent for layering
    // Increase base visibility when dispersed to ensure they are seen
    vAlpha = mix(0.4, 0.9, p);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform float uDarkMode; // 1.0 = dark, 0.0 = light
  uniform vec3  uColor;    // base particle colour

  varying float vAlpha;

  void main() {
    // Soft circle
    vec2  center = gl_PointCoord - vec2(0.5);
    float dist   = length(center);
    float alpha  = 1.0 - smoothstep(0.35, 0.5, dist);
    if (alpha < 0.01) discard;

    // Colour is configurable, modulated by dark/light mode
    vec3 lightColor = mix(uColor, vec3(0.1, 0.1, 0.15), 0.3);
    vec3 col = mix(lightColor, uColor, uDarkMode);

    gl_FragColor = vec4(col, alpha * vAlpha);
  }
`;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert a CSS hex string like "#3b82f6" to a THREE.Color. */
function hexToColor(hex: string): THREE.Color {
    return new THREE.Color(hex);
}

// ─── Component ────────────────────────────────────────────────────────────────

interface ParticleSystemProps {
    positions: ParticlePositions;
    hover: boolean;
    isDark: boolean;
    color?: string; // hex, default "#3b82f6" (blue)
    speedIn?: number; // speed when forming (0.0 - 1.0), default 0.06
    speedOut?: number; // speed when dispersing (0.0 - 1.0), default 0.04
}

export function ParticleSystem({
    positions,
    hover,
    isDark,
    color = "#3b82f6",
    speedIn = 0.06,
    speedOut = 0.04,
}: ParticleSystemProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const { random, target, count } = positions;

        // ── Renderer ──
        const renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: false,
            alpha: true,            // transparent background
        });
        renderer.setClearColor(0x000000, 0);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // ── Camera — orthographic, dynamically adjusted ──
        const getAspect = () => canvas.offsetWidth / (canvas.offsetHeight || 1);
        const makeCamera = () => {
            const a = getAspect();
            return new THREE.OrthographicCamera(-a, a, 1, -1, 0.1, 10);
        };
        const camera = makeCamera();
        camera.position.z = 5;

        const scene = new THREE.Scene();

        // ── Per-particle random attributes ──
        const aRandomAttr = new Float32Array(count * 3);
        const aSizeAttr = new Float32Array(count);
        const aSpeedAttr = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            // Copy the pre-calculated random positions
            aRandomAttr[i * 3] = random[i * 3];
            aRandomAttr[i * 3 + 1] = random[i * 3 + 1];
            aRandomAttr[i * 3 + 2] = random[i * 3 + 2];

            aSizeAttr[i] = 2.0 + Math.random() * 1.5; // Small constant size (2.0 - 3.5px)
            aSpeedAttr[i] = Math.random();
        }

        // ── BufferGeometry — built once ──
        const geometry = new THREE.BufferGeometry();
        // Three.js uses "position" for gl_Position base; we start at random
        geometry.setAttribute("position", new THREE.BufferAttribute(aRandomAttr.slice(), 3));
        geometry.setAttribute("aRandom", new THREE.BufferAttribute(aRandomAttr, 3));
        geometry.setAttribute("aTarget", new THREE.BufferAttribute(target, 3));
        geometry.setAttribute("aSize", new THREE.BufferAttribute(aSizeAttr, 1));
        geometry.setAttribute("aSpeed", new THREE.BufferAttribute(aSpeedAttr, 1));

        // ── ShaderMaterial ──
        const material = new THREE.ShaderMaterial({
            vertexShader: VERTEX_SHADER,
            fragmentShader: FRAGMENT_SHADER,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uProgress: { value: 0 },
                uTime: { value: 0 },
                uPixelRatio: { value: renderer.getPixelRatio() },
                uDarkMode: { value: isDark ? 1.0 : 0.0 },
                uColor: { value: hexToColor(color) },
            },
        });

        const points = new THREE.Points(geometry, material);
        scene.add(points);

        // ── Size the canvas to its CSS container ──
        const sync = () => {
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight || 1;
            renderer.setSize(w, h, false);

            const a = w / h;
            camera.left = -a;
            camera.right = a;
            camera.top = 1;
            camera.bottom = -1;
            camera.updateProjectionMatrix();
        };
        sync();

        const ro = new ResizeObserver(sync);
        ro.observe(canvas);

        // ── Animation loop ──
        let animId: number;
        let currentProgress = 0;

        const animate = () => {
            animId = requestAnimationFrame(animate);

            // Read the latest hover value from a ref (avoids stale closure)
            const targetP = hoverRef.current ? 1.0 : 0.0;
            // Speed: fast forward (0.06), slower in reverse (0.04) — feels more natural
            const sIn = speedInRef.current;
            const sOut = speedOutRef.current;
            const lerpSpeed = targetP > currentProgress ? sIn : sOut;
            currentProgress += (targetP - currentProgress) * lerpSpeed;

            material.uniforms.uProgress.value = currentProgress;
            material.uniforms.uTime.value += 0.016;
            material.uniforms.uDarkMode.value = darkRef.current ? 1.0 : 0.0;
            material.uniforms.uColor.value = hexToColor(colorRef.current);

            renderer.render(scene, camera);
        };
        animate();

        // ── Cleanup ──
        return () => {
            cancelAnimationFrame(animId);
            ro.disconnect();
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [positions]); // Only rebuild when positions change (new SVG)

    // Refs to keep the animation loop in sync without a full re-render
    const hoverRef = useRef(hover);
    const darkRef = useRef(isDark);
    const colorRef = useRef(color);
    const speedInRef = useRef(speedIn);
    const speedOutRef = useRef(speedOut);

    // Update refs on every render instead of rebuilding the renderer
    hoverRef.current = hover;
    darkRef.current = isDark;
    colorRef.current = color;
    speedInRef.current = speedIn;
    speedOutRef.current = speedOut;

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none"
            aria-hidden="true"
        />
    );
}
