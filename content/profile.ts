// About, experience, skills, and education.
// Sources: resume (Oct 2026), NJIT diploma (conferred Aug 15, 2026),
// docs/portfolio/PROOF.md, and the project repositories.

export const about = {
  title: "No single lane. One goal: technology that works for the people using it.",
  paragraphs: [
    "I came to software through IT support, diagnosing workstations, networks, and business software at Quest Technologies. That’s still how I work as a developer: listen to the person, reproduce the problem, fix it properly, and write down what fixed it.",
    "I don’t limit myself to one specialty. I’ve built mobile screens and the Postgres functions behind them, internal tools, dashboards, and payment flows. For fun, I modeled and animated characters in Blender and turned them into a playable game in Godot. I edit video, and I pick up whatever tool the next project needs. Learning new skills is the part I enjoy most.",
    "The reason stays the same: I like helping people, whether that’s a teammate stuck on a bug, a client whose computer won’t cooperate, or a player trying to sign up for a league. Building applications is how I get to help a lot of people at once.",
  ],
  facts: [
    { k: "Based in", v: "New Jersey" },
    { k: "Languages", v: "English, Spanish" },
    { k: "Degree", v: "B.S. IT, NJIT · Cum Laude" },
    { k: "Looking for", v: "Software engineering roles" },
  ],
};

export type Role = {
  company: string;
  title: string;
  dates: string;
  current?: boolean;
  summary: string;
  points: string[];
  link?: { label: string; href: string };
};

export const experience: Role[] = [
  {
    company: "MatchPoint",
    title: "Software Engineer",
    dates: "May 2026 – Present",
    current: true,
    summary:
      "Redesigned and extended a React Native volleyball platform (open gyms, tournaments, clinics) on Supabase and Stripe.",
    points: [
      "Ran user testing with friends and volleyball players, then used their feedback to prioritize what mattered most for functionality and satisfaction.",
      "Refactored and redesigned the app around patterns from well-known products and current mobile design (researched on Mobbin and Dribbble), moving secondary details into tabs so main screens stay clean.",
      "Built the social layer: explore users, profiles, friends, messaging, group chats, and temporary team group chats so people who sign up together play together.",
      "Shipped a required participation waiver, a more detailed payment portal, reusable form components for faster event setup, and live event cards for events like tournaments.",
      "Built unified purchase-history receipts across every event type, and extended the app’s request cache with the team’s always-cache / always-invalidate rule.",
    ],
    link: { label: "Read the MatchPoint case study", href: "/work/matchpoint/" },
  },
  {
    company: "Quest Technologies",
    title: "IT Technician",
    dates: "Aug 2024 – Present",
    summary:
      "On-site support for business clients: hardware, software, networking, and workstation issues.",
    points: [
      "Diagnosed and resolved issues to minimize client downtime; installed and maintained desktops, peripherals, and network devices.",
      "Supported users in person through their technical problems; the job taught me to see technology from the user’s side.",
    ],
  },
  {
    company: "Tapyoca",
    title: "Frontend Developer",
    dates: "Jan 2026 – May 2026",
    summary:
      "Creator Copilot, a sponsored capstone: project budgeting, expense tracking, and financial dashboards for creators.",
    points: [
      "Built reusable, responsive dashboards that turn project finances into KPIs, trends, and category breakdowns.",
      "Integrated frontend and backend in an Agile team, resolving production issues through Git and GitHub.",
    ],
  },
];

export type SkillGroup = {
  title: string;
  claim: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: "Web & mobile applications",
    claim: "Apps people use every day, with clear flows that stay understandable as the product grows.",
    skills: ["React", "React Native", "Expo", "TypeScript", "JavaScript", "Next.js", "Tailwind / NativeWind", "HTML", "CSS"],
  },
  {
    title: "Backends, data & infrastructure",
    claim: "Owning a feature end to end: schema, permissions, server functions, payments, and the machines it runs on.",
    skills: ["Supabase", "PostgreSQL", "Row Level Security", "SQL functions / RPC", "Realtime", "Edge Functions", "Stripe", "Node.js", "Python / Flask", "PHP / MySQL", "RabbitMQ", "Linux servers"],
  },
  {
    title: "Games, 3D & creative tools",
    claim: "Building things for fun is how I learn fastest; this page’s character came out of it.",
    skills: ["Godot 4", "GDScript", "Blender modeling & rigging", "Blender Python", "Animation", "Shaders", "Three.js", "React Three Fiber", "Video editing", "Figma"],
  },
  {
    title: "IT & technical support",
    claim: "Hands-on help for real people with real problems, the side of technology most users actually see.",
    skills: ["Hardware troubleshooting", "Networking", "Workstation setup", "Business software", "User support", "Tailscale / VPNs"],
  },
  {
    title: "Tools & practice",
    claim: "How the work gets shipped, tested, and kept honest, plus new tools I keep picking up.",
    skills: ["Git & GitHub PRs", "Expo EAS", "Vercel", "Railway", "Vitest", "LLM APIs", "Prompt engineering"],
  },
];

export const alsoWritten = "Also from coursework: Java, C++.";

export const education = {
  school: "New Jersey Institute of Technology",
  // Official NJIT wordmark (transparent PNG, 346×160); the red reads on both themes.
  logo: { src: "/assets/njit-logo.png", width: 346, height: 160 },
  college: "Ying Wu College of Computing",
  degree: "Bachelor of Science in Information Technology",
  honors: "Cum Laude",
  year: "2026",
  coursework: [
    "Software Engineering",
    "Databases",
    "Data Structures & Algorithms",
    "Computer Systems & Networks",
    "Systems Integration",
  ],
};
