"use client";

import { useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { experiences } from "@/lib/data";
import { MapPin, Calendar, TerminalSquare } from "lucide-react";
import DecryptedText from "../ui/DecryptedText";

export function ExperienceSection() {
    const t = useTranslations("experience");
    const locale = useLocale();
    const isEn = locale === "en";
    const sectionRef = useRef<HTMLElement>(null);
    const quoteRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<SVGLineElement>(null);

    useEffect(() => {
        let ctx: any;
        let isMounted = true;

        const init = async () => {
            const { gsap, ScrollTrigger } = await import("@/lib/gsap-config");
            if (!isMounted || !sectionRef.current) return;

            ctx = gsap.context(() => {
                if (lineRef.current) {
                    const len = (lineRef.current as SVGLineElement).getTotalLength?.() ?? 500;
                    gsap.set(lineRef.current, { strokeDasharray: len, strokeDashoffset: len });
                    gsap.to(lineRef.current, {
                        strokeDashoffset: 0,
                        scrollTrigger: {
                            trigger: timelineRef.current,
                            start: "top 70%",
                            end: "bottom 60%",
                            scrub: true,
                        },
                    });
                }

                if (timelineRef.current) {
                    const cards = timelineRef.current.querySelectorAll(".exp-card");

                    gsap.fromTo(cards,
                        { x: -40, opacity: 0, filter: "blur(10px)" },
                        {
                            x: 0,
                            opacity: 1,
                            filter: "blur(0px)",
                            stagger: 0.2,
                            duration: 1.2,
                            ease: "power3.out",
                            scrollTrigger: {
                                trigger: timelineRef.current,
                                start: "top 80%",
                                once: true,
                            }
                        }
                    );
                }
            }, sectionRef);

            ScrollTrigger.refresh();
        };
        init();

        return () => {
            isMounted = false;
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        <section
            id="experience"
            ref={sectionRef}
            className="relative py-32 px-6 overflow-hidden bg-[#080808] selection:bg-[#CC2200]/30"
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-px bg-gradient-to-r from-transparent via-[#CC2200]/10 to-transparent" />
            <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-[#CC2200]/[0.03] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-[#7a1500]/[0.03] rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-px bg-[#CC2200]" />
                    <p className="text-xs uppercase tracking-[0.5em] text-[#CC2200] font-mono font-bold">
                        // {t("section_label")}
                    </p>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#f0ede8] mb-20 tracking-tighter uppercase" style={{ textShadow: "4px 4px 0px rgba(204,34,0,0.2)" }}>
                    {t("title")}
                </h2>

                {/* Cyberpunk Animated Quote */}
                <div
                    ref={quoteRef}
                    className="mb-24 max-w-4xl leading-relaxed border-l-2 border-[#CC2200] pl-6 py-2 bg-gradient-to-r from-[#CC2200]/10 to-transparent"
                    aria-label={t("quote")}
                >
                    <DecryptedText
                        text={t("quote")}
                        speed={60}
                        maxIterations={15}
                        characters="ABCD1234!?#@*%<>_{}[]"
                        className="text-lg md:text-3xl font-mono font-medium text-[#f0ede8] tracking-widest uppercase"
                        encryptedClassName="text-lg md:text-3xl font-mono font-bold text-[#CC2200] tracking-widest uppercase opacity-80"
                        parentClassName="block"
                        animateOn="view"
                        revealDirection="start"
                        sequential
                    />
                </div>

                {/* Timeline */}
                <div ref={timelineRef} className="relative">
                    <svg
                        className="absolute left-6 top-0 h-full w-[2px] hidden md:block"
                        style={{ overflow: "visible" }}
                        aria-hidden="true"
                    >
                        <defs>
                            <linearGradient id="glowG" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#CC2200" stopOpacity="0.8" />
                                <stop offset="50%" stopColor="#7a1500" stopOpacity="0.4" />
                                <stop offset="100%" stopColor="#CC2200" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <line
                            ref={lineRef}
                            x1="1" y1="0" x2="1" y2="100%"
                            stroke="url(#glowG)"
                            strokeWidth="2"
                            strokeLinecap="round"
                        />
                    </svg>

                    <div className="flex flex-col gap-14 md:pl-20">
                        {experiences.map((exp) => (
                            <div key={exp.id} className="exp-card relative group">
                                {/* Timeline dot */}
                                <div className="absolute -left-[64px] top-4 w-4 h-4 rounded-none
                  bg-[#080808] border-2 border-[#CC2200] shadow-[0_0_15px_rgba(204,34,0,0.6)] 
                  group-hover:scale-125 group-hover:bg-[#CC2200] transition-all duration-300 hidden md:block rotate-45"
                                    aria-hidden="true"
                                />

                                {/* Card Styled for Cyberpunk */}
                                <div
                                    className="p-8 relative bg-[#0d0d0d] border-l-2 border-[#CC2200] shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(204,34,0,0.15)] transition-all duration-500 ease-out flex flex-col group overflow-hidden"
                                    style={{ clipPath: "polygon(0 0, calc(100% - 30px) 0, 100% 30px, 100% 100%, 30px 100%, 0 calc(100% - 30px))" }}
                                >
                                    <div className="absolute top-0 right-0 w-8 h-8 bg-[#CC2200]/20 pointer-events-none" style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} />
                                    <div className="absolute bottom-0 left-0 w-8 h-8 bg-[#CC2200]/20 pointer-events-none" style={{ clipPath: "polygon(0 100%, 100% 100%, 0 0)" }} />

                                    {/* Scanline overlay */}
                                    <div className="absolute inset-0 bg-[linear-gradient(rgba(204,34,0,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 bg-gradient-to-br from-[#CC2200]/0 to-[#CC2200]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                    {/* Header */}
                                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6 border-b border-[#CC2200]/20 pb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold tracking-tight text-[#f0ede8] flex items-center gap-3">
                                                <TerminalSquare size={20} className="text-[#CC2200] hidden sm:block" />
                                                {isEn ? exp.roleEn : exp.role}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <MapPin size={14} className="text-[#CC2200]" />
                                                <span className="text-[#CC2200] font-semibold text-sm uppercase tracking-wide">{exp.company}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 text-white/40 text-sm shrink-0 font-medium">
                                            <Calendar size={14} className="text-white/30" />
                                            <span>{exp.period}</span>
                                            {exp.current && (
                                                <span className="ml-2 px-3 py-1 text-xs bg-[#CC2200]/10
                          text-[#CC2200] border border-[#CC2200]/30 font-mono font-bold tracking-widest uppercase shadow-[0_0_10px_rgba(204,34,0,0.2)]">
                                                    {t("present")}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="relative z-10 text-white/70 text-base leading-relaxed mb-6 font-mono tracking-wide">
                                        &gt; {isEn ? exp.descriptionEn : exp.description}
                                    </p>

                                    <ul className="relative z-10 flex flex-col gap-3 mb-8">
                                        {(isEn ? exp.achievementsEn : exp.achievements).map((ach, i) => (
                                            <li key={i} className="text-[15px] text-white/50 flex items-start gap-3">
                                                <span className="text-[#CC2200] mt-[2px] shrink-0 text-lg leading-none">›</span>
                                                <span className="font-light">{ach}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="relative z-10 flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#CC2200]/10">
                                        {exp.stack.map((tech) => (
                                            <span key={tech}
                                                className="px-3 py-1 text-xs font-mono font-bold rounded-sm border border-[#CC2200]/30
                          bg-[#CC2200]/5 text-white/70 
                          hover:text-[#f0ede8] hover:border-[#CC2200] hover:bg-[#CC2200]/20
                          shadow-[0_0_5px_rgba(204,34,0,0.1)] hover:shadow-[0_0_10px_rgba(204,34,0,0.3)] transition-all duration-300 uppercase tracking-wider">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
