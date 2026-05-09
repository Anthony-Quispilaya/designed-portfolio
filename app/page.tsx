import { HackPrincetonCarousel } from "@/components/hackprinceton-carousel";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Anthony Quispilaya | Full-Stack Engineer",
  description:
    "I am a full-stack engineer who ships fast, thinks user-first, and builds practical AI automation and systems-integration projects.",
  openGraph: {
    title: "Anthony Quispilaya | Full-Stack Engineer",
    description:
      "Reliable full-stack engineering, user-first product thinking, and proof from AI, product, and systems-integration work.",
    type: "website",
  },
};

const projects = [
  {
    eyebrow: "HackPrinceton",
    title: "LEGR won Best Business & Enterprise Hack",
    body: "My team and I shipped LEGR in 36 hours: an AI finance operations platform with autonomous agents, live dashboards, and smart alerts for startup teams.",
    role: "I tested sponsor API tools, debugged integration issues, supported backend architecture, and helped connect backend data to the frontend so the final product could render real data.",
    proof:
      "Won Best Business & Enterprise Hack at HackPrinceton 2026 and Best Use of Enter Pro by Enter Pro after a 36-hour build.",
    image: "/assets/HackPrinceton%20Winner.jpg",
    imageAlt:
      "Anthony with the LEGR team after winning Best Business and Enterprise Hack at HackPrinceton.",
    link: "https://devpost.com/software/legr",
    linkLabel: "View Devpost",
    stack: [
      "Python",
      "JavaScript",
      "HTML5",
      "CSS3",
      "Supabase",
      "OpenAI",
      "Claude",
      "Dedalus",
      "Photon",
      "Knot",
    ],
  },
  {
    eyebrow: "Capstone",
    title: "Creator Copilot by Tapyoca",
    body: "I built the frontend foundation for Creator Copilot, a sponsored financial platform for artists and filmmakers to manage budgets, expenses, revenue, and project-level financial data.",
    role: "I owned the frontend structure on a three-person team: stack decisions, page layouts, Supabase authentication with Google login, reusable UI, sponsor-aligned styling, and the final product demo.",
    proof: "This shows product ownership in a stakeholder environment: I translated sponsor expectations into usable screens and kept the frontend moving ahead of the build.",
    image: "/assets/Creator%20Copilot.png",
    imageAlt:
      "Creator Copilot product interface showing the Tapyoca capstone application.",
    link: "https://creator-copilot-frontend-production.up.railway.app/",
    linkLabel: "Open live site",
    stack: [
      "React",
      "Vite",
      "Tailwind CSS",
      "Shadcn/ui",
      "Recharts",
      "Gemini API",
      "FlaskAPI",
      "Python",
      "Supabase",
    ],
  },
  {
    eyebrow: "Latest AI project",
    title: "OpsMesh AI",
    body: "OpsMesh AI is my strongest current AI systems project: a messaging-first operations platform with a Next.js frontend, FastAPI backend, Postgres storage, orchestration agents, and Photon bridge support.",
    role: "I combined lessons from Tapyoca's product execution and HackPrinceton's AI sprint into automated workflows that connect messaging, agents, backend systems, and real operations.",
    proof: "This shows I can move beyond a single AI feature into coordinated workflows, multi-agent orchestration, and product infrastructure.",
    link: "https://github.com/Anthony-Quispilaya/opsmeshai",
    linkLabel: "View GitHub",
    stack: [
      "Next.js",
      "Docker",
      "Postgres",
      "Python",
      "TypeScript",
      "Photon",
      "Automated workflows",
    ],
  },
  {
    eyebrow: "Systems Integration",
    title: "Steam Games Library Rank System",
    body: "I built a full-stack PHP and MySQL application that integrates the Steam Web API to generate game libraries, rankings, and social features.",
    role: "I designed a Dev / QA / Prod multi-VM Linux environment secured through Tailscale VPN, with database replication, automated backups, 2FA, RabbitMQ messaging, and deployment isolation.",
    proof: "This project shows backend and infrastructure depth: system integration, environment separation, messaging queues, database reliability, security practices, and operational stability beyond a single web app.",
    link: "https://github.com/Anthony-Quispilaya/Steam-Games-Library-Rank-System",
    linkLabel: "View GitHub",
    stack: [
      "PHP",
      "MySQL",
      "RabbitMQ",
      "Linux",
      "Tailscale",
      "Steam Web API",
    ],
  },
];

