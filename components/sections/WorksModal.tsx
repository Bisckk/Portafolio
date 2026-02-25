"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Modal } from "@/components/ui/Modal";
import { projects } from "@/lib/data";
import type { ProjectCategory } from "@/lib/data";
import { ExternalLink, Github } from "lucide-react";

const CATEGORIES: ProjectCategory[] = ["All", "Web", "Mobile", "UI/UX"];

export function WorksModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const t = useTranslations("works");
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
                        className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
              ${active === cat
                                ? "bg-blue-500 border-blue-500 text-white"
                                : "border-white/15 text-white/50 hover:text-white hover:border-white/30"
                            }`}
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
                        className="group rounded-xl border border-white/8 overflow-hidden
              bg-white/3 hover:border-blue-500/30 hover:bg-blue-500/5
              transition-all duration-300"
                    >
                        {/* Thumbnail */}
                        <div className="relative h-44 bg-gradient-to-br from-blue-900/40 to-purple-900/40 overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-4xl font-bold text-white/10 select-none">
                                    {proj.title[0]}
                                </span>
                            </div>
                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            <div className="flex items-start justify-between gap-2 mb-2">
                                <h3 className="font-semibold text-white text-sm leading-tight">{proj.title}</h3>
                                <span className="text-xs px-2 py-0.5 rounded-full border border-white/10
                  bg-white/5 text-white/40 shrink-0">
                                    {proj.category}
                                </span>
                            </div>
                            <p className="text-xs text-white/50 leading-relaxed mb-4">{proj.description}</p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 mb-4">
                                {proj.tags.slice(0, 4).map((tag) => (
                                    <span key={tag}
                                        className="px-2 py-0.5 text-xs rounded-md bg-blue-500/10
                      border border-blue-500/20 text-blue-300/80">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Links */}
                            <div className="flex gap-3">
                                {proj.github && (
                                    <a href={proj.github} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs text-white/50
                      hover:text-white transition-colors"
                                        aria-label={`View ${proj.title} source code`}
                                    >
                                        <Github size={13} />
                                        {t("view_code")}
                                    </a>
                                )}
                                {proj.demo && (
                                    <a href={proj.demo} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-1.5 text-xs text-blue-400
                      hover:text-blue-300 transition-colors"
                                        aria-label={`View ${proj.title} live demo`}
                                    >
                                        <ExternalLink size={13} />
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
