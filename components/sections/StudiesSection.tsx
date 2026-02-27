"use client";

import { useEffect, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";
import { studies } from "@/lib/data";
import { GraduationCap, CheckCircle, Clock } from "lucide-react";

export function StudiesSection() {
    const t = useTranslations("studies");
    const locale = useLocale();
    const isEn = locale === "en";
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        let ctx: any;
        let isMounted = true;

        const init = async () => {
            const { gsap, ScrollTrigger } = await import("@/lib/gsap-config");
            if (!isMounted || !sectionRef.current) return;

            ctx = gsap.context(() => {
                const studyCards = sectionRef.current?.querySelectorAll(".study-card");
                if (studyCards && studyCards.length > 0) {
                    gsap.set(studyCards, { y: 40, opacity: 0, filter: "blur(10px)" });
                    let stdAnimated = false;
                    const runStdAnim = () => {
                        if (stdAnimated) return;
                        stdAnimated = true;
                        gsap.to(studyCards, { y: 0, opacity: 1, filter: "blur(0px)", stagger: 0.15, duration: 1.2, ease: "power3.out" });
                    };
                    ScrollTrigger.create({
                        trigger: sectionRef.current,
                        start: "top 75%",
                        once: true,
                        onEnter: runStdAnim,
                        onLeave: runStdAnim
                    });
                }
            }, sectionRef);
        };
        init();

        return () => {
            isMounted = false;
            if (ctx) ctx.revert();
        };
    }, []);

    return (
        <section
            id="studies"
            ref={sectionRef}
            className="relative py-32 px-6 bg-[#080808] overflow-hidden selection:bg-[#CC2200]/30"
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-px bg-gradient-to-r from-transparent via-[#CC2200]/10 to-transparent" />
            <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#CC2200]/[0.03] rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#7a1500]/[0.03] rounded-full blur-[120px] pointer-events-none" />

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

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {studies.map((study) => (
                        <div
                            key={study.id}
                            className="study-card group relative p-8 bg-[#0d0d0d] border-t-2 border-[#CC2200] shadow-[0_0_20px_rgba(0,0,0,0.8)] hover:shadow-[0_0_30px_rgba(204,34,0,0.15)] transition-all duration-500 ease-out flex flex-col justify-between overflow-hidden"
                            style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)" }}
                        >
                            <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#CC2200]/20 pointer-events-none" style={{ clipPath: "polygon(100% 0, 0 100%, 100% 100%)" }} />

                            {/* Scanline overlay */}
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(204,34,0,0.03)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute inset-0 bg-gradient-to-br from-[#CC2200]/0 to-[#CC2200]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div>
                                <div className="relative z-10 flex items-start justify-between mb-8">
                                    <div className="w-12 h-12 rounded-none bg-[#CC2200]/10 border border-[#CC2200]/30
                                    flex items-center justify-center shadow-[0_0_10px_rgba(204,34,0,0.1)] group-hover:bg-[#CC2200]/20 group-hover:border-[#CC2200]/50 transition-all duration-300">
                                        <GraduationCap size={24} className="text-[#CC2200]" />
                                    </div>
                                    <span className={`flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-none
                                    font-mono font-bold uppercase tracking-widest border shadow-sm
                                    ${study.status === "completed"
                                            ? "bg-[#CC2200]/10 border-[#CC2200]/30 text-[#CC2200] shadow-[0_0_10px_rgba(204,34,0,0.2)]"
                                            : "bg-[#7a1500]/10 border-[#7a1500]/30 text-[#f0ede8]"
                                        }`}>
                                        {study.status === "completed"
                                            ? <><CheckCircle size={12} /> {t("badge_completed")}</>
                                            : <><Clock size={12} /> {t("badge_inprogress")}</>
                                        }
                                    </span>
                                </div>

                                <p className="relative z-10 text-[10px] text-[#CC2200] font-mono font-bold uppercase tracking-[0.3em] mb-4">
                                    [ {study.institution} ]
                                </p>

                                <h3 className="relative z-10 font-bold text-[#f0ede8] text-xl leading-snug mb-8 tracking-tighter uppercase group-hover:text-[#CC2200] transition-colors duration-300">
                                    {isEn ? study.titleEn : study.title}
                                </h3>
                            </div>

                            <div className="relative z-10 flex items-center justify-between mt-auto pt-5 border-t border-[#CC2200]/20 text-[11px] font-mono font-bold text-white/50 uppercase tracking-widest">
                                <span className="px-2 py-1 bg-[#CC2200]/5 border border-[#CC2200]/20 text-[#CC2200]">
                                    {isEn ? study.areaEn : study.area}
                                </span>
                                <span>{isEn ? (study.yearEn || study.year) : study.year}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
