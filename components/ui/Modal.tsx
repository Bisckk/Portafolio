"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    size?: "md" | "lg" | "xl" | "full";
}

const sizeClasses = {
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-7xl",
};

export function Modal({ isOpen, onClose, title, children, size = "lg" }: ModalProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Animate in/out with GSAP
    useEffect(() => {
        const animate = async () => {
            const { gsap } = await import("@/lib/gsap-config");
            if (isOpen) {
                document.body.style.overflow = "hidden";
                if (overlayRef.current) {
                    gsap.fromTo(
                        overlayRef.current,
                        { opacity: 0 },
                        { opacity: 1, duration: 0.3, ease: "power2.out" }
                    );
                }
                if (contentRef.current) {
                    gsap.fromTo(
                        contentRef.current,
                        { scale: 0.9, opacity: 0, y: 30 },
                        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.2)" }
                    );
                }
            } else {
                document.body.style.overflow = "";
            }
        };
        animate();
    }, [isOpen]);

    // Keyboard close
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={title}
            data-lenis-prevent="true"
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/70 backdrop-blur-md"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal Content */}
            <div
                ref={contentRef}
                className={`relative w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto
          bg-[#0d0d0d]/95 backdrop-blur-xl border-t-4 border-[#CC2200] border-l border-r border-b border-white/10
          rounded-none shadow-[0_0_50px_rgba(0,0,0,0.8)]`}
                style={{ clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%)" }}
            >
                {/* Header */}
                {title && (
                    <div className="sticky top-0 z-10 flex items-center justify-between
            p-6 border-b border-[#CC2200]/20 bg-[#0d0d0d]/90 backdrop-blur-md">
                        <h2 className="text-xl font-mono font-bold uppercase tracking-widest text-[#f0ede8]">
                            &gt;_ {title}
                        </h2>
                        <button
                            onClick={onClose}
                            aria-label="Close modal"
                            className="w-10 h-10 flex items-center justify-center rounded-none
                text-[#CC2200] hover:text-white hover:bg-[#CC2200] border border-transparent hover:border-[#CC2200]/50
                transition-all duration-200 focus-visible:outline-none"
                        >
                            <X size={16} />
                        </button>
                    </div>
                )}

                {/* Body */}
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}
