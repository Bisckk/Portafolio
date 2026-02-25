"use client";

import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const iconRef = useRef<HTMLDivElement>(null);

    useEffect(() => setMounted(true), []);

    const toggle = async () => {
        if (!mounted) return;
        const { gsap } = await import("@/lib/gsap-config");
        if (iconRef.current) {
            gsap.to(iconRef.current, {
                rotate: 360,
                duration: 0.5,
                ease: "back.out(1.7)",
                onComplete: () => {
                    if (iconRef.current) gsap.set(iconRef.current, { rotate: 0 });
                },
            });
        }
        setTheme(resolvedTheme === "dark" ? "light" : "dark");
    };

    if (!mounted) {
        return (
            <div className="w-9 h-9 rounded-full animate-pulse bg-white/10" />
        );
    }

    return (
        <button
            onClick={toggle}
            aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="relative w-9 h-9 rounded-full flex items-center justify-center
        border border-black/10 dark:border-white/20 hover:border-black/20 dark:hover:border-white/50
        bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all duration-300
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#c585eb]"
        >
            <div ref={iconRef}>
                {resolvedTheme === "dark" ? (
                    <Sun size={16} className="text-yellow-300" />
                ) : (
                    <Moon size={16} className="text-slate-700 dark:text-slate-300" />
                )}
            </div>
        </button>
    );
}
