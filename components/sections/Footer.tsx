"use client";

import { useTranslations } from "next-intl";
import { Heart, Code2, Github, Linkedin, Twitter, MapPin, Phone, Mail, ChevronRight } from "lucide-react";
import Image from "next/image";

const socialLinks = [
    { name: "GitHub", href: "https://github.com/bismarckbarrios", label: "GitHub profile", icon: Github },
    { name: "LinkedIn", href: "https://linkedin.com/in/bismarckbarrios", label: "LinkedIn profile", icon: Linkedin },
    { name: "Twitter", href: "https://twitter.com/bismarckbarrios", label: "Twitter profile", icon: Twitter },
];

const navLinks = [
    { key: "home", href: "#hero" },
    { key: "about", href: "#about" },
    { key: "experience", href: "#experience" },
    { key: "studies", href: "#studies" },
    { key: "projects", href: "#works" },
    { key: "contact", href: "#contact" },
];

export function Footer() {
    const t = useTranslations("footer");
    const tNav = useTranslations("nav");
    const year = new Date().getFullYear();

    return (
        <footer className="relative pt-24 pb-12 px-6 bg-[#080808] overflow-hidden selection:bg-[#CC2200]/30 font-mono border-t border-[#CC2200]/30">
            {/* Cyberpunk Glows & Scanlines */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#CC2200]/70 to-transparent" />
            <div className="absolute top-0 left-0 w-full h-[1px] bg-[#CC2200] shadow-[0_0_10px_#CC2200,0_0_20px_#CC2200] opacity-50" />

            <div className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-[#CC2200]/[0.06] rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 -left-24 w-[500px] h-[500px] bg-[#CC2200]/[0.04] rounded-full blur-[120px] pointer-events-none" />

            {/* Grid Pattern Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(204,34,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(204,34,0,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">

                    {/* Column 1: Brand & Desc */}
                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <div className="inline-block relative">
                            <Image
                                src="/LOGO.png"
                                alt="Bismarck Barrios Logo"
                                width={220}
                                height={78}
                                className="h-16 md:h-20 w-auto filter drop-shadow-[0_0_15px_rgba(204,34,0,0.5)] transition-all hover:drop-shadow-[0_0_25px_rgba(204,34,0,0.9)]"
                            />
                        </div>
                        <p className="text-white/70 text-sm md:text-base leading-relaxed tracking-wide border-l-2 border-[#CC2200] pl-4 bg-gradient-to-r from-[#CC2200]/10 to-transparent py-2">
                            {t("description")}
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="lg:col-span-2 flex flex-col gap-6">
                        <h3 className="text-[#f0ede8] font-bold text-lg uppercase tracking-widest flex items-center gap-2">
                            <span className="text-[#CC2200] text-xl font-normal">/</span> {t("quick_links")}
                        </h3>
                        <ul className="flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <li key={link.key}>
                                    <a
                                        href={link.href}
                                        className="text-white/60 hover:text-[#f0ede8] hover:bg-[#CC2200]/10 border border-transparent hover:border-[#CC2200]/30 px-2 py-1 -ml-2 text-sm tracking-widest uppercase transition-all flex items-center gap-2 group w-max rounded-sm clip-path-cyber"
                                        style={{ clipPath: "polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))" }}
                                    >
                                        <ChevronRight size={14} className="opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all text-[#CC2200]" />
                                        {tNav(link.key)}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Services */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <h3 className="text-[#f0ede8] font-bold text-lg uppercase tracking-widest flex items-center gap-2">
                            <span className="text-[#CC2200] text-xl font-normal">/</span> {t("services")}
                        </h3>
                        <ul className="flex flex-col gap-4">
                            {[1, 2, 3, 4].map((num) => (
                                <li key={num} className="text-white/60 text-sm tracking-widest uppercase flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-[#CC2200] shadow-[0_0_8px_#CC2200] rotate-45" />
                                    {t(`service_${num}`)}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 4: Contact */}
                    <div className="lg:col-span-3 flex flex-col gap-6">
                        <h3 className="text-[#f0ede8] font-bold text-lg uppercase tracking-widest flex items-center gap-2">
                            <span className="text-[#CC2200] text-xl font-normal">/</span> {t("contact")}
                        </h3>
                        <ul className="flex flex-col gap-5">
                            <li className="flex items-start gap-4">
                                <MapPin size={20} className="text-[#CC2200] mt-0.5 shrink-0 filter drop-shadow-[0_0_5px_rgba(204,34,0,0.8)]" />
                                <span className="text-white/70 text-sm tracking-wider uppercase">{t("location")}</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <Phone size={20} className="text-[#CC2200] mt-0.5 shrink-0 filter drop-shadow-[0_0_5px_rgba(204,34,0,0.8)]" />
                                <span className="text-white/70 text-sm tracking-wider uppercase font-sans font-medium">{t("phone")}</span>
                            </li>
                            <li className="flex items-start gap-4">
                                <Mail size={20} className="text-[#CC2200] mt-0.5 shrink-0 filter drop-shadow-[0_0_5px_rgba(204,34,0,0.8)]" />
                                <a href="mailto:bismarckabarrios@gmail.com" className="text-white/70 hover:text-[#CC2200] hover:underline underline-offset-4 text-sm tracking-wider transition-colors break-all font-sans font-medium">
                                    {t("email")}
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Separator Line */}
                <div className="relative h-px w-full bg-gradient-to-r from-transparent via-[#CC2200]/40 to-transparent mb-8">
                    {/* Tech details on line */}
                    <div className="absolute left-1/2 -top-1.5 -translate-x-1/2 bg-[#080808] px-4 text-[#CC2200] text-[10px] tracking-[0.3em]">
                        SYS.V.1.0 // {year}
                    </div>
                </div>

                {/* Bottom Bar: Copyright, Made With, Socials */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Copyright */}
                    <div className="flex items-center gap-2 text-center md:text-left">
                        <span className="text-white/40 text-xs md:text-sm font-medium tracking-widest uppercase flex items-center gap-1.5">
                            © {year}
                            <Image src="/LOGO.png" alt="Bismarck Barrios" width={60} height={20} className="h-3 md:h-[14px] w-auto inline-block filter brightness-125" />
                            {t("rights")}
                        </span>
                    </div>



                    {/* Social networks - Red icons, Cyberpunk style */}
                    <div className="flex items-center gap-8">
                        {socialLinks.map((l) => {
                            const Icon = l.icon;
                            return (
                                <a
                                    key={l.name}
                                    href={l.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={l.label}
                                    className="group relative p-1"
                                >
                                    {/* Red glowing backdrop on hover */}
                                    <div className="absolute inset-0 bg-[#CC2200]/0 group-hover:bg-[#CC2200]/30 blur-lg transition-all duration-300 rounded-full scale-150" />
                                    <Icon
                                        size={24}
                                        className="relative text-[#CC2200] group-hover:text-[#FF3300] transition-colors duration-300 filter drop-shadow-[0_0_8px_rgba(204,34,0,0.6)] group-hover:drop-shadow-[0_0_15px_rgba(255,51,0,1)] group-hover:-translate-y-1 transform"
                                    />
                                </a>
                            );
                        })}
                    </div>
                </div>
            </div>
        </footer>
    );
}
