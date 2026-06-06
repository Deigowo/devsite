export interface Project {
  name: string
  status: string
  stack: string[]
  description: string[]
}

export interface Experience {
  role: string
  company: string
  location: string
  period: string
  highlights: string[]
}

export interface ContactItem {
  key: string
  label: string
  value: string
  href?: string
  copyable?: boolean
}

export interface TechStackCategory {
  category: string
  items: string[]
}

export interface CVData {
  title: string
  name: string
  titles: string[]
  heroSubtitle: string
  locationLabel: string
  locationValue: string
  contact: ContactItem[]
  profileTitle: string
  profile: string
  strengthsTitle: string
  strengths: string[]
  softSkillsTitle: string
  softSkills: string[]
  experienceTitle: string
  experience: Experience[]
  projectsTitle: string
  projects: Project[]
  techStackTitle: string
  techStack: TechStackCategory[]
  educationTitle: string
  education: {
    degree: string
    institution: string
    period: string
  }
  achievementTitle: string
  achievement: {
    title: string
    event: string
    description: string
    prize: string
  }
  otherSkillsTitle: string
  otherSkills: string[]
  methodologiesTitle: string
  methodologies: string[]
  languagesTitle: string
  languages: {
    name: string
    level: string
  }[]
  glitchWords: string[]
}