const proofBlocks = [
  {
    source: "HackPrinceton Team Win",
    status: "Primary proof",
    quote: "Best Business & Enterprise Hack",
    context:
      "My team and I are shown with the award context visible behind us.",
    image: "/assets/HackPrinceton%20Winner.jpg",
    imageAlt:
      "LEGR team standing in front of the Best Business and Enterprise Hack winner screen.",
  },
  {
    source: "Official Winner Slide",
    status: "Award evidence",
    quote: "LEGR was listed as the Best Business & Enterprise Hack winner.",
    context:
      "The award slide names LEGR as the winning project and anchors the achievement in event materials.",
    image: "/assets/LEGR%20WINNER.png",
    imageAlt:
      "HackPrinceton award slide naming LEGR as Best Business and Enterprise Hack winner.",
  },
  {
    source: "NJIT Recognition",
    status: "External recognition",
    quote:
      "NJIT congratulated Anthony Quispilaya and Sadman Mazumder for winning Best Business/Enterprise Hack and Best Use of Enter Pro.",
    context:
      "The post notes the team built the project within a 36-hour HackPrinceton window.",
    link:
      "https://www.linkedin.com/feed/update/urn:li:activity:7457397339591307264/?utm_source=share&utm_medium=member_desktop&rcm=ACoAADUojL0BnvhdHtVAObhuMfPEp-F440dUqac",
    linkLabel: "Open post",
  },
  {
    source: "Enter Pro Recognition",
    status: "Sponsor validation",
    quote:
      "Huge congratulations to Anthony Quispilaya and the entire LEGR team for winning 1st Place in Best Business & Enterprise Hack.",
    context:
      "The sponsor highlighted LEGR as an AI-powered solution for real startup problems, built in 36 hours.",
    link:
      "https://www.linkedin.com/feed/update/urn:li:activity:7457396576487976960/?utm_source=share&utm_medium=member_desktop&rcm=ACoAADUojL0BnvhdHtVAObhuMfPEp-F440dUqac",
    linkLabel: "Open post",
  },
  {
    source: "Enter Pro Forum",
    status: "Official site proof",
    quote: "Best Use of Enter Pro",
    context:
      "Enter Pro also posted LEGR's sponsor-track recognition on its own forum, giving the win another source outside LinkedIn.",
    link:
      "https://forum.enter.pro/t/0b94d8e7-fbd3-43f5-a589-0a0be54beae9",
    linkLabel: "Open Enter Pro proof",
  },
  {
    source: "Tapyoca PM Feedback",
    status: "Stakeholder feedback",
    quote:
      "You've been extremely proactive in your work with us thus far, and I'm sure that there will be opportunities available at Tapyoca after this capstone project.",
    context:
      "Feedback from Myron Paes, Head Product Manager at Tapyoca, recognizing my initiative and work quality.",
  },
];

const hackPrincetonCarousel = [
  {
    src: "/assets/DSCF4249.JPG",
    alt: "Anthony at HackPrinceton during the LEGR project presentation.",
    label: "Enter Pro Winner",
    caption: "Our team was selected for Best Use of Enter Pro at HackPrinceton 2026 after shipping LEGR in just 36 hours.",
  },
  {
    src: "/assets/HackPrinceton%20Winner.jpg",
    alt: "Anthony with the LEGR team after winning Best Business and Enterprise Hack at HackPrinceton.",
    label: "Team win",
    caption: "Our team LEGR won Best Business & Enterprise Hack.",
  },
  {
    src: "/assets/LEGR%20WINNER.png",
    alt: "HackPrinceton award slide naming LEGR as Best Business and Enterprise Hack winner.",
    label: "Award slide",
    caption: "Official winner slide naming LEGR as the track winner.",
  },
];

