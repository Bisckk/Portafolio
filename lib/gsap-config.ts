import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register all required GSAP plugins
if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

// Default GSAP ease curves
export const easings = {
    smooth: "power2.inOut",
    snap: "power4.out",
    elastic: "elastic.out(1, 0.5)",
    bounce: "bounce.out",
} as const;

// Common animation defaults
export const fadeUpDefaults = {
    y: 60,
    opacity: 0,
    duration: 0.8,
    ease: easings.smooth,
} as const;

export const staggerDefaults = {
    stagger: 0.08,
    ease: easings.smooth,
} as const;

export { gsap, ScrollTrigger };
