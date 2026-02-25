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
        company: "Agencia Digital XYZ",
        role: "Frontend Developer Senior",
        roleEn: "Senior Frontend Developer",
        period: "2022 – Presente",
        description: "Lideré el desarrollo frontend de más de 15 proyectos web para clientes nacionales e internacionales.",
        descriptionEn: "Led frontend development for over 15 web projects for national and international clients.",
        achievements: [
            "Reduje el tiempo de carga inicial en un 60% mediante code-splitting y lazy loading estratégico",
            "Implementé sistema de design tokens que redujo el tiempo de desarrollo en un 35%",
            "Mentoré a 3 desarrolladores junior en mejores prácticas de React y TypeScript",
            "Integré animaciones GSAP y Three.js que aumentaron el engagement en un 45%",
        ],
        achievementsEn: [
            "Reduced initial load time by 60% through strategic code-splitting and lazy loading",
            "Implemented a design token system that reduced development time by 35%",
            "Mentored 3 junior developers in React and TypeScript best practices",
            "Integrated GSAP and Three.js animations that increased engagement by 45%",
        ],
        stack: ["React", "Next.js", "TypeScript", "GSAP", "Three.js", "Tailwind CSS", "GraphQL"],
        current: true,
    },
    {
        id: "exp-2",
        company: "StartupTech SRL",
        role: "Frontend Developer",
        roleEn: "Frontend Developer",
        period: "2021 – 2022",
        description: "Desarrollé la interfaz de una plataforma SaaS de gestión empresarial con más de 5,000 usuarios activos.",
        descriptionEn: "Developed the interface for a SaaS business management platform with over 5,000 active users.",
        achievements: [
            "Construí más de 40 componentes reutilizables con Storybook y TypeScript",
            "Implementé testing con Jest y React Testing Library alcanzando 85% de cobertura",
            "Optimicé el rendimiento de la aplicación logrando Lighthouse score > 90",
            "Diseñé e implementé sistema de autenticación con JWT y refresh tokens",
        ],
        achievementsEn: [
            "Built over 40 reusable components with Storybook and TypeScript",
            "Implemented testing with Jest and React Testing Library achieving 85% coverage",
            "Optimized application performance achieving Lighthouse score > 90",
            "Designed and implemented authentication system with JWT and refresh tokens",
        ],
        stack: ["React", "TypeScript", "Redux", "Jest", "Storybook", "Sass", "REST API"],
    },
    {
        id: "exp-3",
        company: "Freelance",
        role: "Desarrollador Web Freelance",
        roleEn: "Freelance Web Developer",
        period: "2020 – 2021",
        description: "Desarrollé sitios y aplicaciones web para pequeñas y medianas empresas.",
        descriptionEn: "Developed websites and web applications for small and medium-sized businesses.",
        achievements: [
            "Entregué más de 20 proyectos exitosos para clientes locales e internacionales",
            "Implementé e-commerce con integración de pasarelas de pago",
            "Desarrollé landing pages con tasas de conversión superiores al 15%",
        ],
        achievementsEn: [
            "Delivered over 20 successful projects for local and international clients",
            "Implemented e-commerce with payment gateway integration",
            "Developed landing pages with conversion rates above 15%",
        ],
        stack: ["HTML", "CSS", "JavaScript", "WordPress", "PHP", "MySQL"],
    },
];

