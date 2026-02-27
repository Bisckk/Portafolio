"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { projects } from "@/lib/data";
import type { ProjectCategory } from "@/lib/data";
import { ExternalLink, Github } from "lucide-react";

const CATEGORIES: ProjectCategory[] = ["All", "Web", "Mobile", "UI/UX"];

export function WorksModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const t = useTranslations("works");
    const locale = useLocale();
    const isEn = locale === "en";
    const [active, setActive] = useState<ProjectCategory>("All");

    const filtered = active === "All" ? projects : projects.filter((p) => p.category === active);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={t("modal_title")} size="full">
            {/* Category filters */}
            <div className="flex flex-wrap gap-2 mb-8">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActive(cat)}
                        className={`px-4 py-2 text-xs font-mono font-bold uppercase tracking-widest border transition-all duration-200
              focus-visible:outline-none focus-visible:border-[#CC2200]
              ${active === cat
                                ? "bg-[#CC2200] border-[#CC2200] text-white shadow-[0_0_15px_rgba(204,34,0,0.4)]"
                                : "bg-transparent border-white/10 text-white/50 hover:text-white hover:border-[#CC2200]/50 hover:bg-[#CC2200]/10"
                            }`}
                        style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)" }}
                    >
                        {cat === "All" ? t("filter_all") : cat === "Web" ? t("filter_web") : cat === "Mobile" ? t("filter_mobile") : t("filter_ui")}
                    </button>
                ))}
            </div>

            {/* Project grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((proj) => (
                    <div
                        key={proj.id}
                        className="group relative border border-white/10 overflow-hidden
              bg-[#0a0a0a] hover:border-[#CC2200]/50 hover:shadow-[0_0_20px_rgba(204,34,0,0.15)]
              transition-all duration-300 flex flex-col"
                        style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%)" }}
                    >
                        {/* Thumbnail */}
                        <div className="relative h-44 bg-[#0d0d0d] overflow-hidden border-b border-[#CC2200]/20">
                            {/* Static scanlines */}
                            <div className="absolute inset-0 z-10 bg-[linear-gradient(rgba(204,34,0,0.05)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none opacity-30" />

                            {/* Real Image */}
                            <Image
                                src={proj.image}
                                alt={proj.title}
                                fill
                                className="object-cover object-top opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                            />

                            {/* Hover overlay */}
                            <div className="absolute inset-0 z-20 bg-[#CC2200]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        </div>

                        {/* Content */}
                        <div className="p-5 flex-1 flex flex-col">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-bold text-[#f0ede8] text-base leading-tight font-mono tracking-tight uppercase group-hover:text-[#CC2200] transition-colors">{proj.title}</h3>
                                <span className="text-[10px] px-2 py-0.5 rounded-none border border-[#CC2200]/30 font-mono font-bold uppercase
                  bg-[#CC2200]/10 text-[#CC2200] shrink-0 tracking-widest">
                                    {proj.category}
                                </span>
                            </div>
                            <p className="text-xs text-white/50 leading-relaxed mb-4 font-mono">&gt; {isEn ? proj.descriptionEn : proj.description}</p>

                            <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
                                {proj.tags.slice(0, 4).map((tag) => (
                                    <span key={tag}
                                        className="px-2 py-1 text-[10px] rounded-sm bg-white/5 font-mono uppercase font-bold
                      border border-white/10 text-white/60 group-hover:border-[#CC2200]/30 group-hover:text-[#f0ede8]">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex gap-4 pt-4 border-t border-white/10">
                                {proj.github && (
                                    <a href={proj.github} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-[11px] text-white/50 font-mono uppercase font-bold tracking-widest
                      hover:text-[#CC2200] transition-colors"
                                        aria-label={`View ${proj.title} source code`}
                                    >
                                        <Github size={14} />
                                        {t("view_code")}
                                    </a>
                                )}
                                {proj.demo && (
                                    <a href={proj.demo} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-[11px] text-[#CC2200] font-mono uppercase font-bold tracking-widest
                      hover:text-[#FF3300] transition-colors"
                                        aria-label={`View ${proj.title} live demo`}
                                    >
                                        <ExternalLink size={14} />
                                        {t("view_demo")}
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </Modal>
    );
}
