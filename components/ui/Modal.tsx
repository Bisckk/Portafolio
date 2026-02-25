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
          bg-black/90 dark:bg-black/90 border border-white/10
          rounded-2xl shadow-2xl shadow-black/50`}
            >
                {/* Header */}
                {title && (
                    <div className="sticky top-0 z-10 flex items-center justify-between
            p-6 border-b border-white/10 bg-black/80 backdrop-blur-sm rounded-t-2xl">
                        <h2 className="text-xl font-semibold text-white">{title}</h2>
                        <button
                            onClick={onClose}
                            aria-label="Close modal"
                            className="w-8 h-8 flex items-center justify-center rounded-full
                text-white/60 hover:text-white hover:bg-white/10
                transition-all duration-200 focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-blue-500"
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
