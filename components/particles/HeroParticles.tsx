/**
 * HeroParticles.tsx
 *
 * Public-facing component. Usage:
 *
 *   <HeroParticles hover={isHovered} shape="/shapes/brackets.svg" />
 *
 * Props:
 *   hover   — drives particle interpolation (dispersed → formed)
 *   shape   — URL to an SVG file whose outlines become the target shape
 *   count   — number of particles (default: 6000)
 *   color   — hex particle colour   (default: "#c585ebff")
 *   isDark  — dark/light mode flag  (default: true)
 *   className — extra CSS classes for the root container
 */

"use client";


import { useParticles } from "@/hooks/useParticles";
import { ParticleSystem } from "@/components/particles/ParticleSystem";

interface HeroParticlesProps {
    /** When true, particles lerp toward the SVG shape. */
    hover: boolean;
    /** Path to SVG file to sample the target shape from. */
    shape: string;
    /** How many particles to render. 4 000 – 8 000 recommended. */
    count?: number;
    /** Hex colour for the particles (e.g. "#ffffffff"). */
    color?: string;
    /** Speed when forming the shape (0.0 - 1.0). Default: 0.06 */
    speedIn?: number;
    /** Speed when dispersing (0.0 - 1.0). Default: 0.04 */
    speedOut?: number;
    /** Override dark mode instead of reading from next-themes. */
    forceDark?: boolean;
    /** Extra classes applied to the wrapping div. */
    className?: string;
}

export function HeroParticles({
    hover,
    shape,
    count = 1000,
    color = "#ffffffff",
    speedIn = 0.03,
    speedOut = 0.008,
    forceDark,
    className = "",
}: HeroParticlesProps) {
    const isDark = forceDark !== undefined ? forceDark : true;

    // Load & cache particle positions (async — returns null until ready)
    const positions = useParticles(count, shape);

    if (!positions) {
        // Not yet loaded — render an invisible placeholder of the same size
        return (
            <div
                className={`absolute inset-0 pointer-events-none ${className}`}
                aria-hidden="true"
            />
        );
    }

    return (
        <div
            className={`absolute inset-0 pointer-events-none ${className}`}
            aria-hidden="true"
        >
            <ParticleSystem
                positions={positions}
                hover={hover}
                isDark={isDark}
                color={color}
                speedIn={speedIn}
                speedOut={speedOut}
            />
        </div>
    );
}
