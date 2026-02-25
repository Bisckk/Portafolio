"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/lib/routing";
import { useTransition } from "react";

export function LanguageToggle() {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending, startTransition] = useTransition();

    const switchLocale = (next: string) => {
        startTransition(() => {
            router.replace(pathname, { locale: next });
        });
    };

    const isES = locale === "es";
    const isEN = locale === "en";

    return (
        <>
            <style>{`
                .lang-toggle {
                    display: flex;
                    align-items: center;
                    gap: 0;
                    border: 1px solid rgba(204, 34, 0, 0.25);
                    background: rgba(204, 34, 0, 0.04);
                    padding: 2px;
                    font-family: 'Space Mono', monospace;
                    clip-path: polygon(0 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 5px 100%, 0 calc(100% - 5px));
                }
                .lang-btn {
                    padding: 0.3rem 0.6rem;
                    font-size: 0.6rem;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    background: transparent;
                    color: rgba(240, 237, 232, 0.35);
                    font-family: 'Space Mono', monospace;
                }
                .lang-btn:hover:not(:disabled) {
                    color: rgba(240, 237, 232, 0.7);
                }
                .lang-btn.active {
                    background: #CC2200;
                    color: #f0ede8;
                    box-shadow: 0 0 10px rgba(204, 34, 0, 0.3);
                }
                .lang-btn:disabled {
                    cursor: default;
                }
                .lang-divider {
                    width: 1px;
                    height: 14px;
                    background: rgba(204, 34, 0, 0.25);
                }
            `}</style>
            <div
                className="lang-toggle"
                role="group"
                aria-label="Language selector"
            >
                <button
                    onClick={() => switchLocale("es")}
                    disabled={isPending || isES}
                    aria-pressed={isES}
                    className={`lang-btn ${isES ? "active" : ""}`}
                >
                    ES
                </button>
                <div className="lang-divider" />
                <button
                    onClick={() => switchLocale("en")}
                    disabled={isPending || isEN}
                    aria-pressed={isEN}
                    className={`lang-btn ${isEN ? "active" : ""}`}
                >
                    EN
                </button>
            </div>
        </>
    );
}
