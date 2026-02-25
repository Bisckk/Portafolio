"use client";

import dynamic from "next/dynamic";

const HeroBissck = dynamic(
    () => import("@/components/HeroBissck"),
    { ssr: false }
);

const TrySolutionsSection = dynamic(
    () => import("@/components/sections/TrySolutionsSection").then((m) => m.TrySolutionsSection),
    { ssr: false }
);

import { AboutSection } from "@/components/sections/AboutSection";
import { TechOrbitSection } from "@/components/sections/TechOrbitSection";
import { ExperienceSection } from "@/components/sections/ExperienceSection";
import { StudiesSection } from "@/components/sections/StudiesSection";
import { Footer } from "@/components/sections/Footer";

export default function HomePage() {
    return (
        <>
            <HeroBissck />
            <AboutSection />
            <TechOrbitSection />
            <ExperienceSection />
            <StudiesSection />
            <TrySolutionsSection />
            <Footer />
        </>
    );
}
