// The project index. Each project answers: what problem, what solution, how
// it scales, what I did, and what came out of it.
// Sources:
//   LEGR            — devpost.com/software/legr (team write-up + Anthony's stated role)
//   MP Board        — MP-Board repo (schema, migrations, query keys) + Anthony (why it was built)
//   Creator Copilot — Creator-Copilot repo (frontend/backend/ai-server) + PROOF.md
//   Steam           — Steam-Games-Library-Rank-System repo + resume
//   Air Quality     — Data_Visualization repo + README + Anthony (motivation)
// Facts that come from Anthony rather than code are marked "(per Anthony)" in REVIEW.md.

export type IndexProject = {
  number: string;
  name: string;
  year: string;
  /** short line for the card: kind of project */
  kind: string;
  /** short line for the card: what I did */
  roleShort: string;
  /** short line for the card: the headline result */
  highlight: string;
  /** one line: what it is */
  purpose: string;
  problem: string;
  solution: string;
  /** how the design holds up as usage, data, or teams grow */
  scale: string;
  role: string;
  /** a result, recognition, or lesson — whatever is most true for this project */
  outcome: { label: string; text: string };
  features?: string[];
  stack: string[];
  links: { label: string; href: string }[];
  badge?: string;
  image?: { src: string; alt: string; width: number; height: number };
};

