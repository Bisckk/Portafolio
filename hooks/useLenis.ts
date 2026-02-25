"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

let lenisInstance: Lenis | null = null;

export function useLenis() {
    const lenisRef = useRef<Lenis | null>(null);

    useEffect(() => {
        const initLenis = async () => {
            const { gsap } = await import("@/lib/gsap-config");
            const { ScrollTrigger } = await import("gsap/ScrollTrigger");
            gsap.registerPlugin(ScrollTrigger);

            const lenis = new Lenis({
                duration: 1.2,
                easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: "vertical",
                smoothWheel: true,
                touchMultiplier: 2,
            });

            lenisInstance = lenis;
            lenisRef.current = lenis;

            // Connect Lenis RAF to GSAP ticker
            gsap.ticker.add((time: number) => {
                lenis.raf(time * 1000);
            });

            gsap.ticker.lagSmoothing(0);

            // ScrollTrigger proxy
            ScrollTrigger.scrollerProxy(document.documentElement, {
                scrollTop(value?: number) {
                    if (arguments.length && value !== undefined) {
                        lenis.scrollTo(value, { immediate: true });
                    }
                    return lenis.scroll;
                },
                getBoundingClientRect() {
                    return {
                        top: 0,
                        left: 0,
                        width: window.innerWidth,
                        height: window.innerHeight,
                    };
                },
            });

            lenis.on("scroll", ScrollTrigger.update);
        };

        initLenis();

        return () => {
            if (lenisRef.current) {
                lenisRef.current.destroy();
                lenisInstance = null;
                lenisRef.current = null;
            }
        };
    }, []);

    return lenisRef;
}

// Utility to scroll to a section programmatically
export function scrollTo(target: string | number | HTMLElement) {
    if (lenisInstance) {
        lenisInstance.scrollTo(target, { duration: 1.2, offset: -80 });
    }
}
