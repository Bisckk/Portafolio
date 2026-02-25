/**
 * useParticles.ts
 *
 * Manages particle positions for the HeroParticles system:
 *  - randomPositions: dispersed initial state
 *  - targetPositions: sampled from a shape file (SVG or PNG)
 *
 * PNG sampling uses luminance-edge detection (works on white-bg / black-shape PNGs).
 * SVG sampling uses browser getTotalLength / getPointAtLength APIs.
 *
 * Both return Float32Array [x,y,z, x,y,z, …] normalised to [-1, 1].
 */

import { useEffect, useRef, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
export interface ParticlePositions {
    random: Float32Array; // flat [x,y,z] triples — dispersed starting positions
    target: Float32Array; // flat [x,y,z] triples — shape edge positions
    count: number;
}

// ─── Random positions ────────────────────────────────────────────────────────
function createRandomPositions(count: number, spread = 2.2): Float32Array {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        arr[i * 3] = (Math.random() - 0.5) * spread * 2;
        arr[i * 3 + 1] = (Math.random() - 0.5) * spread * 2;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 0.4;
    }
    return arr;
}

// ─── PNG Edge Detection ───────────────────────────────────────────────────────
/**
 * Loads a PNG (white bg, dark shapes) into an offscreen canvas,
 * detects edge pixels by luminance contrast with their neighbours,
 * and returns `count` positions sampled uniformly from those edges.
 *
 * "Edge pixel" = dark pixel (luminance < darkThreshold)
 *                that has at least one bright neighbour (luminance > brightThreshold).
 */
async function samplePNGEdges(
    pngUrl: string,
    count: number,
    darkThreshold: number = 80,   // 0-255: pixels darker than this are "shape"
    brightThreshold: number = 200, // 0-255: neighbours brighter than this are "background"
): Promise<Float32Array> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
            // Scale down for performance — we only need enough pixels to sample from.
            // Working at 300×300 still gives plenty of edge pixels.
            const MAX = 400;
            const scale = Math.min(1, MAX / Math.max(img.width, img.height));
            const w = Math.round(img.width * scale);
            const h = Math.round(img.height * scale);

            const canvas = document.createElement("canvas");
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext("2d")!;
            ctx.drawImage(img, 0, 0, w, h);

            const { data } = ctx.getImageData(0, 0, w, h);

            // Luminance helper
            const lum = (idx: number) =>
                0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
            
            // Helper to check if a pixel is effectively part of the shape
            // (Opaque AND Dark) OR (Opaque AND Light if inverted)
            // Here we assume shape is dark on light, OR opaque on transparent.
            const isShape = (idx: number) => {
                const a = data[idx + 3];
                const l = lum(idx);
                // If alpha is high (>100) AND luminance is low (<darkThreshold) -> It's a dark shape pixel
                // OR if alpha is high (>100) AND image has transparency (we assume shape is the opaque part)
                // Let's rely on alpha first if available.
                return a > 100 && l < darkThreshold;
            };

            // Collect edge pixel positions in image space
            const edgeX: number[] = [];
            const edgeY: number[] = [];

            for (let y = 1; y < h - 1; y++) {
                for (let x = 1; x < w - 1; x++) {
                    const idx = (y * w + x) * 4;
                    
                    // Optimization: Only check boundaries of "shape" pixels
                    // But we want the EDGE. So if I am a shape pixel, and one of my neighbors is NOT, I am an edge.
                    // Or if I am NOT a shape pixel, and one of my neighbors IS, I am next to an edge.
                    
                    // Let's stick to: If I am a shape pixel...
                    if (!isShape(idx)) continue; 

                    // Check 4-connectivity neighbours
                    const top = ((y - 1) * w + x) * 4;
                    const bottom = ((y + 1) * w + x) * 4;
                    const left = (y * w + (x - 1)) * 4;
                    const right = (y * w + (x + 1)) * 4;

                    // If any neighbour is NOT a shape pixel, then I am on the edge.
                    if (
                        !isShape(top) || !isShape(bottom) ||
                        !isShape(left) || !isShape(right)
                    ) {
                        edgeX.push(x);
                        edgeY.push(y);
                    }
                }
            }

            // Fallback for transparent images where maybe darkThreshold was too strict?
            // If we found NO edges, maybe the shape is light-colored on transparent?
            if (edgeX.length === 0) {
                 for (let y = 1; y < h - 1; y++) {
                    for (let x = 1; x < w - 1; x++) {
                        const idx = (y * w + x) * 4;
                        // Just check alpha
                        if (data[idx+3] < 100) continue; 
                        
                        // Check neighbors alpha
                        const top = data[((y - 1) * w + x) * 4 + 3];
                        const bottom = data[((y + 1) * w + x) * 4 + 3];
                        const left = data[(y * w + (x - 1)) * 4 + 3];
                        const right = data[(y * w + (x + 1)) * 4 + 3];
                        
                        if (top < 100 || bottom < 100 || left < 100 || right < 100) {
                             edgeX.push(x);
                             edgeY.push(y);
                        }
                    }
                }
            }

            if (edgeX.length === 0) {
                // Fallback: use ALL dark pixels (no clear edge — threshold might be off)
                for (let y = 0; y < h; y++) {
                    for (let x = 0; x < w; x++) {
                        if (lum((y * w + x) * 4) < darkThreshold) {
                            edgeX.push(x);
                            edgeY.push(y);
                        }
                    }
                }
            }

            // Sample `count` points uniformly from the edge pixel pool
            const positions = new Float32Array(count * 3);
            const total = edgeX.length;

            for (let i = 0; i < count; i++) {
                // Round-robin sampling for uniform distribution
                const idx = Math.floor((i / count) * total);

                // Normalize to [-1, 1], flip Y for WebGL
                positions[i * 3] = (edgeX[idx] / w) * 2 - 1;
                positions[i * 3 + 1] = -(((edgeY[idx] / h) * 2) - 1);
                positions[i * 3 + 2] = 0;
            }

            resolve(positions);
        };

        img.onerror = () => reject(new Error(`Failed to load PNG: ${pngUrl}`));
        img.src = pngUrl;
    });
}

