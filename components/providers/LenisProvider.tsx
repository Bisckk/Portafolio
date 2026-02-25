"use client";

import { useLenis } from "@/hooks/useLenis";

/**
 * LenisProvider: Client component that initializes Lenis smooth scroll.
 * Must be rendered once inside the layout, with no visible output.
 */
export function LenisProvider() {
    useLenis(); // Initialize Lenis + GSAP integration
    return null;
}