const capabilities = [
  {
    title: "Full-stack web development",
    body: "I connect frontend, backend APIs, databases, authentication, and user-facing flows into working products.",
  },
  {
    title: "Speed and delivery",
    body: "I ship early enough for feedback, catch issues before deadline pressure, and keep the next milestone visible.",
  },
  {
    title: "User focus",
    body: "I look for friction, simplify access to what users need, and automate repetitive work when it helps the experience.",
  },
  {
    title: "AI and automation",
    body: "I build practical AI workflows across LEGR, Creator Copilot, and OpsMesh AI instead of stopping at demos.",
  },
  {
    title: "Systems integration",
    body: "I work across Linux environments, queues, VPN access, replication, backups, and deployment separation.",
  },
  {
    title: "Python",
    body: "I have Python fundamentals from earlier work and keep rebuilding deeper language fluency for AI and backend systems.",
  },
];

const experience = [
  {
    role: "Frontend Developer",
    company: "Tapyoca",
    dates: "Jan 2026 to Present",
    body: "I build frontend features for Creator Copilot, a financial platform for artists and filmmakers to manage budgets, expenses, revenue, and project-level financial data. I create responsive React interfaces, connect Supabase-backed product flows, contribute to Gemini-powered assistant features, and work with teammates through GitHub, Trello, and Agile/Scrum routines.",
    stack: [
      "React",
      "JavaScript",
      "Supabase",
      "Git",
      "UI/UX",
      "AI Integration",
    ],
  },
  {
    role: "IT Technician",
    company: "Quest Technologies",
    dates: "Aug 2024 to Sept 2025",
    body: "I supported hardware, software, workstation, and basic network issues in a high-volume technical environment. The role strengthened my troubleshooting habits: diagnose clearly, document resolutions, set up devices correctly, and help users get back to work with less downtime.",
    stack: [
      "Technical Support",
      "Troubleshooting",
      "Device Setup",
      "System Diagnostics",
      "End-User Support",
      "Problem Solving",
    ],
  },
];

