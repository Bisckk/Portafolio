"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { studies } from "@/lib/data";
import { GraduationCap, CheckCircle, Clock } from "lucide-react";

export function StudiesSection() {
    const t = useTranslations("studies");
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const init = async () => {
            const { gsap, ScrollTrigger } = await import("@/lib/gsap-config");
            if (!sectionRef.current) return;

            const studyCards = sectionRef.current.querySelectorAll(".study-card");
            gsap.set(studyCards, { y: 40, opacity: 0, filter: "blur(10px)" });

            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: "top 75%",
                onEnter: () => {
                    gsap.to(studyCards, {
                        y: 0,
                        opacity: 1,
                        filter: "blur(0px)",
                        stagger: 0.15,
                        duration: 1.2,
                        ease: "power3.out",
                    });
                },
                once: true
            });

            ScrollTrigger.refresh();
        };
        init();
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
                <p className="text-xs uppercase tracking-[0.4em] text-[#CC2200] mb-6 font-medium">
                    {t("section_label")}
                </p>
                <h2 className="text-4xl md:text-5xl lg:text-5xl font-bold text-[#f0ede8] mb-20 tracking-tight">
                    {t("title")}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {studies.map((study) => (
                        <div
                            key={study.id}
                            className="study-card group relative p-8 rounded-3xl overflow-hidden
                            bg-white/[0.02] 
                            border border-white/[0.05] 
                            backdrop-blur-xl shadow-lg
                            hover:border-[#CC2200]/30 hover:shadow-[0_0_40px_rgba(204,34,0,0.08)] 
                            transition-all duration-500 ease-out flex flex-col justify-between"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[#CC2200]/0 to-[#CC2200]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                            <div>
                                <div className="relative z-10 flex items-start justify-between mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10
                                    flex items-center justify-center shadow-sm group-hover:scale-110 group-hover:bg-[#CC2200]/15 group-hover:border-[#CC2200]/30 transition-all duration-300">
                                        <GraduationCap size={26} className="text-[#CC2200]" />
                                    </div>
                                    <span className={`flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full
                                    font-bold uppercase tracking-wider border shadow-sm
                                    ${study.status === "completed"
                                            ? "bg-green-500/10 border-green-500/20 text-green-400"
                                            : "bg-amber-500/10 border-amber-500/20 text-amber-400"
                                        }`}>
                                        {study.status === "completed"
                                            ? <><CheckCircle size={12} /> {t("badge_completed")}</>
                                            : <><Clock size={12} /> {t("badge_inprogress")}</>
                                        }
                                    </span>
                                </div>

                                <p className="relative z-10 text-xs text-[#CC2200] font-semibold uppercase tracking-[0.2em] mb-3">
                                    {study.institution}
                                </p>

                                <h3 className="relative z-10 font-bold text-[#f0ede8] text-xl leading-snug mb-8 tracking-tight group-hover:text-[#CC2200] transition-colors duration-300">
                                    {study.title}
                                </h3>
                            </div>

                            <div className="relative z-10 flex items-center justify-between mt-auto pt-5 border-t border-white/10 text-xs font-medium text-white/40">
                                <span className="px-3 py-1.5 rounded-lg bg-white/5 text-white/60">
                                    {study.area}
                                </span>
                                <span>{study.year}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
