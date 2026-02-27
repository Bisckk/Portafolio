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
    );
}
