"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { techOrbitRow1, techOrbitRow2 } from "@/lib/data";

interface OrbitTrackProps {
    items: typeof techOrbitRow1;
    direction: "left" | "right";
}

function OrbitTrack({ items, direction }: OrbitTrackProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [paused, setPaused] = useState(false);
    const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);

    const doubled = [...items, ...items];
    const animDir = direction === "left" ? "scroll-left" : "scroll-right";

    return (
        <div
            className="overflow-hidden w-full relative py-6"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => { setPaused(false); setTooltip(null); }}
        >
            <div
                ref={trackRef}
                className={`flex gap-6 md:gap-8 w-max ${animDir}`}
                style={{ animationPlayState: paused ? "paused" : "running" }}
            >
                {doubled.map((tech, i) => (
                    <div
                        key={`${tech.name}-${i}`}
                        className="relative group cursor-pointer flex-shrink-0"
                        onMouseEnter={(e) => {
                            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                            setTooltip({ name: tech.name, x: rect.left + rect.width / 2, y: rect.top - 16 });
                            setPaused(true);
                        }}
                        onMouseLeave={() => setTooltip(null)}
                    >
                        <div
                            className="w-[72px] h-[72px] md:w-[84px] md:h-[84px] rounded-[1.5rem] flex items-center justify-center
                                bg-white/[0.03] 
                                border border-white/[0.05] 
                                backdrop-blur-md shadow-sm
                                transition-all duration-500 ease-out
                                group-hover:scale-110 group-hover:-translate-y-2
                                group-hover:bg-[#CC2200]/10 group-hover:border-[#CC2200]/40
                                group-hover:shadow-[0_10px_30px_-10px_rgba(204,34,0,0.4)]
                                overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#CC2200]/0 to-[#CC2200]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[1.5rem]" />

                            <div className="w-10 h-10 md:w-12 md:h-12 relative z-10">
                                <Image
                                    src={tech.icon}
                                    alt={tech.name}
                                    fill
                                    className="object-contain transition-all duration-500
                                        grayscale-[50%] opacity-80 group-hover:grayscale-0 group-hover:opacity-100 
                                        drop-shadow-sm group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                                    sizes="(max-width: 768px) 40px, 48px"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="fixed z-50 px-4 py-2 text-xs font-semibold rounded-xl
                    bg-[#080808]/95 text-[#f0ede8] border border-white/10 shadow-[0_4px_20px_rgba(204,34,0,0.15)]
                    backdrop-blur-md pointer-events-none transform -translate-x-1/2 -translate-y-full tracking-wide"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    {tooltip.name}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#080808]/95" />
                </div>
            )}

            {/* Edge fade masks */}
            <div className="absolute inset-y-0 left-0 w-24 md:w-40 pointer-events-none z-10 bg-gradient-to-r from-[#080808] to-transparent"
                aria-hidden="true"
            />
            <div className="absolute inset-y-0 right-0 w-24 md:w-40 pointer-events-none z-10 bg-gradient-to-l from-[#080808] to-transparent"
                aria-hidden="true"
            />
        </div>
    );
}

export function TechOrbitSection() {
    const t = useTranslations("orbit");
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const init = async () => {
            const { gsap, ScrollTrigger } = await import("@/lib/gsap-config");
            if (!sectionRef.current) return;

            const elements = sectionRef.current.querySelectorAll(".orbit-fade");
            gsap.set(elements, { y: 40, opacity: 0, scale: 0.95, filter: "blur(10px)" });

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top 75%",
                onEnter: () => {
                    gsap.to(elements, {
                        y: 0,
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px)",
                        stagger: 0.15,
                        duration: 1.2,
                        ease: "power3.out",
                    });
                },
                once: true
            });
        };
        init();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="relative py-32 overflow-hidden bg-[#080808] selection:bg-[#CC2200]/30"
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-px bg-gradient-to-r from-transparent via-[#CC2200]/10 to-transparent" />
            <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-[#CC2200]/[0.03] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[700px] h-[700px] bg-[#7a1500]/[0.03] rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6 mb-16 text-center">
                <p className="orbit-fade text-xs uppercase tracking-[0.4em] text-[#CC2200] mb-6 font-medium">
                    {t("section_label")}
                </p>
                <h2 className="orbit-fade text-4xl sm:text-5xl lg:text-5xl font-bold text-[#f0ede8] tracking-tight">
                    {t("title")}
                </h2>
            </div>

            <div className="relative z-10 flex flex-col gap-4 md:gap-8">
                <OrbitTrack items={techOrbitRow1} direction="left" />
                <OrbitTrack items={techOrbitRow2} direction="right" />
            </div>
        </section>
    );
}
