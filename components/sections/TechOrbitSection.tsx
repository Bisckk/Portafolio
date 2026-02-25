"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { techOrbitRow1, techOrbitRow2 } from "@/lib/data";

interface OrbitTrackProps {
    items: typeof techOrbitRow1;
    direction: "left" | "right";
}

function TechCard({ tech, setTooltip }: { tech: typeof techOrbitRow1[0], setTooltip: any }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // 3D Tilt calculation (max 30 degrees)
        setTilt({ x: -(y / rect.height) * 40, y: (x / rect.width) * 40 });
        setTooltip({ name: tech.name, x: rect.left + rect.width / 2, y: rect.top - 16 });
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setIsHovered(false);
        setTooltip(null);
    };

    return (
        <div
            ref={cardRef}
            className="relative group cursor-pointer flex-shrink-0 z-10"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: "1000px" }}
        >
            <div
                className="w-20 h-20 md:w-28 md:h-28 rounded-[1.5rem] flex items-center justify-center
                    backdrop-blur-md shadow-sm overflow-hidden
                    transition-all ease-out"
                style={{
                    transitionDuration: isHovered ? "50ms" : "500ms", /* Fast on track, slow on release */
                    transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.15 : 1})`,
                    boxShadow: isHovered ? "0 20px 40px -10px rgba(204,34,0,0.5)" : "0 4px 10px rgba(0,0,0,0.1)",
                    borderColor: isHovered ? "rgba(204,34,0,0.5)" : "rgba(255,255,255,0.03)",
                    backgroundColor: isHovered ? "rgba(204,34,0,0.08)" : "rgba(255,255,255,0.02)",
                    borderWidth: "1px",
                    borderStyle: "solid"
                }}
            >
                {/* Internal accent glow */}
                <div
                    className="absolute inset-0 bg-gradient-to-tr from-[#CC2200]/0 to-[#CC2200]/25 transition-opacity duration-500 rounded-[1.5rem] pointer-events-none"
                    style={{ opacity: isHovered ? 1 : 0 }}
                />

                <div
                    className="w-10 h-10 md:w-14 md:h-14 relative z-10 pointer-events-none transition-all duration-500"
                    style={{
                        // Apply drop shadow on the wrapper so it traces the masked shape perfectly
                        filter: isHovered ? "drop-shadow(0px 0px 8px rgba(230, 57, 70, 0.6))" : "none"
                    }}
                >
                    {/* SVG Vector Mask Tinting Trick */}
                    <div
                        className="w-full h-full transition-colors duration-500"
                        style={{
                            WebkitMaskImage: `url(${tech.icon})`,
                            maskImage: `url(${tech.icon})`,
                            WebkitMaskSize: "contain",
                            maskSize: "contain",
                            WebkitMaskRepeat: "no-repeat",
                            maskRepeat: "no-repeat",
                            WebkitMaskPosition: "center",
                            maskPosition: "center",
                            // This ensures the vector stroke is solidly painted with this hex code exactly
                            backgroundColor: isHovered ? "#E63946" : "#666666",
                            opacity: isHovered ? 1 : 0.4
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

function OrbitTrack({ items, direction }: OrbitTrackProps) {
    const trackRef = useRef<HTMLDivElement>(null);
    const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);

    // Quadruple the array to ensure the DOM is massive enough to never show an empty edge on 4k+ screens
    const quadrupled = [...items, ...items, ...items, ...items];
    const animDir = direction === "left" ? "scroll-left-smooth" : "scroll-right-smooth";

    return (
        <div className="overflow-hidden w-full relative py-8">
            <div
                ref={trackRef}
                className={`flex gap-6 md:gap-10 pr-6 md:pr-10 w-max ${animDir}`}
            >
                {quadrupled.map((tech, i) => (
                    <TechCard key={`${tech.name}-${i}`} tech={tech} setTooltip={setTooltip} />
                ))}
            </div>

            {/* Tooltip */}
            {tooltip && (
                <div
                    className="fixed z-50 px-4 py-2 text-xs font-semibold rounded-xl
                    bg-[#080808]/95 text-[#CC2200] border border-[#CC2200]/30 shadow-[0_4px_20px_rgba(204,34,0,0.3)]
                    backdrop-blur-md pointer-events-none transform -translate-x-1/2 -translate-y-[120%] tracking-[0.1em] uppercase"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    {tooltip.name}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-[6px] border-transparent border-t-[#CC2200]/50" />
                </div>
            )}

            {/* Edge fade masks */}
            <div className="absolute inset-y-0 left-0 w-24 md:w-40 pointer-events-none z-20 bg-gradient-to-r from-[#080808] to-transparent"
                aria-hidden="true"
            />
            <div className="absolute inset-y-0 right-0 w-24 md:w-40 pointer-events-none z-20 bg-gradient-to-l from-[#080808] to-transparent"
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
                {/* 
                  Passing the COMBINED 16 items to BOTH rows. 
                  This creates the illusion of a massive snaking loop where elements flow continuously 
                  between top and bottom without ending.
                */}
                <OrbitTrack items={[...techOrbitRow1, ...techOrbitRow2]} direction="left" />
                <OrbitTrack items={[...techOrbitRow1, ...techOrbitRow2]} direction="right" />
            </div>
        </section>
    );
}
