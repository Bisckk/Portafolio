"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { experiences } from "@/lib/data";
import { MapPin, Calendar, TerminalSquare } from "lucide-react";

const QUOTE_CHARS = "Every line of code is an opportunity to create something extraordinary".split("");

export function ExperienceSection() {
    const t = useTranslations("experience");
    const sectionRef = useRef<HTMLElement>(null);
    const quoteRef = useRef<HTMLDivElement>(null);
    const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
    const timelineRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<SVGLineElement>(null);

    useEffect(() => {
        const init = async () => {
            const { gsap, ScrollTrigger } = await import("@/lib/gsap-config");
            if (!sectionRef.current) return;

            if (charsRef.current.length > 0) {
                gsap.fromTo(
                    charsRef.current.filter(Boolean),
                    { opacity: 0.08, y: () => (Math.random() - 0.5) * 30, filter: "blur(4px)" },
                    {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        stagger: 0.03,
                        ease: "none",
                        scrollTrigger: {
                            trigger: quoteRef.current,
                            start: "top 80%",
                            end: "bottom 30%",
                            scrub: 1,
                        },
                    }
                );
            }

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
                gsap.set(cards, { x: -40, opacity: 0, filter: "blur(10px)" });

                ScrollTrigger.create({
                    trigger: timelineRef.current,
                    start: "top 75%",
                    onEnter: () => {
                        gsap.to(cards, {
                            x: 0,
                            opacity: 1,
                            filter: "blur(0px)",
                            stagger: 0.2,
                            duration: 1.2,
                            ease: "power3.out",
                        });
                    },
                    once: true,
                });
            }

            ScrollTrigger.refresh();
        };
        init();
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
                <p className="text-xs uppercase tracking-[0.4em] text-[#CC2200] mb-6 font-medium">
                    {t("section_label")}
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold text-[#f0ede8] mb-20 tracking-tight">
                    {t("title")}
                </h2>

                {/* Scattered quote */}
                <div
                    ref={quoteRef}
                    className="mb-24 max-w-4xl leading-relaxed flex flex-wrap gap-x-2 gap-y-1"
                    aria-label={t("quote")}
                >
                    {QUOTE_CHARS.map((char, i) => (
                        <span
                            key={i}
                            ref={(el) => { charsRef.current[i] = el; }}
                            className={`inline-block text-lg md:text-3xl font-light tracking-tight text-white/90
                ${char === " " ? "w-3 md:w-4" : ""}`}
                        >
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
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
                                <div className="absolute -left-[64px] top-4 w-4 h-4 rounded-full
                  bg-[#080808] border-2 border-[#CC2200] shadow-[0_0_15px_rgba(204,34,0,0.6)] 
                  group-hover:scale-125 group-hover:bg-[#CC2200] transition-all duration-300 hidden md:block"
                                    aria-hidden="true"
                                />

                                {/* Card */}
                                <div className="p-8 rounded-3xl overflow-hidden relative
                                bg-white/[0.02] 
                                border border-white/[0.05] 
                                backdrop-blur-xl shadow-lg
                                hover:border-[#CC2200]/30 hover:shadow-[0_0_40px_rgba(204,34,0,0.08)] 
                                transition-all duration-500 ease-out">

                                    <div className="absolute inset-0 bg-gradient-to-br from-[#CC2200]/0 to-[#CC2200]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                    {/* Header */}
                                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-6 border-b border-white/5 pb-4">
                                        <div>
                                            <h3 className="text-2xl font-bold tracking-tight text-[#f0ede8] flex items-center gap-3">
                                                <TerminalSquare size={20} className="text-[#CC2200] hidden sm:block" />
                                                {exp.role}
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
                                                <span className="ml-2 px-3 py-1 text-xs bg-green-500/10
                          text-green-400 border border-green-500/20 rounded-full font-bold shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                                                    {t("present")}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <p className="relative z-10 text-white/60 text-base leading-relaxed mb-6 font-light">
                                        {exp.description}
                                    </p>

                                    <ul className="relative z-10 flex flex-col gap-3 mb-8">
                                        {exp.achievements.map((ach, i) => (
                                            <li key={i} className="text-[15px] text-white/50 flex items-start gap-3">
                                                <span className="text-[#CC2200] mt-[2px] shrink-0 text-lg leading-none">›</span>
                                                <span className="font-light">{ach}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="relative z-10 flex flex-wrap gap-2">
                                        {exp.stack.map((tech) => (
                                            <span key={tech}
                                                className="px-4 py-1.5 text-xs font-medium rounded-full border border-white/10
                          bg-white/5 text-white/60 
                          hover:text-[#f0ede8] hover:border-[#CC2200]/50 hover:bg-[#CC2200]/10
                          shadow-sm transition-all duration-300">
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
