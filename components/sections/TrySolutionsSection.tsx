/**
 * TrySolutionsSection.tsx
 *
 * Two-column layout (Works / Contact) with the HeroParticles GPU particle
 * effect. On hover the particles form an SVG shape; on mouse-out they disperse.
 */

"use client";

import { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
import { WorksModal } from "./WorksModal";
import { ContactModal } from "./ContactModal";

const HeroParticles = dynamic(
    () => import("@/components/particles/HeroParticles").then((m) => m.HeroParticles),
    { ssr: false }
);

interface ColumnProps {
    title: string;
    subtitle: string;
    cta: string;
    shape: string;
    color: string;
    count?: number;
    onClick: () => void;
}

function ParticleColumn({ title, subtitle, cta, shape, color, count, onClick }: ColumnProps) {
    const [hover, setHover] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let ctx: any;
        let isMounted = true;

        const init = async () => {
            const { gsap, ScrollTrigger } = await import("@/lib/gsap-config");
            if (!isMounted || !contentRef.current) return;

            ctx = gsap.context(() => {
                const elements = contentRef.current?.querySelectorAll(".pcol-animate");
                if (elements && elements.length > 0) {
                    gsap.set(elements, { y: 30, opacity: 0, filter: "blur(8px)" });
                    let solAnimated = false;
                    const runSolAnim = () => {
                        if (solAnimated) return;
                        solAnimated = true;
                        gsap.to(elements, { y: 0, opacity: 1, filter: "blur(0px)", stagger: 0.15, duration: 1, ease: "power3.out" });
                    };
                    ScrollTrigger.create({
                        trigger: contentRef.current,
                        start: "top 80%",
                        once: true,
                        onEnter: runSolAnim,
                        onLeave: runSolAnim
                    });
                }
            }, contentRef);
        };
        init();

        return () => {
            isMounted = false;
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        <div
            className="
        relative flex-1 flex flex-col items-center justify-center min-h-[400px] md:min-h-full
        cursor-pointer group
        transition-all duration-500
      "
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={onClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onClick()}
            aria-label={`${title} — ${cta}`}
        >
            <HeroParticles
                hover={hover}
                shape={shape}
                count={count}
                color={color}
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#CC2200]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Text overlay */}
            <div ref={contentRef} className="relative z-10 text-center px-10 pointer-events-none select-none">
                <p className="pcol-animate text-[11px] uppercase tracking-[0.3em] font-medium text-[#CC2200] mb-4">
                    {subtitle}
                </p>
                <h3
                    className="pcol-animate
            text-3xl md:text-4xl lg:text-5xl font-black text-[#f0ede8] leading-tight mb-8 tracking-tighter uppercase
            transition-transform duration-500 group-hover:-translate-y-2
          "
                    style={{ textShadow: "4px 4px 0px rgba(204,34,0,0.2)" }}
                >
                    {title}
                </h3>

                <div className="pcol-animate inline-block mt-2">
                    <span
                        className="
                inline-flex items-center gap-2 px-8 py-3.5 text-xs font-mono font-bold tracking-[0.2em] uppercase
                bg-[#CC2200]/5 border border-[#CC2200]/30 text-[#f0ede8]
                transition-all duration-500 ease-out shadow-[0_0_10px_rgba(204,34,0,0.1)]
                group-hover:bg-[#CC2200]/20 group-hover:border-[#CC2200] group-hover:text-white group-hover:shadow-[0_0_30px_rgba(204,34,0,0.3)]
              "
                        style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%)" }}
                    >
                        [ {cta} ]
                    </span>
                </div>
            </div>
        </div>
    );
}

export function TrySolutionsSection() {
    const tw = useTranslations("works");
    const tc = useTranslations("contact");

    const [worksOpen, setWorksOpen] = useState(false);
    const [contactOpen, setContactOpen] = useState(false);

    return (
        <>
            <section id="works" className="relative py-20 bg-[#080808] selection:bg-[#CC2200]/30 overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#CC2200]/[0.03] rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-[#7a1500]/[0.03] rounded-full blur-[120px] pointer-events-none" />

                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-px bg-gradient-to-r from-transparent via-[#CC2200]/15 to-transparent mb-12" />

                <div className="relative z-10 max-w-[1328px] mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-0">
                    <div
                        id="contact"
                        className="flex flex-col md:flex-row w-full h-auto md:h-[771px] gap-8 md:gap-0"
                    >
                        <ParticleColumn
                            title={tw("subtitle")}
                            subtitle={tw("section_label")}
                            cta={tw("cta")}
                            shape="/llaves.png"
                            color="#CC2200"
                            onClick={() => setWorksOpen(true)}
                        />

                        <div className="hidden md:block w-px h-2/3 my-auto bg-gradient-to-b from-transparent via-[#CC2200]/15 to-transparent" />

                        <ParticleColumn
                            title={`${tc("title")} ${tc("subtitle")}`}
                            subtitle={tc("section_label")}
                            cta={tc("cta")}
                            shape="/cube.png"
                            color="#CC2200"
                            onClick={() => setContactOpen(true)}
                        />
                    </div>
                </div>
            </section>

            <WorksModal isOpen={worksOpen} onClose={() => setWorksOpen(false)} />
            <ContactModal isOpen={contactOpen} onClose={() => setContactOpen(false)} />
        </>
    );
}
