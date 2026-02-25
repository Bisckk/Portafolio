"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import { scrollTo } from "@/hooks/useLenis";
import Image from "next/image";

const navLinks = [
    { key: "home", href: "#hero" },
    { key: "about", href: "#about" },
    { key: "experience", href: "#experience" },
    { key: "studies", href: "#studies" },
    { key: "projects", href: "#works" },
    { key: "contact", href: "#works" },
] as const;

export function Navbar() {
    const t = useTranslations("nav");
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState("home");
    const [scrolled, setScrolled] = useState(false);
    const indicatorRef = useRef<HTMLDivElement>(null);
    const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
    const linksContainerRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLElement>(null);
    // Track which link the user explicitly clicked (to handle shared sections)
    const clickedLinkRef = useRef<string | null>(null);
    // Block scroll detection during programmatic scroll animations
    const isScrollingRef = useRef(false);
    const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Scroll to top on mount (fixes refresh showing wrong section) ──
    useEffect(() => {
        if (typeof window !== "undefined") {
            window.history.scrollRestoration = "manual";
            window.scrollTo(0, 0);
        }
    }, []);

    // ── Scroll detection (background blur) ──
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    // ── Active-link indicator ──
    const updateIndicator = () => {
        const idx = navLinks.findIndex((l) => l.key === activeLink);
        const el = linksRef.current[idx];
        const ind = indicatorRef.current;
        const container = linksContainerRef.current;
        if (el && ind && container) {
            const rect = el.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            ind.style.left = `${rect.left - containerRect.left}px`;
            ind.style.width = `${rect.width}px`;
        }
    };

    useEffect(() => {
        updateIndicator();
        // Recalculate on resize
        window.addEventListener("resize", updateIndicator);
        return () => window.removeEventListener("resize", updateIndicator);
    }, [activeLink]);

    // Ensure indicator positions correctly after first render
    useEffect(() => {
        const timer = setTimeout(updateIndicator, 100);
        return () => clearTimeout(timer);
    }, []);

    // ── Detect active section by scroll position ──
    useEffect(() => {
        const onScroll = () => {
            // Skip detection during programmatic scroll
            if (isScrollingRef.current) return;

            const scrollY = window.scrollY;
            const viewportH = window.innerHeight;

            // If near the very top, always highlight "home"
            if (scrollY < viewportH * 0.3) {
                setActiveLink("home");
                clickedLinkRef.current = null;
                return;
            }

            // Find which section is closest to the top
            let closestHref = "";
            let closestDist = Infinity;

            // Use a Set to check each unique href only once
            const checked = new Set<string>();
            navLinks.forEach(({ href }) => {
                if (checked.has(href)) return;
                checked.add(href);
                const el = document.querySelector(href);
                if (!el) return;
                const rect = el.getBoundingClientRect();
                const dist = Math.abs(rect.top - 72);
                if (dist < closestDist) {
                    closestDist = dist;
                    closestHref = href;
                }
            });

            // Find the nav link key for the closest section
            const currentLink = navLinks.find((l) => l.key === activeLink);
            const currentHref = currentLink?.href;

            // If the closest section is the same as current, don't override
            // (this preserves the user's click choice between projects/contact)
            if (closestHref === currentHref) return;

            // If user clicked a specific link that shares this href, use that
            if (clickedLinkRef.current) {
                const clicked = navLinks.find((l) => l.key === clickedLinkRef.current);
                if (clicked && clicked.href === closestHref) {
                    setActiveLink(clickedLinkRef.current);
                    return;
                }
            }

            // Otherwise, use the first link that matches this href
            const match = navLinks.find((l) => l.href === closestHref);
            if (match) {
                setActiveLink(match.key);
                clickedLinkRef.current = null;
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll(); // run once on mount
        return () => window.removeEventListener("scroll", onScroll);
    }, [activeLink]);

    const handleNav = (key: string, href: string) => {
        setIsOpen(false);
        clickedLinkRef.current = key;
        setActiveLink(key);

        // Block scroll detection during the animation
        isScrollingRef.current = true;
        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);

        const target = document.querySelector(href);
        if (target) {
            scrollTo(target as HTMLElement);
        } else if (href === "#hero") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }

        // Unblock after animation completes (~1.2s for Lenis smooth scroll)
        scrollTimerRef.current = setTimeout(() => {
            isScrollingRef.current = false;
        }, 1200);
    };

    return (
        <>
            {/* ── Styles ── */}
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Unbounded:wght@400;700;900&family=Space+Mono&display=swap');

                .cyber-nav {
                    position: fixed;
                    top: 0; left: 0; right: 0;
                    z-index: 50;
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                    font-family: 'Space Mono', monospace;
                }
                .cyber-nav.scrolled {
                    background: rgba(8, 8, 8, 0.88);
                    backdrop-filter: blur(20px) saturate(1.6);
                    -webkit-backdrop-filter: blur(20px) saturate(1.6);
                    border-bottom: 1px solid rgba(204, 34, 0, 0.15);
                }
                .cyber-nav.transparent {
                    background: transparent;
                }

                .cyber-nav-inner {
                    max-width: 1400px;
                    margin: 0 auto;
                    padding: 0 clamp(1.5rem, 4vw, 3rem);
                    height: 4.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }

                /* ── Logo ── */
                .cyber-logo {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    text-decoration: none;
                    position: relative;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .cyber-logo:hover {
                    filter: drop-shadow(0 0 8px rgba(204, 34, 0, 0.5));
                }
                .cyber-logo img {
                    height: 28px;
                    width: auto;
                    filter: brightness(1) invert(0);
                    transition: filter 0.3s ease;
                }
                .cyber-logo:hover img {
                    filter: brightness(1) drop-shadow(0 0 4px rgba(204, 34, 0, 0.6));
                }
                .cyber-logo::after {
                    content: '';
                    position: absolute;
                    bottom: -4px;
                    left: 0;
                    width: 100%;
                    height: 1px;
                    background: linear-gradient(to right, #CC2200, transparent);
                    opacity: 0;
                    transition: opacity 0.3s ease;
                }
                .cyber-logo:hover::after {
                    opacity: 1;
                }

                /* ── Desktop Links ── */
                .cyber-links {
                    display: none;
                    align-items: center;
                    gap: 0;
                    position: relative;
                }
                @media (min-width: 768px) {
                    .cyber-links { display: flex; }
                }

                .cyber-link {
                    position: relative;
                    padding: 0.5rem 1rem;
                    font-size: 0.7rem;
                    font-weight: 500;
                    letter-spacing: 0.12em;
                    text-transform: uppercase;
                    text-decoration: none;
                    color: rgba(240, 237, 232, 0.35);
                    transition: all 0.3s ease;
                    cursor: pointer;
                    border: none;
                    background: none;
                }
                .cyber-link:hover {
                    color: rgba(240, 237, 232, 0.8);
                }
                .cyber-link.active {
                    color: #f0ede8;
                }

                /* ── Active Indicator (red line) ── */
                .cyber-indicator {
                    position: absolute;
                    bottom: -2px;
                    height: 2px;
                    background: #CC2200;
                    box-shadow: 0 0 10px rgba(204, 34, 0, 0.6), 0 0 20px rgba(204, 34, 0, 0.2);
                    border-radius: 1px;
                    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                    pointer-events: none;
                }

                /* ── Right Controls ── */
                .cyber-controls {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }

                /* ── Hamburger ── */
                .cyber-hamburger {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 2.5rem;
                    height: 2.5rem;
                    border: 1px solid rgba(204, 34, 0, 0.3);
                    background: rgba(204, 34, 0, 0.05);
                    color: #f0ede8;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    clip-path: polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px));
                }
                @media (min-width: 768px) {
                    .cyber-hamburger { display: none; }
                }
                .cyber-hamburger:hover {
                    background: rgba(204, 34, 0, 0.15);
                    border-color: rgba(204, 34, 0, 0.6);
                    box-shadow: 0 0 12px rgba(204, 34, 0, 0.2);
                }

                /* ── Mobile Overlay ── */
                .mobile-overlay {
                    position: fixed;
                    inset: 0;
                    z-index: 40;
                    opacity: 0;
                    pointer-events: none;
                    transition: opacity 0.3s ease;
                }
                .mobile-overlay.open {
                    opacity: 1;
                    pointer-events: auto;
                }
                .mobile-backdrop {
                    position: absolute;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.75);
                    backdrop-filter: blur(4px);
                }
                .mobile-drawer {
                    position: absolute;
                    top: 0; right: 0;
                    height: 100%;
                    width: 280px;
                    background: rgba(8, 8, 8, 0.97);
                    border-left: 1px solid rgba(204, 34, 0, 0.2);
                    transform: translateX(100%);
                    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
                    display: flex;
                    flex-direction: column;
                    padding: 5rem 1.5rem 2rem;
                    gap: 0.25rem;
                }
                .mobile-overlay.open .mobile-drawer {
                    transform: translateX(0);
                }

                /* ── Mobile drawer accent line ── */
                .mobile-drawer::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0;
                    width: 1px;
                    height: 100%;
                    background: linear-gradient(to bottom, #CC2200, transparent 60%);
                }

                /* ── Mobile Link ── */
                .mobile-link {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                    padding: 0.85rem 1rem;
                    font-family: 'Space Mono', monospace;
                    font-size: 0.72rem;
                    letter-spacing: 0.15em;
                    text-transform: uppercase;
                    text-decoration: none;
                    color: rgba(240, 237, 232, 0.4);
                    border: 1px solid transparent;
                    transition: all 0.3s ease;
                    cursor: pointer;
                    background: none;
                    position: relative;
                    clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
                }
                .mobile-link:hover {
                    color: #f0ede8;
                    background: rgba(204, 34, 0, 0.06);
                    border-color: rgba(204, 34, 0, 0.15);
                }
                .mobile-link.active {
                    color: #f0ede8;
                    background: rgba(204, 34, 0, 0.1);
                    border-color: rgba(204, 34, 0, 0.3);
                    box-shadow: inset 0 0 20px rgba(204, 34, 0, 0.05);
                }
                .mobile-link-index {
                    font-size: 0.55rem;
                    color: rgba(204, 34, 0, 0.5);
                    font-family: 'Space Mono', monospace;
                    min-width: 1.5rem;
                }
                .mobile-link.active .mobile-link-index {
                    color: #CC2200;
                }

                /* ── Scanline decoration ── */
                .nav-scanline {
                    position: absolute;
                    bottom: 0; left: 0;
                    width: 100%; height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(204, 34, 0, 0.15), transparent);
                }

                @media (min-width: 768px) {
                    .mobile-overlay { display: none; }
                }
            `}</style>

            {/* ── Navbar ── */}
            <nav
                ref={navRef}
                className={`cyber-nav ${scrolled ? "scrolled" : "transparent"}`}
            >
                <div className="cyber-nav-inner">
                    {/* Logo */}
                    <a
                        href="#hero"
                        onClick={(e) => { e.preventDefault(); handleNav("home", "#hero"); }}
                        className="cyber-logo"
                        aria-label="Bismarck Barrios - Portfolio"
                    >
                        <Image
                            src="/LOGO.png"
                            alt="BK Logo"
                            width={80}
                            height={28}
                            style={{ height: '28px', width: 'auto' }}
                            priority
                        />
                    </a>

                    {/* Desktop Links */}
                    <div className="cyber-links" ref={linksContainerRef}>
                        <div
                            ref={indicatorRef}
                            className="cyber-indicator"
                            style={{ left: 0, width: 0 }}
                            aria-hidden="true"
                        />
                        {navLinks.map(({ key, href }, i) => (
                            <a
                                key={key}
                                href={href}
                                ref={(el) => { linksRef.current[i] = el; }}
                                onClick={(e) => { e.preventDefault(); handleNav(key, href); }}
                                aria-current={activeLink === key ? "page" : undefined}
                                className={`cyber-link ${activeLink === key ? "active" : ""}`}
                            >
                                {t(key)}
                            </a>
                        ))}
                    </div>

                    {/* Right Controls */}
                    <div className="cyber-controls">
                        <LanguageToggle />
                        <button
                            className="cyber-hamburger"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label={isOpen ? "Close menu" : "Open menu"}
                            aria-expanded={isOpen}
                        >
                            {isOpen ? <X size={16} /> : <Menu size={16} />}
                        </button>
                    </div>
                </div>
                <div className="nav-scanline" aria-hidden="true" />
            </nav>

            {/* Mobile Drawer */}
            <div className={`mobile-overlay ${isOpen ? "open" : ""}`}>
                <div
                    className="mobile-backdrop"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
                <div className="mobile-drawer">
                    {navLinks.map(({ key, href }, i) => (
                        <a
                            key={key}
                            href={href}
                            onClick={(e) => { e.preventDefault(); handleNav(key, href); }}
                            className={`mobile-link ${activeLink === key ? "active" : ""}`}
                        >
                            <span className="mobile-link-index">0{i + 1}</span>
                            {t(key)}
                        </a>
                    ))}
                </div>
            </div>
        </>
    );
}
