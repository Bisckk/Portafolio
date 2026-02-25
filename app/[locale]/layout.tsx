import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { routing } from "@/lib/routing";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { Navbar } from "@/components/ui/Navbar";
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
        icon: "/LOGO.png",
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
            <body className={`antialiased ${inter.className}`}>
                <NextIntlClientProvider messages={messages}>
                    <LenisProvider />
                    <Navbar />
                    <div className="grain-overlay" aria-hidden="true" />
                    <main>{children}</main>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
