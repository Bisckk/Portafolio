"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { LanguageToggle } from "./LanguageToggle";
import { scrollTo } from "@/hooks/useLenis";
import Image from "next/image";
import "./Navbar.css";

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
