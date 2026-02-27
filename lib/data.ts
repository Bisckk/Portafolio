export type ProjectCategory = "Web" | "Mobile" | "UI/UX" | "All";
export type StudyStatus = "completed" | "inprogress";

export interface Experience {
    id: string;
    company: string;
    role: string;
    roleEn: string;
    period: string;
    description: string;
    descriptionEn: string;
    achievements: string[];
    achievementsEn: string[];
    stack: string[];
    current?: boolean;
}

export interface Project {
    id: string;
    title: string;
    description: string;
    descriptionEn: string;
    image: string;
    category: Exclude<ProjectCategory, "All">;
    tags: string[];
    github?: string;
    demo?: string;
    featured?: boolean;
}

export interface Study {
    id: string;
    institution: string;
    title: string;
    titleEn: string;
    year: string;
    yearEn?: string;
    area: string;
    areaEn: string;
    status: StudyStatus;
    logo?: string;
}

export interface TechOrbitItem {
    name: string;
    icon: string;
    color: string;
}

// ─── EXPERIENCE DATA ────────────────────────────────────────────────────────
export const experiences: Experience[] = [
    {
        id: "exp-1",
        company: "AutomatIQ",
        role: "Frontend Developer Senior",
        roleEn: "Senior Frontend Developer",
        period: "2026 – Presente",
        description: "Co-desarrollé una plataforma SaaS multi-tenant para gestión de préstamos y cobranza, actualmente en fase de pruebas con un cliente real en camino a su comercialización.",
        descriptionEn: "Led frontend development for over 15 web projects for national and international clients.",
        achievements: [
            "Implementé arquitectura multi-tenant con aislamiento de datos por negocio y control de acceso por roles (Superadmin / Operativo).",
            "Desarrollé módulos financieros completos: ciclo de vida de préstamos, control de cuotas, gestión de mora y conciliación de cobros.",
            "Integré Supabase Auth con middleware de Next.js para autenticación segura y flujos de recuperación de contraseña automatizados.",
            "Configuré sistema de notificaciones por correo con Nodemailer para eventos críticos de la operación.",
        ],
        achievementsEn: [
            "Reduced initial load time by 60% through strategic code-splitting and lazy loading",
            "Implemented a design token system that reduced development time by 35%",
            "Mentored 3 junior developers in React and TypeScript best practices",
            "Integrated GSAP and Three.js animations that increased engagement by 45%",
        ],
        stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "Material UI", "Node.js", "Nodemailer", "Git"],
        current: true,
    },
    {
        id: "exp-2",
        company: "Freelance",
        role: "Desarrollador Web Freelance",
        roleEn: "Freelance Web Developer",
        period: "2025 - 2026",
        description: "Desarrollé sitios y aplicaciones web para pequeñas y medianas empresas.",
        descriptionEn: "Developed websites and web applications for small and medium-sized businesses.",
        achievements: [
            "Entregué más de 5 proyectos exitosos para clientes locales e internacionales",
            "Implementé e-commerce con integración de pasarelas de pago",
            "Desarrollé landing pages con tasas de conversión superiores al 15%",
        ],
        achievementsEn: [
            "Delivered over 20 successful projects for local and international clients",
            "Implemented e-commerce with payment gateway integration",
            "Developed landing pages with conversion rates above 15%",
        ],
        stack: ["HTML", "CSS", "JavaScript", "PHP", "MySQL", "Typescript", "Javascript", "React", "Nextjs", "Supabase", "Threejs", "GSAP"]
    },
    {
        id: "exp-3",
        company: "FREELANCE",
        role: "Frontend Developer",
        roleEn: "Frontend Developer",
        period: "2024 - 2025",
        description: "Realicé la construcción de interfaces y componentes web para proyectos propios y de práctica, enfocado en consolidar habilidades con tecnologías modernas del ecosistema JavaScript.",
        descriptionEn: "Developed the interface for a SaaS business management platform with over 5,000 active users.",
        achievements: [
            "Desarrollé UIs responsivas con React y TypeScript aplicando principios de diseño de componentes reutilizables.",
            "Exploré integración con APIs REST y manejo de estado en aplicaciones de mediana complejidad.",
            "Practiqué workflows profesionales con Git, ESLint y configuración de proyectos con Next.js.",
            "Apliqué conceptos de autenticación, manejo de sesiones y estructura de proyectos fullstack.",
        ],
        achievementsEn: [
            "Built over 40 reusable components with Storybook and TypeScript",
            "Implemented testing with Jest and React Testing Library achieving 85% coverage",
            "Optimized application performance achieving Lighthouse score > 90",
            "Designed and implemented authentication system with JWT and refresh tokens",
        ],
        stack: ["React", "TypeScript", "Supabase", "Nextjs", "Git", "HTML/CSS", "JavaScript"],
    }
];

