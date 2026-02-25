"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { GlitchAsciiImage } from "@/components/ui/GlitchAsciiImage";

const stats = [
    { key: "badge_experience", value: 3 },
    { key: "badge_projects", value: 12 },
    { key: "badge_technologies", value: 15 },
] as const;

export function AboutSection() {
    const t = useTranslations("about");
    const sectionRef = useRef<HTMLElement>(null);
    const imgRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const countersRef = useRef<(HTMLSpanElement | null)[]>([]);

    useEffect(() => {
        const init = async () => {
            const { gsap, ScrollTrigger } = await import("@/lib/gsap-config");

            if (!sectionRef.current) return;

            // Parallax on the image
            if (imgRef.current) {
                gsap.to(imgRef.current, {
                    yPercent: -12,
                    ease: "none",
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    },
                });
            }

            // Text reveal animations
            if (textRef.current) {
                const elements = textRef.current.querySelectorAll(".animate-text");
                gsap.set(elements, { y: 40, opacity: 0, filter: "blur(10px)" });

                ScrollTrigger.create({
                    trigger: sectionRef.current,
                    start: "top 65%",
                    onEnter: () => {
                        gsap.to(elements, {
                            y: 0,
                            opacity: 1,
                            filter: "blur(0px)",
                            stagger: 0.12,
                            duration: 1,
                            ease: "power3.out",
                        });
                    },
                    once: true,
                });
            }

            // Stats counter animation — lightweight text-based approach
            if (statsRef.current) {
                const statCards = statsRef.current.querySelectorAll(".cyber-stat");
                gsap.set(statCards, { y: 25, opacity: 0, filter: "blur(6px)" });

                ScrollTrigger.create({
                    trigger: statsRef.current,
                    start: "top 80%",
                    onEnter: () => {
                        // Fade in the stat cards
                        gsap.to(statCards, {
                            y: 0,
                            opacity: 1,
                            filter: "blur(0px)",
                            stagger: 0.1,
                            duration: 0.8,
                            ease: "power3.out",
                        });

                        // Animate each counter: just update textContent each frame
                        countersRef.current.forEach((el, i) => {
                            if (!el) return;
                            const target = stats[i].value;
                            const counter = { value: 0 };

                            gsap.to(counter, {
                                value: target,
                                duration: 2.5 + (i * 0.6),
                                ease: "power2.out",
                                snap: { value: 1 },
                                onUpdate: () => {
                                    el.textContent = String(Math.round(counter.value));
                                },
                            });
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
            id="about"
            ref={sectionRef}
            className="relative py-32 px-4 sm:px-6 overflow-hidden bg-[#080808] selection:bg-[#CC2200]/30"
        >
            <style jsx>{`
                /* ── Cyberpunk About Styles ── */

                .about-grid-bg {
                    position: absolute;
                    inset: 0;
                    background-image:
                        linear-gradient(rgba(204, 34, 0, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(204, 34, 0, 0.03) 1px, transparent 1px);
                    background-size: 60px 60px;
                    mask-image: radial-gradient(ellipse at center, black 20%, transparent 70%);
                    pointer-events: none;
                }

                .cyber-section-tag {
                    font-family: 'Space Mono', monospace;
                    font-size: 0.85rem;
                    letter-spacing: 0.35em;
                    color: #CC2200;
                    text-transform: uppercase;
                    position: relative;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .cyber-section-tag::before {
                    content: '';
                    width: 40px;
                    height: 1px;
                    background: linear-gradient(to right, #CC2200, transparent);
                }

                .hook-title {
                    font-family: 'Space Mono', monospace;
                    font-size: clamp(1.2rem, 2.5vw, 1.8rem);
                    font-weight: 700;
                    line-height: 1.15;
                    color: #f0ede8;
                    text-transform: uppercase;
                    letter-spacing: -0.02em;
                }
                .hook-accent {
                    background: linear-gradient(135deg, #CC2200, #ff4422, #CC2200);
                    background-clip: text;
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    text-shadow: none;
                }

                .cyber-role-tag {
                    font-family: 'Space Mono', monospace;
                    font-size: 0.65rem;
                    letter-spacing: 0.25em;
                    color: rgba(204, 34, 0, 0.6);
                    padding: 0.4rem 1rem;
                    border: 1px solid rgba(204, 34, 0, 0.15);
                    clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
                    display: inline-block;
                    margin-top: 1rem;
                }

                .cyber-bio {
                    font-size: 0.95rem;
                    line-height: 1.8;
                    color: rgba(255, 255, 255, 0.45);
                    font-weight: 300;
                    max-width: 540px;
                }
                .cyber-bio strong {
                    color: rgba(255, 255, 255, 0.7);
                    font-weight: 500;
                }


                /* ── Specialty Cards ── */
                .specialties-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 0;
                }
                @media (max-width: 640px) {
                    .specialties-grid {
                        grid-template-columns: 1fr;
                    }
                }
                .specialty-card {
                    padding: 1.25rem 1rem;
                    border: 1px solid rgba(204, 34, 0, 0.08);
                    position: relative;
                    overflow: hidden;
                    transition: all 0.4s ease;
                    cursor: default;
                }
                .specialty-card:hover {
                    background: rgba(204, 34, 0, 0.03);
                    border-color: rgba(204, 34, 0, 0.2);
                }
                .specialty-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 3px; height: 0;
                    background: #CC2200;
                    transition: height 0.4s ease;
                }
                .specialty-card:hover::before {
                    height: 100%;
                }
                .specialty-title {
                    font-family: 'Space Mono', monospace;
                    font-size: 0.7rem;
                    letter-spacing: 0.2em;
                    color: #CC2200;
                    margin-bottom: 0.35rem;
                }
                .specialty-desc {
                    font-family: 'Space Mono', monospace;
                    font-size: 0.65rem;
                    color: rgba(255, 255, 255, 0.35);
                    letter-spacing: 0.05em;
                }

                /* ── Cyber Stats ── */
                .cyber-stat {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem 1rem;
                    position: relative;
                    overflow: hidden;
                    background: rgba(204, 34, 0, 0.02);
                    border: 1px solid rgba(204, 34, 0, 0.08);
                    clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
                    transition: all 0.4s ease;
                }
                .cyber-stat:hover {
                    background: rgba(204, 34, 0, 0.05);
                    border-color: rgba(204, 34, 0, 0.25);
                    box-shadow: 0 0 25px rgba(204, 34, 0, 0.08);
                }
                .stat-value {
                    font-family: 'Space Mono', monospace;
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #f0ede8;
                    line-height: 1;
                }
                .stat-plus {
                    color: #CC2200;
                    font-size: 1.5rem;
                    margin-left: 2px;
                }
                .stat-label {
                    font-family: 'Space Mono', monospace;
                    font-size: 0.55rem;
                    color: rgba(255, 255, 255, 0.35);
                    text-transform: uppercase;
                    letter-spacing: 0.2em;
                    margin-top: 0.5rem;
                    text-align: center;
                }

                /* ── Quote ── */
                .cyber-quote {
                    font-family: 'Space Mono', monospace;
                    font-size: 0.75rem;
                    color: rgba(204, 34, 0, 0.4);
                    letter-spacing: 0.1em;
                    text-align: center;
                    padding: 1.5rem 0;
                    border-top: 1px solid rgba(204, 34, 0, 0.08);
                    margin-top: 2rem;
                    position: relative;
                }
                .cyber-quote::before {
                    content: '< ';
                    color: rgba(204, 34, 0, 0.2);
                }
                .cyber-quote::after {
                    content: ' />';
                    color: rgba(204, 34, 0, 0.2);
                }

                /* ── Decorative Lines ── */
                .h-line {
                    width: 100%;
                    height: 1px;
                    background: linear-gradient(to right, rgba(204, 34, 0, 0.15), transparent 50%);
                }
                .v-line {
                    position: absolute;
                    width: 1px;
                    height: 100%;
                    background: linear-gradient(to bottom, transparent, rgba(204, 34, 0, 0.08) 30%, rgba(204, 34, 0, 0.08) 70%, transparent);
                }
            `}</style>

            {/* Grid background */}
            <div className="about-grid-bg" />

            {/* Ambient glows */}
            <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#CC2200]/[0.02] rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#7a1500]/[0.02] rounded-full blur-[100px] pointer-events-none" />

            {/* Top separator */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-px bg-gradient-to-r from-transparent via-[#CC2200]/15 to-transparent" />

            <div className="relative z-10 max-w-7xl mx-auto" ref={textRef}>
                <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
                    <div ref={imgRef} className="flex flex-col items-center md:items-start w-full max-w-[540px] mx-auto md:mx-0">
                        <GlitchAsciiImage title={t("section_label")} />
                    </div>

                    {/* ═══ RIGHT — Content ═══ */}
                    <div className="flex flex-col gap-8">
                        {/* Hook Title */}
                        <div>
                            <h2 className="animate-text hook-title">
                                {t("hook_line")}
                                <br />
                                <span className="hook-accent">{t("hook_accent")}</span>
                            </h2>
                            <div className="animate-text cyber-role-tag">
                                {t("role")}
                            </div>
                        </div>

                        {/* Separator */}
                        <div className="animate-text h-line" />

                        {/* Bio paragraphs */}
                        <div className="space-y-5">
                            <p className="animate-text cyber-bio">{t("p1")}</p>
                            <p className="animate-text cyber-bio">{t("p2")}</p>
                            <p className="animate-text cyber-bio">{t("p3")}</p>
                        </div>

                        {/* Specialty Cards */}
                        <div className="animate-text specialties-grid">
                            <div className="specialty-card">
                                <div className="specialty-title">{t("specialty_1_title")}</div>
                                <div className="specialty-desc">{t("specialty_1_desc")}</div>
                            </div>
                            <div className="specialty-card">
                                <div className="specialty-title">{t("specialty_2_title")}</div>
                                <div className="specialty-desc">{t("specialty_2_desc")}</div>
                            </div>
                            <div className="specialty-card">
                                <div className="specialty-title">{t("specialty_3_title")}</div>
                                <div className="specialty-desc">{t("specialty_3_desc")}</div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div ref={statsRef} className="flex flex-wrap gap-4 mt-2">
                            {stats.map(({ key, value }, i) => (
                                <div key={key} className="cyber-stat flex-1 min-w-[120px]">
                                    <span className="stat-value">
                                        <span ref={(el) => { countersRef.current[i] = el; }}>0</span>
                                        <span className="stat-plus">+</span>
                                    </span>
                                    <span className="stat-label">{t(key)}</span>
                                </div>
                            ))}
                        </div>

                        {/* Quote */}
                        <div className="animate-text cyber-quote">
                            {t("quote")}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
