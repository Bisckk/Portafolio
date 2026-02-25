"use client";

import { useMemo } from "react";

interface EdgeDetectionResult {
    positions: Float32Array;
    count: number;
}

/**
 * Detects edge pixels from a PNG image and returns normalized XY positions.
 * An "edge pixel" has alpha > threshold and at least one neighbor with alpha === 0.
 * Positions are normalized to [-1, 1] range for Three.js coordinate space.
 */
export function useEdgeDetection(
    imageSrc: string,
    threshold = 128
): EdgeDetectionResult {
    const result = useMemo(() => {
        // Server-side guard
        if (typeof window === "undefined") {
            return { positions: new Float32Array(0), count: 0 };
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return { positions: new Float32Array(0), count: 0 };

        const img = new Image();
        img.crossOrigin = "anonymous";

        let syncResult: EdgeDetectionResult = { positions: new Float32Array(0), count: 0 };

        // Synchronous approach using pre-loaded image
        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            const { data, width, height } = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const edgePositions: number[] = [];

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const idx = (y * width + x) * 4;
                    const alpha = data[idx + 3];

                    if (alpha > threshold) {
                        // Check if any neighbor has alpha === 0 (edge detection)
                        const isEdge =
                            (x > 0 && data[(y * width + (x - 1)) * 4 + 3] === 0) ||
                            (x < width - 1 && data[(y * width + (x + 1)) * 4 + 3] === 0) ||
                            (y > 0 && data[((y - 1) * width + x) * 4 + 3] === 0) ||
                            (y < height - 1 && data[((y + 1) * width + x) * 4 + 3] === 0);

                        if (isEdge) {
                            // Normalize to [-1, 1]
                            const nx = (x / width) * 2 - 1;
                            const ny = -((y / height) * 2 - 1); // Flip Y for WebGL coords
                            edgePositions.push(nx, ny);
                        }
                    }
                }
            }

            const positions = new Float32Array(edgePositions);
            syncResult = { positions, count: edgePositions.length / 2 };
        };

        img.src = imageSrc;

        return syncResult;
    }, [imageSrc, threshold]);

    return result;
}