const pythonProject = {
  title: "Calculator Application",
  link: "https://github.com/Anthony-Quispilaya/midterm_ajq",
  body: "An interactive command-line calculator built in Python 3.10 with a REPL interface, plugin-based arithmetic commands, calculation history, error handling, logging, and automated tests.",
  proof:
    "This is older school work from before AI assistants became part of my normal workflow. That matters because it shows I was already building application logic, debugging behavior, handling errors, and testing code from the fundamentals up.",
  details: [
    "I built a command-line product with a real REPL loop, not just isolated practice functions.",
    "The plugin architecture separated each operation into its own command, which shows I understand modular design and extensibility.",
    "The app tracks calculation history, handles invalid input, protects against division-by-zero errors, and logs behavior for debugging.",
    "Automated tests and coverage prove I can verify behavior without relying on an AI assistant to tell me whether the program works.",
    "It shows foundational programming judgment: input handling, state management, command routing, testing, and clear user feedback.",
  ],
  stack: [
    "Python",
    "pytest",
    "pytest-cov",
    "Faker",
    "pandas",
    "logging",
  ],
};

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#f7f3ec] font-sans text-[#17231c]">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[#17231c] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
      >
        Skip to content
      </a>

      <header className="fixed inset-x-0 top-0 z-50 border-b border-[#d7ddcf]/80 bg-[#f7f3ec]/92 backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 sm:px-8 lg:px-10">
          <Link href="/" className="text-sm font-bold tracking-[0.18em] !text-[#24352b] uppercase">
            Anthony Quispilaya
          </Link>
          <nav aria-label="Portfolio sections" className="hidden gap-5 text-sm font-semibold !text-[#4b5966] sm:flex">
            <a href="#experience">Experience</a>
            <a href="#work">Work</a>
            <a href="#proof">Proof</a>
            <a href="#skills">Skills</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      <div id="content" className="mx-auto flex w-full max-w-7xl flex-col gap-20 overflow-x-hidden px-5 pt-20 pb-16 sm:px-8 lg:px-10">
        <section className="grid min-h-[calc(100svh-6rem)] gap-10 pt-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:pt-4">
          <div className="min-w-0 max-w-3xl">
            <p className="text-sm font-bold tracking-[0.22em] text-[#697b56] uppercase">
              Full-stack engineer for user-focused teams
            </p>
            <h1
              className="mt-5 max-w-4xl text-4xl leading-[1.02] font-extrabold tracking-normal text-[#17231c] sm:text-6xl lg:text-7xl"
              style={{ fontFamily: "Avenir Next, Segoe UI, Helvetica Neue, sans-serif" }}
            >
              The reliable full-stack engineer building useful products and practical AI systems.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#425247]">
              I ship early, stay prepared, and build with the user in mind. My work spans
              frontend product development, backend systems, AI automation, and infrastructure
              proof from real projects.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#work"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#17231c] px-5 text-sm font-bold !text-white transition hover:-translate-y-0.5"
              >
                See the work
              </a>
              <a
                href="#contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-[#b8c1ae] bg-white/70 px-5 text-sm font-bold !text-[#17231c] transition hover:-translate-y-0.5"
              >
                Get in touch
              </a>
            </div>
            <div className="mt-8 grid max-w-2xl gap-3 sm:grid-cols-3">
              <ProofStat label="HackPrinceton" value="1st Place Best Business & Enterprise Hack" />
              <ProofStat label="Sponsor track" value="Best Use of Enter Pro" />
              <ProofStat label="Build window" value="Shipped LEGR in 36 hours" />
            </div>
          </div>

          <div className="min-w-0 max-w-full overflow-hidden rounded-[8px] border border-[#cdd7d9] bg-[#e9eff0] p-3 shadow-[0_28px_80px_rgba(30,43,34,0.12)]">
            <HackPrincetonCarousel slides={hackPrincetonCarousel} />
          </div>
        </section>

        <section aria-labelledby="about-title" className="grid gap-8 border-y border-[#d7ddcf] py-12 lg:grid-cols-[0.3fr_0.46fr_0.24fr] lg:items-center">
          <div>
            <p className="text-sm font-bold tracking-[0.22em] text-[#697b56] uppercase">About</p>
            <h2
              id="about-title"
              className="mt-3 text-3xl font-extrabold tracking-normal"
              style={{ fontFamily: "Avenir Next, Segoe UI, Helvetica Neue, sans-serif" }}
            >
              I build quickly, but I do not treat users as an afterthought.
            </h2>
          </div>
          <p className="max-w-3xl text-xl leading-9 text-[#33433a]">
            I’m a full-stack engineer with a strong web foundation and a growing focus on
            AI automation, backend systems, and product reliability. I like moving fast, but
            I also care about the details that make software useful: clear flows, real data,
            stable integrations, and less friction for the person using the product.
          </p>
          <figure className="max-w-xs overflow-hidden rounded-[8px] border border-[#d7ddcf] bg-white/72 p-3 shadow-[0_18px_50px_rgba(30,43,34,0.07)]">
            <div className="relative aspect-square overflow-hidden rounded-[8px] border border-[#d7ddcf] bg-[#e9eff0]">
              <Image
                src="/assets/headshot_square.jpg"
                alt="Headshot of Anthony Quispilaya."
                fill
                sizes="(min-width: 1024px) 22vw, 280px"
                className="object-cover"
              />
            </div>
            <figcaption className="px-1 pt-4">
              <p className="text-base font-extrabold text-[#17231c]">Anthony Quispilaya</p>
              <p className="mt-1 text-sm leading-6 text-[#506052]">
                Full-stack engineer building for user-focused teams.
              </p>
            </figcaption>
          </figure>
        </section>

        <section id="experience" className="space-y-8">
          <SectionHeader
            eyebrow="Professional experience"
            title="Professional environments where reliability mattered."
            body="My experience combines product development at Tapyoca with hands-on technical support at Quest Technologies, giving me both builder habits and support instincts."
          />
          <div className="space-y-5">
            {experience.map((job) => (
              <article key={`${job.role}-${job.company}`} className="grid gap-5 rounded-[8px] border border-[#d7ddcf] bg-white/72 p-6 shadow-[0_18px_50px_rgba(30,43,34,0.07)] lg:grid-cols-[0.28fr_0.72fr]">
                <div>
                  <p className="text-sm font-bold tracking-[0.2em] text-[#697b56] uppercase">{job.company}</p>
                  <h3
                    className="mt-3 text-2xl font-extrabold tracking-normal text-[#17231c]"
                    style={{ fontFamily: "Avenir Next, Segoe UI, Helvetica Neue, sans-serif" }}
                  >
                    {job.role}
                  </h3>
                  <p className="mt-2 text-sm font-bold text-[#506052]">{job.dates}</p>
                </div>
                <div>
                  <p className="text-base leading-8 text-[#425247]">{job.body}</p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.stack.map((item) => (
                      <span key={item} className="rounded-full bg-[#eef3f2] px-3 py-2 text-xs font-bold text-[#41575c] ring-1 ring-[#cfd8da]">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="work" className="space-y-8">
          <SectionHeader
            eyebrow="Key projects"
            title="Projects that prove the full story."
            body="These projects show the range I want recruiters to see: hackathon speed, stakeholder product work, current AI automation, systems integration, and programming fundamentals."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {projects.map((project) => (
              <article key={project.title} className="rounded-[8px] border border-[#d7ddcf] bg-white/72 p-6 shadow-[0_18px_50px_rgba(30,43,34,0.07)]">
                {project.image ? (
                  <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-[8px] border border-[#d7ddcf]">
                    <Image
                      src={project.image}
                      alt={project.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 42vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <p className="text-sm font-bold tracking-[0.2em] text-[#697b56] uppercase">{project.eyebrow}</p>
                <h3
                  className="mt-3 text-3xl font-extrabold tracking-normal text-[#17231c]"
                  style={{ fontFamily: "Avenir Next, Segoe UI, Helvetica Neue, sans-serif" }}
                >
                  {project.title}
                </h3>
                <p className="mt-4 text-base leading-7 text-[#425247]">{project.body}</p>
                <div className="mt-6 space-y-3 border-t border-[#dfe5d9] pt-5">
                  <p className="text-sm leading-6 text-[#506052]"><strong className="text-[#17231c]">My role:</strong> {project.role}</p>
                  <p className="text-sm leading-6 text-[#506052]"><strong className="text-[#17231c]">Why it matters:</strong> {project.proof}</p>
                </div>
                {project.stack ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span key={item} className="rounded-full bg-[#eef3f2] px-3 py-2 text-xs font-bold text-[#41575c] ring-1 ring-[#cfd8da]">
                        {item}
                      </span>
                    ))}
                  </div>
                ) : null}
                {project.link ? (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex min-h-11 items-center rounded-full bg-[#17231c] px-4 text-sm font-bold !text-white"
                  >
                    {project.linkLabel}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section id="proof" className="space-y-8">
          <SectionHeader
            eyebrow="External validation"
            title="Real people and organizations recognized the work."
            body="The proof is close to the claim: a team win, official award evidence, LinkedIn recognition, sponsor validation, and stakeholder feedback."
          />
          <div className="grid gap-5 lg:grid-cols-2">
            {proofBlocks.map((block) => (
              <figure key={block.source} className="rounded-[8px] border border-[#cfd8da] bg-[#eef3f2] p-6">
                {block.image ? (
                  <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-[8px] border border-[#cfd8da] bg-white">
                    <Image
                      src={block.image}
                      alt={block.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 42vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <figcaption className="text-sm font-bold tracking-[0.2em] text-[#4e6c73] uppercase">{block.source}</figcaption>
                <p className="mt-3 inline-flex rounded-full border border-[#b9c9ca] px-3 py-1 text-xs font-bold text-[#41575c]">
                  {block.status}
                </p>
                <blockquote className="mt-4 text-2xl font-extrabold leading-snug tracking-normal text-[#17231c]">
                  &ldquo;{block.quote}&rdquo;
                </blockquote>
                <p className="mt-5 text-sm leading-6 text-[#506052]">{block.context}</p>
                {block.link ? (
                  <a
                    href={block.link}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex min-h-11 items-center rounded-full bg-white px-4 text-sm font-bold !text-[#17231c] ring-1 ring-[#b9c9ca]"
                  >
                    {block.linkLabel}
                  </a>
                ) : null}
              </figure>
            ))}
          </div>
        </section>

        <section id="skills" className="space-y-8">
          <SectionHeader
            eyebrow="Capabilities"
            title="A practical stack of strengths, not a logo wall."
            body="The point is not to list every tool I have touched. The point is to show how I help a team ship useful software across product, AI, backend, and systems work."
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability) => (
              <article key={capability.title} className="rounded-[8px] border border-[#d7ddcf] bg-white/72 p-5">
                <h3 className="text-lg font-extrabold leading-snug text-[#17231c]">{capability.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#506052]">{capability.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="python-title" className="grid gap-8 rounded-[8px] border border-[#d7ddcf] bg-[#ece2d2] p-7 sm:p-9 lg:grid-cols-[0.58fr_0.42fr]">
          <div>
            <p className="text-sm font-bold tracking-[0.22em] text-[#775b38] uppercase">Python proof</p>
            <h2
              id="python-title"
              className="mt-3 max-w-3xl text-3xl font-extrabold tracking-normal"
              style={{ fontFamily: "Avenir Next, Segoe UI, Helvetica Neue, sans-serif" }}
            >
              {pythonProject.title}: a tested Python REPL application.
            </h2>
            <p className="mt-4 max-w-3xl text-base leading-8 text-[#4f463a]">
              {pythonProject.body}
            </p>
            <p className="mt-4 max-w-3xl text-sm leading-7 text-[#5a4d3c]">
              {pythonProject.proof}
            </p>
            <a
              href={pythonProject.link}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[#17231c] px-4 text-sm font-bold !text-white"
            >
              View Python project
            </a>
          </div>
          <div className="space-y-5">
            <div className="rounded-[8px] border border-[#d7c8b4] bg-white/62 p-5">
              <h3 className="text-lg font-extrabold leading-snug text-[#352b20]">What it shows</h3>
              <ul className="mt-4 space-y-3">
                {pythonProject.details.map((item) => (
                  <li key={item} className="text-sm leading-6 text-[#5a4d3c]">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[8px] border border-[#d7c8b4] bg-white/62 p-5">
              <h3 className="text-lg font-extrabold leading-snug text-[#352b20]">Tech stack</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {pythonProject.stack.map((item) => (
                  <span key={item} className="rounded-full bg-white/72 px-3 py-2 text-xs font-bold text-[#4f463a] ring-1 ring-[#d7c8b4]">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" aria-labelledby="contact-title" className="grid gap-8 rounded-[8px] bg-[#17231c] p-7 text-white sm:p-10 lg:grid-cols-[0.7fr_0.3fr] lg:items-end">
          <div>
            <p className="text-sm font-bold tracking-[0.22em] text-[#c8d6bb] uppercase">Contact</p>
            <h2
              id="contact-title"
              className="mt-3 max-w-3xl text-4xl font-extrabold tracking-normal"
              style={{ fontFamily: "Avenir Next, Segoe UI, Helvetica Neue, sans-serif" }}
            >
              Ready to help a team ship useful software with care.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-8 text-[#dce5d7]">
              I&apos;m looking for a team that moves quickly, values user-focused engineering, and
              needs someone who can contribute across frontend, backend, AI automation, and
              systems integration.
            </p>
          </div>
          <div className="flex flex-col gap-3 text-sm font-bold">
            <a className="rounded-full bg-white px-5 py-3 text-center !text-[#17231c]" href="mailto:anthonyquispilaya@gmail.com">
              Email me
            </a>
            <a className="rounded-full border border-white/30 px-5 py-3 text-center !text-white" href="https://www.linkedin.com/in/anthony-quispilaya/" rel="noreferrer" target="_blank">
              LinkedIn
            </a>
            <a className="rounded-full border border-white/30 px-5 py-3 text-center !text-white" href="https://github.com/Anthony-Quispilaya" rel="noreferrer" target="_blank">
              GitHub
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}

function ProofStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[8px] border border-[#d7ddcf] bg-white/72 p-4">
      <p className="text-xs font-bold tracking-[0.18em] text-[#697b56] uppercase">{label}</p>
      <p className="mt-2 text-sm font-extrabold leading-5 text-[#17231c]">{value}</p>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-bold tracking-[0.22em] text-[#697b56] uppercase">{eyebrow}</p>
      <h2
        className="mt-3 text-4xl font-extrabold tracking-normal text-[#17231c]"
        style={{ fontFamily: "Avenir Next, Segoe UI, Helvetica Neue, sans-serif" }}
      >
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-[#506052]">{body}</p>
    </div>
  );
}
