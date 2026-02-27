"use client";

import { useEffect, useState } from "react";

export function PageLoader() {
    const [visible, setVisible] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        const fadeTimer = setTimeout(() => {
            setFadeOut(true);
            document.body.classList.remove("loading-locked");
        }, 1500);

        const removeTimer = setTimeout(() => setVisible(false), 2100);

        return () => {
            clearTimeout(fadeTimer);
            clearTimeout(removeTimer);
        };
    }, []);

    if (!visible) return null;

    return (
        <div
            className="page-loader-wrap"
            style={{
                position: "fixed",
                inset: 0,
                zIndex: 9999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#000000",
                backdropFilter: "blur(24px)",
                WebkitBackdropFilter: "blur(24px)",
                opacity: fadeOut ? 0 : 1,
                visibility: fadeOut ? "hidden" as const : "visible" as const,
                transition: "opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), visibility 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                pointerEvents: fadeOut ? "none" as const : "auto" as const,
            }}
            aria-label="Cargando"
        >
            <div className="ui-abstergo">
                <div className="abstergo-loader">
                    <div />
                    <div />
                    <div />
                </div>
                <div className="ui-text">
                    Synchronization
                    <div className="ui-dot" />
                    <div className="ui-dot" />
                    <div className="ui-dot" />
                </div>
            </div>
        </div>
    );
}
