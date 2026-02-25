import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { routing } from "@/lib/routing";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { Navbar } from "@/components/ui/Navbar";
import { PageLoader } from "@/components/ui/PageLoader";
import "@/app/globals.css";
import type { Metadata } from "next";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

export const metadata: Metadata = {
    title: "Bismarck Barrios — Frontend Developer",
    description:
        "Portfolio profesional de Bismarck Barrios, Frontend Developer especializado en React, Next.js, TypeScript, GSAP y Three.js.",
    keywords: ["Frontend Developer", "React", "Next.js", "TypeScript", "GSAP", "Three.js", "Portfolio"],
    authors: [{ name: "Bismarck Barrios" }],
    creator: "Bismarck Barrios",
    icons: {
        icon: { url: "/favicon.png", sizes: "64x64", type: "image/png" },
    },
    openGraph: {
        type: "website",
        locale: "es_ES",
        url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://bismarckbarrios.dev",
        title: "Bismarck Barrios — Frontend Developer",
        description: "Portfolio profesional de Bismarck Barrios, Frontend Developer.",
        siteName: "Bismarck Barrios Portfolio",
        images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Bismarck Barrios Portfolio" }],
    },
    twitter: {
        card: "summary_large_image",
        title: "Bismarck Barrios — Frontend Developer",
        description: "Portfolio profesional de Bismarck Barrios, Frontend Developer.",
        images: ["/og-image.jpg"],
    },
    robots: { index: true, follow: true },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    themeColor: "#060810",
};

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as "es" | "en")) {
        notFound();
    }

    const messages = await getMessages();

    return (
        <html lang={locale} data-theme="dark" className={`dark ${inter.variable}`}>
            <head>
                {/* Block content visibility until loader hides it */}
                <style
                    id="loader-hide"
                    dangerouslySetInnerHTML={{
                        __html: `
                            body > *:not(.page-loader-wrap) { opacity: 0 !important; visibility: hidden !important; }
                            body { overflow: hidden !important; }

                            .page-loader-wrap {
                                --ld-primary: #CC2200;
                                --ld-secondary: rgba(204, 34, 0, 0.3);
                                --ld-dur: 2s;
                            }
                            .page-loader-wrap .ui-abstergo {
                                display: flex; flex-direction: column; align-items: center; row-gap: 30px;
                            }
                            .page-loader-wrap .abstergo-loader { width: 103px; height: 90px; position: relative; }
                            .page-loader-wrap .abstergo-loader * { box-sizing: content-box; }
                            .page-loader-wrap .abstergo-loader div {
                                width: 50px; border-right: 12px solid transparent; border-left: 12px solid transparent;
                                border-top: 21px solid var(--ld-primary); position: absolute;
                                filter: drop-shadow(0 0 5px var(--ld-secondary));
                            }
                            .page-loader-wrap .abstergo-loader div:nth-child(1) {
                                top: 27px; left: 7px; rotate: -60deg;
                                animation: ld1 var(--ld-dur) linear infinite alternate;
                            }
                            .page-loader-wrap .abstergo-loader div:nth-child(2) {
                                bottom: 2px; left: 0; rotate: 180deg;
                                animation: ld2 var(--ld-dur) linear infinite alternate;
                            }
                            .page-loader-wrap .abstergo-loader div:nth-child(3) {
                                bottom: 16px; right: -9px; rotate: 60deg;
                                animation: ld3 var(--ld-dur) linear infinite alternate;
                            }
                            .page-loader-wrap .ui-text {
                                color: var(--ld-primary);
                                text-shadow: 0 0 4px var(--ld-secondary);
                                font-family: 'Space Mono', Menlo, monospace;
                                font-size: 0.8rem; letter-spacing: 0.15em; text-transform: uppercase;
                                display: flex; align-items: baseline; column-gap: 3px;
                            }
                            .page-loader-wrap .ui-dot {
                                display: block; width: 3px; height: 3px;
                                background-color: var(--ld-primary);
                                animation: lddots var(--ld-dur) infinite linear; animation-delay: 0.4s;
                            }
                            .page-loader-wrap .ui-dot:nth-child(2) { animation-delay: 0.8s; }
                            .page-loader-wrap .ui-dot:nth-child(3) { animation-delay: 1.2s; }
                            .page-loader-wrap .ui-dot + .ui-dot { margin-left: 3px; }

                            @keyframes ld1 {
                                0%,40% { top:27px; left:7px; rotate:-60deg; }
                                60%,100% { top:22px; left:14px; rotate:60deg; }
                            }
                            @keyframes ld2 {
                                0%,40% { bottom:2px; left:0; rotate:180deg; }
                                60%,100% { bottom:5px; left:-8px; rotate:300deg; }
                            }
                            @keyframes ld3 {
                                0%,40% { bottom:16px; right:-9px; rotate:60deg; }
                                60%,100% { bottom:7px; right:-11px; rotate:180deg; }
                            }
                            @keyframes lddots {
                                0% { background-color: var(--ld-secondary); }
                                30% { background-color: var(--ld-primary); }
                                70%,100% { background-color: var(--ld-secondary); }
                            }
                        `,
                    }}
                />
            </head>
            <body className={`antialiased ${inter.className}`}>
                <NextIntlClientProvider messages={messages}>
                    <PageLoader />
                    <LenisProvider />
                    <Navbar />
                    <div className="grain-overlay" aria-hidden="true" />
                    <main>{children}</main>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