export const projectIndex: IndexProject[] = [
  {
    number: "03",
    name: "LEGR",
    year: "2026",
    badge: "1st place · HackPrinceton",
    kind: "Hackathon · AI agents",
    roleShort: "Backend integrations · team of 4, 36 hours",
    highlight: "Won Best Business & Enterprise Hack at HackPrinceton Spring 2026",
    purpose: "“Rocket Money for startups”: autonomous finance agents that find wasted spend, negotiate with vendors, and report back over iMessage.",
    problem:
      "Startups leak money in a hundred small ways: API calls running an expensive model when a cheaper one would do, seats for people who left months ago, subscriptions nobody remembers, renewals that quietly go up. Dashboards show the waste but get ignored, and enterprise tools cost more than an early team can justify.",
    solution:
      "A fleet of agents that do the work instead of just flagging it. Three pillars: AI-spend optimization, a SaaS-sprawl finder that cross-checks invoices against real usage, and per-swipe expense compliance. A founder approves a negotiation with one text; a long-running agent emails the vendor, reads replies, counters, and texts back when the deal closes. A live dashboard shows every agent, thread, and saving.",
    scale:
      "Built on one split: quick, stateless agent calls for instant work, and a separate long-running process per vendor deal for anything that takes days. Each deal keeps its own state file written atomically, so a crash resumes mid-negotiation. A unique constraint stops duplicate agents during bursts, and messages are tiered so founders are only pinged when a decision is needed. The same pattern extends to legal ops, vendor management, and HR compliance.",
    role:
      "Team of four, 36 hours. I tested the sponsor API tools, debugged and troubleshot the integrations, supported the backend architecture, and connected the backend to the frontend so the dashboard rendered real data.",
    outcome: {
      label: "Result",
      text: "Won Best Business & Enterprise Hack and Best Use of Enter Pro at HackPrinceton Spring 2026.",
    },
    features: ["Agents in iMessage (Photon)", "Long-running negotiation agents", "Supabase Realtime dashboard", "Bank & card data via Knot"],
    stack: ["Python", "FastAPI", "Claude", "Dedalus", "Photon", "Supabase", "Knot", "Next.js"],
    links: [{ label: "Devpost", href: "https://devpost.com/software/legr" }],
    image: {
      src: "/assets/hackprinceton-winner.webp",
      alt: "The LEGR team holding the HackPrinceton Best Business and Enterprise Hack award.",
      width: 1280,
      height: 853,
    },
  },
  {
    number: "04",
    name: "MP Board",
    year: "2026",
    badge: "Used company-wide at MatchPoint",
    kind: "Internal tool",
    roleShort: "Idea, design, and build · 25 of 29 commits",
    highlight: "Replaced a paid Jira subscription for the whole MatchPoint team",
    purpose: "MatchPoint’s own project and task tracker, built to replace a paid Jira subscription.",
    problem:
      "MatchPoint was paying for Jira every month just to track tasks and assign them to the Tech, Events, and Marketing teams, and a generic tool didn’t fit how those departments actually work. Marketing needed draft approvals; Events needed an event pipeline, not a bug tracker.",
    solution:
      "I built our own Kanban-style tracker around our departments. Tech gets issues with types, priorities, assignees, and proof-of-work links (PRs, deploys, designs). Marketing gets versioned design drafts with feedback per version and a publish step. Events gets an 11-stage pipeline from Event Ideas through Event Day to post-event tasks, with venue, staffing, and equipment readiness. Everyone gets a calendar, a blocked list that requires a reason, comments, checklists, and a full activity history.",
    scale:
      "Departments are data, not code: issue types, workflow stages, and priority scales live in tables, so a new team or stage is a new row, with no migration and no deploy. Drag-and-drop rewrites a single row thanks to sparse ordering. Realtime pushes teammates’ edits instantly, and query caching keeps reads light. Row Level Security and Google sign-in limited to the company domain keep it internal; the activity log can only be written by database triggers, so history can’t be altered.",
    role: "Idea, design, and build: schema, permissions, triggers, and the Next.js app. 25 of the repo’s 29 commits are mine.",
    outcome: {
      label: "Result",
      text: "The whole MatchPoint team now runs on it, and it replaced the monthly Jira cost.",
    },
    features: ["Kanban + calendar", "Per-department workflows", "Versioned marketing drafts", "Event pipeline & readiness", "Realtime updates"],
    stack: ["Next.js 16", "TypeScript", "Supabase", "Postgres", "TanStack Query", "Realtime", "dnd-kit"],
    links: [],
  },
  {
    number: "05",
    name: "Creator Copilot",
    year: "2026",
    badge: "Tapyoca · sponsored capstone",
    kind: "Sponsored capstone · web app",
    roleShort: "Auth, dashboards, CSV import, AI chat UI · 1 of 3 devs",
    highlight: "Delivered to Tapyoca as a live, deployed app",
    purpose: "An all-in-one financial dashboard for musicians and filmmakers, with an AI assistant that knows their numbers.",
    problem:
      "Creative artists rarely have a way to manage a project’s money. Budgets, expenses, and income end up scattered across spreadsheets, and general finance apps don’t speak their language: they don’t know what a studio day, a wardrobe budget, or a licensing payment is.",
    solution:
      "One platform per creative project: set a budget, log expenses by the departments creators actually spend on (Equipment, Studio / Venue, Wardrobe / Styling, Editing / Post, Labor, Distribution…), track income by real creator sources (Music Release, Streaming, Brand Deal, Licensing, Live Performance…), and see profit, burn, and trends on dashboards. Existing spreadsheets come in through a CSV import that maps their columns. An AI assistant answers questions about their own projects.",
    scale:
      "Three independently deployed services (the React app, a Flask API with documented endpoints, and a Node AI server), so each can grow on its own. Every query is scoped to the signed-in user. The assistant builds its context server-side from that user’s projects, expenses, and earnings, and is instructed to stay on finances, never invent figures, and point tax questions to a professional. KPI cards come from config presets, so new metrics don’t need new components.",
    role:
      "One of three developers. I chose the web stack and built the auth (including Google sign-in), projects, expenses, earnings, CSV import and column mapping, the analytics dashboards, and the assistant’s chat UI, and started the AI server.",
    outcome: {
      label: "Result",
      text: "Delivered to Tapyoca as a live, deployed app built around their requirements and feedback; I demoed it at the final capstone presentation.",
    },
    features: ["Project budgets", "Creator-specific categories", "Earnings & profit", "CSV import with mapping", "AI assistant on your data"],
    stack: ["React", "Vite", "Tailwind", "shadcn/ui", "Recharts", "Supabase", "Flask", "Node", "Gemini API"],
    links: [{ label: "Live app", href: "https://creator-copilot-frontend-production.up.railway.app/" }],
    image: {
      src: "/assets/creator-copilot.webp",
      alt: "Creator Copilot welcome screen.",
      width: 553,
      height: 415,
    },
  },
  {
    number: "06",
    name: "Steam Library Rank System",
    year: "2025",
    badge: "IT490 · team project",
    kind: "Distributed systems · coursework",
    roleShort: "Message broker, logging pipeline, email 2FA · team of 4",
    highlight: "One app spread across Linux VMs over RabbitMQ and a VPN",
    purpose: "A social app for ranking the games in your Steam library, built as one application spread across several Linux machines.",
    problem:
      "The course asked for a real tool built on existing data. Steam’s Web API was a strong fit: a huge catalog and real libraries from real players, enough data to make rankings and social features meaningful instead of mock-ups.",
    solution:
      "Users register, link their Steam account, and build ranked catalogs of their games. Others can follow them, comment, vote, and message. A collector pulls Steam’s full app list into our database. Logins are protected with hashed passwords, expiring sessions, and an emailed one-time code for two-factor authentication.",
    scale:
      "Every machine (web server, database, Steam data collector) talks only through RabbitMQ queues on separate exchanges, so services are decoupled and none is exposed directly. Logs from every service fan out to one central log worker. Dev, QA, and Production run as separate Linux environments over a Tailscale VPN, with database replication and automated backups. The catalog import pages through Steam’s list and ignores duplicates, so it can safely re-run.",
    role:
      "Team of four. I owned the RabbitMQ broker machine: the database connection layer, the logging pipeline (fanout exchange + systemd log worker), and email-based 2FA, and worked on the environment and VPN setup.",
    outcome: {
      label: "What I learned",
      text: "My first team project, and where I learned to connect multiple virtual machines into one secure application.",
    },
    features: ["Steam account linking", "Ranked game catalogs", "Follows, votes, comments, messages", "Email 2FA"],
    stack: ["PHP", "MySQL", "RabbitMQ", "Linux", "Tailscale", "Steam Web API"],
    links: [{ label: "GitHub", href: "https://github.com/Anthony-Quispilaya/Steam-Games-Library-Rank-System" }],
  },
  {
    number: "07",
    name: "Air Quality & Health Dashboard",
    kind: "Data visualization",
    roleShort: "Solo: data, analysis, and every chart",
    highlight: "Found links between PM2.5 / ozone and respiratory illness rates",
    year: "2025",
    purpose: "An interactive dashboard testing whether air pollution and respiratory illness move together across U.S. states, 2016–2022.",
    problem:
      "I had pneumonia, so this question was personal: is there a real connection between air pollution and respiratory illness? The data exists (from the EPA and the CDC), but it’s spread across separate datasets that nobody had put side by side.",
    solution:
      "I gathered state-level air-quality data (PM2.5 and ozone) and respiratory-illness and influenza data for 2016–2022, cleaned and aligned it, and built multiple views to test the question: an interactive U.S. map with a year-by-year slider, pollutant trends, top-state comparisons, influenza trends, and a correlation view with a regression line and Pearson coefficients by year and pollutant.",
    scale:
      "All datasets load once into a shared data layer and are normalized there, so every chart reads the same cleaned data, so adding a new dataset or chart doesn’t mean re-parsing anything. Next steps I planned: live EPA data instead of static files, county-level detail, and weather data as another factor.",
    role: "Solo project: data sourcing and cleaning, the data layer, every visualization, and the Google Maps integration.",
    outcome: {
      label: "Result",
      text: "The correlation analysis showed links between PM2.5 and ozone levels and respiratory illness rates: evidence of a relationship, not proof of cause. It was also my first time working with an external API.",
    },
    features: ["Interactive state map", "Year slider", "Pollutant trends", "Correlation analysis"],
    stack: ["React", "D3", "Recharts", "PapaParse", "Google Maps API"],
    links: [
      { label: "GitHub", href: "https://github.com/Anthony-Quispilaya/Data_Visualization" },
      { label: "Demo video", href: "https://youtu.be/2k7Wdi-ugSg" },
    ],
  },
];