// ─── PROJECTS DATA ─────────────────────────────────────────────────────────
export const projects: Project[] = [
    {
        id: "proj-1",
        title: "Cosmos Dashboard",
        description: "Panel de administración moderno con visualizaciones de datos en tiempo real, gráficos 3D y sistema de notificaciones.",
        descriptionEn: "Modern admin dashboard with real-time data visualizations, 3D charts and notification system.",
        image: "/images/projects/cosmos-dashboard.jpg",
        category: "Web",
        tags: ["React", "Three.js", "TypeScript", "GraphQL", "PostgreSQL"],
        github: "https://github.com/bismarckbarrios/cosmos-dashboard",
        demo: "https://cosmos-dashboard.vercel.app",
        featured: true,
    },
    {
        id: "proj-2",
        title: "Nebula UI Kit",
        description: "Librería de componentes React con más de 80 componentes accesibles, tematizables y con animaciones GSAP integradas.",
        descriptionEn: "React component library with over 80 accessible, themeable components with integrated GSAP animations.",
        image: "/images/projects/nebula-ui.jpg",
        category: "UI/UX",
        tags: ["React", "TypeScript", "GSAP", "Storybook", "Radix UI"],
        github: "https://github.com/bismarckbarrios/nebula-ui",
        demo: "https://nebula-ui.vercel.app",
        featured: true,
    },
    {
        id: "proj-3",
        title: "TaskFlow App",
        description: "Aplicación de gestión de tareas con drag & drop, colaboración en tiempo real y sincronización offline.",
        descriptionEn: "Task management app with drag & drop, real-time collaboration and offline sync.",
        image: "/images/projects/taskflow.jpg",
        category: "Web",
        tags: ["Next.js", "Prisma", "WebSockets", "TypeScript", "Supabase"],
        github: "https://github.com/bismarckbarrios/taskflow",
        demo: "https://taskflow-app.vercel.app",
    },
    {
        id: "proj-4",
        title: "EcoTrack Mobile",
        description: "App móvil para seguimiento de huella de carbono con gamificación y reportes visuales interactivos.",
        descriptionEn: "Mobile app for carbon footprint tracking with gamification and interactive visual reports.",
        image: "/images/projects/ecotrack.jpg",
        category: "Mobile",
        tags: ["React Native", "Expo", "TypeScript", "Firebase"],
        github: "https://github.com/bismarckbarrios/ecotrack",
    },
    {
        id: "proj-5",
        title: "Lumina Landing",
        description: "Landing page de alto impacto con animaciones WebGL, efecto parallax multi-capa y CRO optimizado.",
        descriptionEn: "High-impact landing page with WebGL animations, multi-layer parallax effect and CRO optimized.",
        image: "/images/projects/lumina.jpg",
        category: "Web",
        tags: ["Next.js", "Three.js", "GSAP", "Vercel Edge"],
        demo: "https://lumina-landing.vercel.app",
    },
    {
        id: "proj-6",
        title: "FinanceFlow UI",
        description: "Rediseño completo de una plataforma fintech con foco en UX, accesibilidad WCAG 2.1 AA y performance.",
        descriptionEn: "Complete redesign of a fintech platform focused on UX, WCAG 2.1 AA accessibility and performance.",
        image: "/images/projects/financeflow.jpg",
        category: "UI/UX",
        tags: ["Figma", "React", "CSS Modules", "a11y", "Framer Motion"],
        demo: "https://financeflow-ui.vercel.app",
    },
];

// ─── STUDIES DATA ──────────────────────────────────────────────────────────
export const studies: Study[] = [
    {
        id: "study-1",
        institution: "Universidad Nacional",
        title: "Ingeniería en Sistemas de Información",
        titleEn: "Information Systems Engineering",
        year: "2017 – 2022",
        area: "Ingeniería",
        areaEn: "Engineering",
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
        institution: "AWS",
        title: "AWS Cloud Practitioner",
        titleEn: "AWS Cloud Practitioner",
        year: "2024 – En curso",
        area: "Cloud Computing",
        areaEn: "Cloud Computing",
        status: "inprogress",
    },
];

// ─── TECH ORBIT DATA ─────────────────────────────────────────────────────
export const techOrbitRow1: TechOrbitItem[] = [
    { name: "React", icon: "/icons/react.svg", color: "#61DAFB" },
    { name: "Next.js", icon: "/icons/nextjs.svg", color: "#000000" },
    { name: "TypeScript", icon: "/icons/typescript.svg", color: "#3178C6" },
    { name: "JavaScript", icon: "/icons/javascript.svg", color: "#F7DF1E" },
    { name: "HTML5", icon: "/icons/html5.svg", color: "#E34F26" },
    { name: "CSS3", icon: "/icons/css3.svg", color: "#1572B6" },
    { name: "Tailwind CSS", icon: "/icons/tailwindcss.svg", color: "#06B6D4" },
    { name: "GSAP", icon: "/icons/gsap.svg", color: "#88CE02" },
    { name: "Three.js", icon: "/icons/threejs.svg", color: "#000000" },
    { name: "Vue.js", icon: "/icons/vuedotjs.svg", color: "#4FC08D" },
    { name: "Figma", icon: "/icons/figma.svg", color: "#F24E1E" },
];

export const techOrbitRow2: TechOrbitItem[] = [
    { name: "PostgreSQL", icon: "/icons/postgresql.svg", color: "#4169E1" },
    { name: "MongoDB", icon: "/icons/mongodb.svg", color: "#47A248" },
    { name: "Supabase", icon: "/icons/supabase.svg", color: "#3ECF8E" },
    { name: "Firebase", icon: "/icons/firebase.svg", color: "#FFCA28" },
    { name: "Git", icon: "/icons/git.svg", color: "#F05032" },
    { name: "GitHub", icon: "/icons/github.svg", color: "#181717" },
    { name: "Vercel", icon: "/icons/vercel.svg", color: "#000000" },
    { name: "Docker", icon: "/icons/docker.svg", color: "#2496ED" },
    { name: "Python", icon: "/icons/python.svg", color: "#3776AB" },
    { name: "MySQL", icon: "/icons/mysql.svg", color: "#4479A1" },
    { name: "VS Code", icon: "/icons/visualstudiocode.svg", color: "#007ACC" },
];