// ─── SVG Sampler ──────────────────────────────────────────────────────────────
async function sampleSVGPositions(
    svgUrl: string,
    count: number,
): Promise<Float32Array> {
    const res = await fetch(svgUrl);
    const svgText = await res.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgText, "image/svg+xml");
    const svgEl = doc.documentElement as unknown as SVGSVGElement;

    const host = document.createElement("div");
    host.style.cssText =
        "position:fixed;top:-9999px;left:-9999px;width:1px;height:1px;overflow:hidden;visibility:hidden";
    host.appendChild(svgEl);
    document.body.appendChild(host);

    const elements = Array.from(
        host.querySelectorAll<SVGGeometryElement>(
            "path, circle, ellipse, rect, polygon, polyline, line"
        )
    );
    const lengths = elements.map((el) => el.getTotalLength());
    const totalLength = lengths.reduce((a, b) => a + b, 0);

    const vb = svgEl.viewBox?.baseVal ?? { width: 400, height: 400, x: 0, y: 0 };
    const halfW = (vb.width || 400) / 2;
    const halfH = (vb.height || 400) / 2;
    const scale = 1 / Math.max(halfW, halfH);

    const positions = new Float32Array(count * 3);
    let written = 0;

    for (let ei = 0; ei < elements.length; ei++) {
        const el = elements[ei];
        const len = lengths[ei];
        const cnt = Math.round((len / totalLength) * count);

        for (let k = 0; k < cnt && written < count; k++) {
            const t = len === 0 ? 0 : (k / Math.max(cnt - 1, 1)) * len;
            const pt = el.getPointAtLength(t);
            positions[written * 3] = (pt.x - (vb.x + halfW)) * scale;
            positions[written * 3 + 1] = -((pt.y - (vb.y + halfH)) * scale);
            positions[written * 3 + 2] = 0;
            written++;
        }
    }

    // Fill any remaining slots
    if (written > 0) {
        for (let i = written; i < count; i++) {
            positions[i * 3] = positions[(written - 1) * 3];
            positions[i * 3 + 1] = positions[(written - 1) * 3 + 1];
            positions[i * 3 + 2] = 0;
        }
    }

    document.body.removeChild(host);
    return positions;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
/**
 * Precalculates and caches particle positions from a shape file.
 * Automatically detects PNG vs SVG by file extension.
 *
 * @param count    Number of particles (4 000 – 8 000 recommended)
 * @param shapeSrc URL to a PNG or SVG file
 */
export function useParticles(
    count: number,
    shapeSrc: string,
): ParticlePositions | null {
    const [positions, setPositions] = useState<ParticlePositions | null>(null);
    const cache = useRef<Record<string, Float32Array>>({});

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            // Return from cache immediately if already sampled
            if (cache.current[shapeSrc]) {
                if (!cancelled) {
                    setPositions({
                        random: createRandomPositions(count),
                        target: cache.current[shapeSrc],
                        count,
                    });
                }
                return;
            }

            try {
                const ext = shapeSrc.split(".").pop()?.toLowerCase() ?? "";
                const isPNG = ext === "png" || ext === "jpg" || ext === "jpeg" || ext === "webp";
                const target = isPNG
                    ? await samplePNGEdges(shapeSrc, count)
                    : await sampleSVGPositions(shapeSrc, count);

                cache.current[shapeSrc] = target;

                if (!cancelled) {
                    setPositions({
                        random: createRandomPositions(count),
                        target,
                        count,
                    });
                }
            } catch (err) {
                console.warn("[useParticles] Failed to load shape:", err);
                // Fallback ring
                if (!cancelled) {
                    const fallback = new Float32Array(count * 3);
                    for (let i = 0; i < count; i++) {
                        const a = (i / count) * Math.PI * 2;
                        fallback[i * 3] = Math.cos(a) * 1.2;
                        fallback[i * 3 + 1] = Math.sin(a) * 1.2;
                    }
                    setPositions({ random: createRandomPositions(count), target: fallback, count });
                }
            }
        };

        load();
        return () => { cancelled = true; };
    }, [count, shapeSrc]);

    return positions;
}