// ─── PROJECTS DATA ─────────────────────────────────────────────────────────
export const projects: Project[] = [
    {
        id: "proj-1",
        title: "Cuoty - financial management",
        description: "Plataforma SaaS multi-tenant para gestión de préstamos y cobranza. Sistema de roles, módulos financieros y operación con cliente real.",
        descriptionEn: "Multi-tenant SaaS platform for loan management and debt collection. Role-based access, full financial modules and live operation with a real client.",
        image: "/CUOTYDEMO.png",
        category: "Web",
        tags: ["React", "Nextjs", "TypeScript", "PostgreSQL", "Supabase", "Material UI", "Node.js", "Nodemailer", "Git"],
        github: "https://github.com/Bisckk/Cuoty",
        demo: "https://www.cuoty.com/login",
        featured: true,
    },
    {
        id: "proj-2",
        title: "BK Portfolio",
        description: "Portafolio personal con identidad visual propia, animaciones avanzadas y diseño oscuro orientado a impacto visual y conversión.",
        descriptionEn: "Personal portfolio with a custom visual identity, advanced animations and dark design built for visual impact and conversion.",
        image: "/PORTAFOLIODEMO.png",
        category: "UI/UX",
        tags: ["React", "TypeScript", "GSAP", "Nextjs", "TailwindCSS", "Framer Motion"],
        github: "https://github.com/Bisckk/Portafolio",
        demo: "https://portafolio-one-xi-68.vercel.app/en",
        featured: true,
    }
];

// ─── STUDIES DATA ──────────────────────────────────────────────────────────
export const studies: Study[] = [
    {
        id: "study-1",
        institution: "COLEGIO SAN JOSÉ DE GUANENTÁ",
        title: "Bachiller Técnico en Sistemas",
        titleEn: "Technical High School Diploma in Systems",
        year: "2016 – 2021",
        area: "Bachiller Técnico",
        areaEn: "Technical Degree",
        status: "completed",
    },
    {
        id: "study-2",
        institution: "Meta (Coursera)",
        title: "Meta Frontend Developer Professional Certificate",
        titleEn: "Meta Frontend Developer Professional Certificate",
        year: "2023",
        area: "Desarrollo Frontend",
        areaEn: "Frontend Development",
        status: "completed",
    },
    {
        id: "study-3",
        institution: "Vercel / Next.js",
        title: "Next.js Certified Developer",
        titleEn: "Next.js Certified Developer",
        year: "2023",
        area: "Full Stack",
        areaEn: "Full Stack",
        status: "completed",
    },
    {
        id: "study-4",
        institution: "Three.js Journey",
        title: "Three.js Journey Certificación Completa",
        titleEn: "Three.js Journey Complete Certification",
        year: "2024",
        area: "WebGL / 3D",
        areaEn: "WebGL / 3D",
        status: "completed",
    },
    {
        id: "study-5",
        institution: "UNISANGIL",
        title: "Ingeniería en Sistemas de información.",
        titleEn: "Information Systems Engineering.",
        year: "2024 – En curso",
        yearEn: "2024 – In progress",
        area: "Ingeniería",
        areaEn: "Engineering",
        status: "inprogress",
    },
];

// ─── TECH ORBIT DATA ─────────────────────────────────────────────────────
export const techOrbitRow1: TechOrbitItem[] = [
    { name: "TypeScript", icon: "/icons/typescript.svg", color: "#3178C6" },
    { name: "JavaScript", icon: "/icons/javascript.svg", color: "#F7DF1E" },
    { name: "HTML5", icon: "/icons/html5.svg", color: "#E34F26" },
    { name: "CSS3", icon: "/icons/css3.svg", color: "#1572B6" },
    { name: "React", icon: "/icons/react.svg", color: "#61DAFB" },
    { name: "Tailwind CSS", icon: "/icons/tailwindcss.svg", color: "#06B6D4" },
    { name: "Three.js", icon: "/icons/threejs.svg", color: "#000000" },
    { name: "Figma", icon: "/icons/figma.svg", color: "#F24E1E" },
];

export const techOrbitRow2: TechOrbitItem[] = [
    { name: "VS Code", icon: "/icons/visualstudiocode.svg", color: "#007ACC" },
    { name: "Supabase", icon: "/icons/supabase.svg", color: "#3ECF8E" },
    { name: "Git", icon: "/icons/git.svg", color: "#F05032" },
    { name: "GitHub", icon: "/icons/github.svg", color: "#181717" },
    { name: "Vercel", icon: "/icons/vercel.svg", color: "#000000" },
    { name: "Photoshop", icon: "/icons/photoshop.svg", color: "#31A8FF" },
    { name: "Illustrator", icon: "/icons/illustrator.svg", color: "#FF9A00" },
    { name: "PostgreSQL", icon: "/icons/postgresql.svg", color: "#4169E1" },
];