export const cvData: { es: CVData; } = {
  es: {
    title: "Portafolio de Diego Nicolás Rivera Sánchez",
    name: "DIEGO NICOLÁS RIVERA SÁNCHEZ",
    titles: ["TECNICO FULL STACK JUNIOR-LEVEL"],
    heroSubtitle: "La forma en que debe ser",
    locationLabel: "Ubicación",
    locationValue: "Tlaxcala, MX · Remote",
    contact: [
      { key: "email", label: "Correo", value: "deigowo@gmail.com", href: "mailto:deigowo@gmail.com", copyable: true },
      { key: "github", label: "GitHub", value: "github.com/Deigowo", href: "https://github.com/Deigowo" },
      { key: "linkedin", label: "LinkedIn", value: "linkedin.com", href: "https://www.linkedin.com/in/diego-nicol%C3%A1s-rivera-s%C3%A1nchez-a0a844317/" }
    ],
    profileTitle: "Perfil",
    profile: "Estudiante con instinto creativo para diseñar sistemas de software originales desde cero. Enfocado en el backend aplicando Clean Architecture, DDD y Scrum para construir sistemas mantenibles y escalables por diseño. Creación de documentación técnica exhaustiva, desde diagramas de arquitectura hasta especificaciones de API. Busca activamente roles remotos donde la ingeniería bien ejecutada y la resolución creativa de problemas generen impacto real.",
    strengthsTitle: "Fortalezas",
    strengths: [
      "Diseño de sistemas y propuestas de productos",
      "Documentación técnica de calidad",
      "Arquitectura desde cero hasta producción"
    ],
    softSkillsTitle: "Habilidades Blandas",
    softSkills: [
      "Autodidacta",
      "Documentación",
      "Resolución de problemas",
      "Colaboración asíncrona"
    ],
    experienceTitle: "Experiencia Profesional",
    experience: [
      {
        role: "Consultor de Integración",
        company: "Grupo INFRA",
        location: "Naucalpan, MX",
        period: "Mayo 2025 – Presente",
        highlights: [
          "Diseñó e implementación de iFlows para comunicación entre servicios",
          "Orquestación de flujos de datos.",
          "Redactó documentación técnica completa: Especificaciones de API, runbooks de despliegue y diagramas bpd.",
        ]
      },
    ],
    projectsTitle: "Proyectos Clave",
    projects: [
      {
        name: "Sistema de Cotización para Restauración de Bienes Muebles",
        status: "PORTAFOLIO",
        stack: ["Python", "Flask", "PostgreSQL"],
        description: [
          "Sistema que agiliza el proceso de cotización de ",
          "Implementa algoritmos de enrutamiento dinámico, persistencia con PostgreSQL y Alembic, y tests de estrés concurrentes con Pytest."
        ]
      },
    ],
    techStackTitle: "Stack Técnico",
    techStack: [
      { category: "Lenguajes", items: ["Python", "C# (.NET 8)", "Java", "JavaScript / TypeScript", "C#", "HTML5", "Dart"] },
      { category: "Backend", items: [".NET 8 (C#)", "FastAPI (Python)", "Node.js", "APIs RESTful", "Clean Architecture", "DDD (Domain-Driven Design)",] },
      { category: "Frontend", items: ["Next.js (App Router)", "Tailwind CSS", "Radix UI Themes"] },
      { category: "Bases de Datos & Caché", items: ["PostgreSQL", "MySQL", "SQL Server", "SQLite", "MongoDB", "Supabase"] },
    //   { category: "DevOps & Nube", items: ["Docker & Docker Compose", "K3s / Kubernetes", "Linux (Ubuntu / Debian)", "Nginx", "Cloudflare Tunnels", "Tailscale Mesh VPN", "OCI (Oracle Cloud)", "DigitalOcean", "CI/CD Pipelines (Jenkins / GitHub Actions)"] },
    //   { category: "IA & Automatización", items: ["Agentes de IA Autónomos", "n8n Automation Workflows", "LangGraph / LangChain", "RAG (Retrieval-Augmented Generation)", "Cuantización de Modelos (KV-Cache)", "APIs de LLM (Claude / Gemini / Ollama / Groq)", "Webhooks de Eventos", "Self-Healing Workflows"] },
      { category: "Sistemas & Arquitectura", items: ["Diseño de APIs REST", "WebSockets (Tiempo Real)"] },
      { category: "IoT & Hardware", items: ["ESP32 / Arduino (C++)"] },
    //   { category: "Streaming", items: ["Icecast — Configuración y Operación de Radio Streaming 24/7"] },
    //   { category: "Desarrollo de Videojuegos", items: ["Scripting en C# para Godot Engine (Godot 4)"] }
    ],
    educationTitle: "Educación",
    education: {
      degree: "Técnico Superior Universitario en Tecnologías de la Información",
      institution: "Universidad Tecnológica de Tlaxcala",
      period: "2025 - Presente"
    },
    achievementTitle: "",
    achievement: {
      title: "",
      event: "",
      description: "",
      prize: ""
    },
    otherSkillsTitle: "Otras Habilidades",
    otherSkills: [
      "Infraestructura autoalojada (K3s, OCI, DigitalOcean)",
      "Sistemas en tiempo real con WebSockets",
      "Diseño y versionado de APIs REST",
      "Prompt engineering",
    ],
    methodologiesTitle: "Metodologías",
    methodologies: [
      "Arquitectura Limpia", "DDD", "Scrum / Ágil", "Git Flow", "CI/CD", "TDD", "Trabajo Remoto Asíncrono"
    ],
    languagesTitle: "Idiomas",
    languages: [
      { name: "Español", level: "Nativo" },
      { name: "Inglés", level: "B2 - TOEFL ITP Silver" }
    ],
    glitchWords: ["DESPLEGADO", "ESCALADO", "PROGRAMADO", "ENTREGADO"]
  },
//   en: {
//     title: "Diego Nicolás Rivera Sanchez's Portfolio",
//     name: "DIEGO NICOLÁS RIVERA SÁNCHEZ",
//     titles: ["MID-LEVEL FULL STACK ENGINEER", "AI AGENT ENGINEER"],
//     heroSubtitle: "The Way It's Meant To Be",
//     locationLabel: "Location",
//     locationValue: "Veracruz, MX · Remote",
//     contact: [
//       { key: "email", label: "Email", value: "metacodex@macrostasis.dev", href: "mailto:metacodex@macrostasis.dev", copyable: true },
//       { key: "github", label: "GitHub", value: "github.com/MetaCodeX", href: "https://github.com/MetaCodeX" },
//       { key: "linkedin", label: "LinkedIn", value: "linkedin.com/in/metacodex", href: "https://linkedin.com/in/metacodex" }
//     ],
//     profileTitle: "Profile",
//     profile: "Mid-Level Full Stack Engineer with a strong creative instinct for designing original software systems from the ground up. Backend-focused with deep expertise in .NET 8, Python/FastAPI, and distributed architecture — applying Clean Architecture, DDD, and Scrum to build systems that are maintainable and scalable by design. Proficient in AI agent engineering: autonomous LLM workflows, RAG pipelines, and self-hosted inference. Known for producing thorough technical documentation, from architecture diagrams to API specs and deployment runbooks. Actively seeking remote roles where well-crafted engineering and creative problem-solving drive real impact.",
//     strengthsTitle: "Strengths",
//     strengths: [
//       "Creative system design & original product proposals",
//       "High-quality technical documentation",
//       "Architecture from scratch to production",
//       "Self-directed — ships without hand-holding"
//     ],
//     softSkillsTitle: "Soft Skills",
//     softSkills: [
//       "Self-directed",
//       "Fast learner",
//       "Systems thinker",
//       "Documentation",
//       "Problem-solver",
//       "Async collab"
//     ],
//     experienceTitle: "Professional Experience",
//     experience: [
//       {
//         role: "Full Stack Developer & Systems Architect",
//         company: "Microfinanciera Inpulso + URMONY Platform",
//         location: "Poza Rica, MX",
//         period: "Jan 2025 – Present",
//         highlights: [
//           "Built and deployed URMONY: full loan lifecycle platform with amortization tables, moratory interest scheduler, 2FA OTP, JWT HttpOnly cookies, encrypted PII and PDF receipts.",
//           "Designed the internal admin web platform for the fintech's daily operations (Node.js / PHP backend).",
//           "Optimized relational DB schemas and complex SQL queries — reduced reporting time by 40%.",
//           "Authored complete technical documentation: ERD, API specs, deployment runbooks, and architecture diagrams.",
//           "Deployed the full stack on a self-managed K3s multi-node cluster (Docker, Nginx, CI/CD)."
//         ]
//       },
//       {
//         role: "Lead Software Architect",
//         company: "Parhelion Logistics (Portfolio Project)",
//         location: "Remote",
//         period: "Oct 2025 – Dec 2025",
//         highlights: [
//           "Multi-tenant backend with .NET 8 and PostgreSQL (Clean Architecture + DDD).",
//           "Python FastAPI microservice for analytics and automated operational workflows.",
//           "Docker-based deployment with Cloudflare Tunnels for secure external access.",
//           "Automation workflows using n8n and webhooks to handle business events.",
//           "Angular admin dashboard and React Native driver app with real-time sync."
//         ]
//       },
//       {
//         role: "IT Specialist & Automation Consultant",
//         company: "Independent / Various Clients",
//         location: "HSBC · BBVA · Various",
//         period: "2019 – 2024",
//         highlights: [
//           "Infrastructure solutions and hardware maintenance for banking-sector clients.",
//           "Automated data entry with Python scripts, saving 10+ hours weekly.",
//           "Setup and administration of Icecast 24/7 streaming radio server."
//         ]
//       }
//     ],
//     projectsTitle: "Key Projects",
//     projects: [
//       {
//         name: "Parhelion Simulator",
//         status: "ACTIVE",
//         stack: ["Python", "FastAPI", "PostgreSQL", "Docker", "Pytest", "Alembic"],
//         description: [
//           "Real-time logistics network simulator modeling fleet dispatching, road congestion, and automated carrier assignment.",
//           "Implements dynamic routing algorithms, database persistence via PostgreSQL and Alembic, and concurrent stress testing with Pytest."
//         ]
//       },
//       {
//         name: "URMONY",
//         status: "PRODUCTION",
//         stack: ["FastAPI", "React", "PostgreSQL", "Docker", "K3s", "JWT", "Redis"],
//         description: [
//           "Full loan lifecycle platform: amortization tables, moratory interest scheduler, 2FA OTP, JWT HttpOnly cookies, encrypted PII, PDF receipt generation.",
//           "Multi-node deployment on self-managed K3s cluster."
//         ]
//       },
//       {
//         name: "Quantext",
//         status: "AMD HACKATHON 2026",
//         stack: ["Next.js", "FastAPI", "PostgreSQL", "Docker", "K3s", "KV-Cache Quantization"],
//         description: [
//           "Adaptive AI orchestration system developed for the AMD Hackathon 2026 May-April to dynamically select models and multi-agent workflows based on task complexity.",
//           "Optimizes GPU memory usage through KV-cache quantization to enable highly efficient parallel inference. Monorepo with Next.js frontend and FastAPI backend."
//         ]
//       },
//       {
//         name: "OmniDocs",
//         status: "PRODUCTION",
//         stack: ["Go", "FastAPI", "React", "Docker", "PostgreSQL", "Markdown AST", "RAG"],
//         description: [
//           "Declarative enterprise architecture document engine parsing custom Markdown notations via an AST parser.",
//           "Integrates semantic search RAG pipelines, asynchronous EventBus architecture, background worker agents, and task queues via asyncio."
//         ]
//       },
//       {
//         name: "Proyecto Río",
//         status: "ACTIVE",
//         stack: ["ESP32", "C++", "FastAPI", "InfluxDB", "Grafana", "TensorFlow Lite", "IoT"],
//         description: [
//           "IoT telemetry system for flood prediction on the Cazones River in Poza Rica, Veracruz.",
//           "Deploys ultrasonic sensors connected to ESP32 microcontrollers to send real-time data to a FastAPI backend, running local predictive models for early warning alerts."
//         ]
//       },
//       {
//         name: "Parhelion Logistics",
//         status: "PORTFOLIO",
//         stack: [".NET 8", "FastAPI", "Angular", "React Native", "PostgreSQL", "n8n", "Docker"],
//         description: [
//           "Enterprise-grade WMS/TMS platform: multi-tenant architecture, AI crisis management via n8n, geospatial Haversine routing, Carta Porte legal documentation.",
//           "Mobile app for drivers with real-time sync."
//         ]
//       },
//       {
//         name: "MacroStasis Portfolio",
//         status: "LIVE",
//         stack: ["Next.js", "Radix UI", "Three.js", "TypeScript", "Cloudflare Tunnels"],
//         description: [
//           "Premium interactive portfolio featuring a dynamic 3D constellation background, fully interactive cyber radio HUD built with Radix UI Themes.",
//           "Optimized for accessibility, SEO, and smooth rendering performance, securely exposed using Cloudflare Tunnels."
//         ]
//       }
//     ],
//     techStackTitle: "Tech Stack",
//     techStack: [
//       { category: "Languages", items: ["Python", "C# (.NET 8)", "Go", "JavaScript / TypeScript", "C++", "Java", "HTML5 / CSS3"] },
//       { category: "Backend", items: [".NET 8 (C#)", "FastAPI (Python)", "Go (Golang)", "Node.js / Express", "PHP", "RESTful APIs", "Clean Architecture", "DDD (Domain-Driven Design)", "Microservices"] },
//       { category: "Frontend", items: ["Next.js (App Router)", "React", "Angular 18", "React Native (Expo)", "Three.js", "Tailwind CSS", "Radix UI Themes", "Ionic"] },
//       { category: "Databases & Cache", items: ["PostgreSQL", "InfluxDB (IoT Telemetry)", "Redis (Cache & Queues)", "MySQL", "SQL Server", "SQLite", "MongoDB"] },
//       { category: "DevOps & Cloud", items: ["Docker & Docker Compose", "K3s / Kubernetes", "Linux (Ubuntu / Debian)", "Nginx", "Cloudflare Tunnels", "Tailscale Mesh VPN", "OCI (Oracle Cloud)", "DigitalOcean", "CI/CD Pipelines (Jenkins / GitHub Actions)"] },
//       { category: "AI & Automation", items: ["Autonomous AI Agents", "n8n Automation Workflows", "LangGraph / LangChain", "RAG (Retrieval-Augmented Generation)", "Model Quantization (KV-Cache)", "LLM APIs (Claude / Gemini / Ollama / Groq)", "Event Webhooks", "Self-Healing Workflows"] },
//       { category: "Systems & Architecture", items: ["REST API Design", "WebSockets (Real-Time)", "Hexagonal Architecture", "Modular Architecture", "Event-Driven Systems (EventBus)", "Asynchronous Workers (asyncio)"] },
//       { category: "IoT & Hardware", items: ["ESP32 / Arduino (C++)", "TensorFlow Lite (Edge AI)", "IoT Telemetry", "Protocols (MQTT / HTTP)"] },
//       { category: "Streaming", items: ["Icecast — 24/7 Radio Streaming Setup & Operations"] },
//       { category: "Game Dev", items: ["C# Scripting for Godot Engine (Godot 4)"] }
//     ],
//     educationTitle: "Education",
//     education: {
//       degree: "Higher University Technician in Computer Technology",
//       institution: "Universidad Veracruzana",
//       period: "2023 – Present"
//     },
//     achievementTitle: "Key Achievement",
//     achievement: {
//       title: "Winner — Ubisoft CTF (2024)",
//       event: "Captain Laserhawk: The G.A.M.E.",
//       description: "Solved server-side & infrastructure challenges in a competitive cybersecurity CTF event.",
//       prize: "Award: 1 ETH"
//     },
//     otherSkillsTitle: "Other Skills",
//     otherSkills: [
//       "Self-hosted infra (K3s, OCI, DigitalOcean)",
//       "Tailscale mesh networking",
//       "Jenkins CI/CD pipelines",
//       "WebSocket real-time systems",
//       "REST API design & versioning",
//       "Modular & Hexagonal Architecture",
//       "LLM prompt engineering & RAG tuning",
//       "C# / Godot 4 game development",
//       "Icecast 24/7 streaming radio",
//       "Competitive programming (C++)",
//       "ESP32 / IoT gateway integration"
//     ],
//     methodologiesTitle: "Methodologies",
//     methodologies: [
//       "Clean Architecture", "DDD", "Scrum / Agile", "Git Flow", "CI/CD Pipelines", "Microservices", "TDD", "REST Design", "Technical Writing", "Async Remote"
//     ],
//     languagesTitle: "Languages",
//     languages: [
//       { name: "Spanish", level: "Native" },
//       { name: "English", level: "Intermediate — Technical Reading & Communication" }
//     ],
//     glitchWords: ["BUILT", "DEPLOYED", "AUTOMATED", "SCALED", "ENGINEERED", "SHIPPED"]
//   }
}