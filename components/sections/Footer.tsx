"use client";

import { useTranslations } from "next-intl";
import { Heart, Code2 } from "lucide-react";

const socialLinks = [
    { name: "GitHub", href: "https://github.com/bismarckbarrios", label: "GitHub profile", icon: "github" },
    { name: "LinkedIn", href: "https://linkedin.com/in/bismarckbarrios", label: "LinkedIn profile", icon: "linkedin" },
    { name: "Twitter", href: "https://twitter.com/bismarckbarrios", label: "Twitter profile", icon: "twitter" },
];

export function Footer() {
    const t = useTranslations("footer");
    const year = new Date().getFullYear();

    return (
        <footer className="relative py-12 px-6 bg-[#080808] overflow-hidden selection:bg-[#CC2200]/30">
            {/* Glow */}
            <div className="absolute top-0 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-[#CC2200]/[0.03] rounded-full blur-[100px] pointer-events-none" />

            {/* Separator */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-px bg-gradient-to-r from-transparent via-[#CC2200]/15 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Brand */}
                <div className="flex flex-col md:flex-row items-center md:items-baseline gap-2 md:gap-4 text-center md:text-left">
                    <span className="text-[#f0ede8] font-bold text-xl tracking-tight">
                        BB<span className="text-[#CC2200]">.</span>
                    </span>
                    <span className="text-white/30 text-sm font-medium">
                        © {year} Bismarck Barrios. <span className="hidden sm:inline">{t("rights")}.</span>
                    </span>
                </div>

                {/* Made with */}
                <p className="text-white/40 text-xs font-medium flex items-center gap-1.5 tracking-wide uppercase">
                    {t("made_with")}
                    <Heart size={12} className="text-[#CC2200] animate-pulse" fill="currentColor" />
                    {t("and")}
                    <Code2 size={14} className="text-[#CC2200]" />
                </p>

                {/* Social links */}
                <div className="flex gap-4">
                    {socialLinks.map((l) => (
                        <a
                            key={l.name}
                            href={l.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={l.label}
                            className="px-4 py-2 rounded-xl text-sm font-semibold tracking-wide
                            text-white/60 bg-white/[0.03] 
                            border border-white/10 backdrop-blur-md
                            transition-all duration-300 ease-out shadow-sm
                            hover:text-[#CC2200] hover:bg-[#CC2200]/10 hover:border-[#CC2200]/40
                            hover:-translate-y-1 hover:shadow-[0_0_15px_rgba(204,34,0,0.15)]
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#CC2200]"
                        >
                            {l.name}
                        </a>
                    ))}
                </div>
            </div>
        </footer>
    );
}
