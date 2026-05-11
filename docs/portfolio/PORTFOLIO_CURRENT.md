# Current Portfolio Source Of Truth

This is the current working brief and implementation note for Anthony Quispilaya's portfolio.

## Current Goal

Build a recruiter-facing portfolio that proves I am a reliable full-stack engineer who builds useful products, practical AI systems, and systems-integration work from real programming fundamentals.

## Audience

A startup recruiter or hiring team member looking for a full-stack engineer who can build useful products, communicate clearly, reduce delivery risk, and keep growing into AI and automation work.

## First-Screen Promise

Reliable full-stack engineer building useful products and practical AI systems.

## Current Page Sections

1. Sticky header with Anthony Quispilaya, Experience, Work, Proof, Skills, and Contact.
2. Hero with the promise, recruiter-friendly CTAs, proof strip, proof stats, and auto-advancing HackPrinceton carousel.
3. About section with first-person bio and headshot.
4. Professional experience section with concise impact bullets and tech pills.
5. Key projects in a 2x2 grid: LEGR, Creator Copilot, OpsMesh AI, and Steam Games Library Rank System.
6. Additional Engineering Proof block for the Python Calculator Application.
7. Text-only External Validation proof blocks.
8. Skills and capabilities.
9. Contact section with email, LinkedIn, and GitHub.

## Current Design Decisions

- Keep the visual identity warm, beige, dark green/black, clean, and professional.
- Use premium cards with 8px radius, restrained borders, and subtle shadows.
- Avoid oversized glow/shadow effects; shadows should support depth without blooming to the right or bottom.
- Keep recruiter-facing copy short, direct, and scan-friendly.
- Buttons in project cards should be compact, centered, and clearly clickable.
- External Validation should be text-first proof, not image-heavy. Images were removed from that section because they created awkward layouts and distracted from the evidence.
- Calculator Application should support the main story, not compete with flagship projects.

## Professional Experience

### Frontend Developer, Tapyoca

- Jan 2026 to Present.
- Builds React interfaces for Creator Copilot, a sponsored financial platform for creators, artists, and filmmakers.
- Creates dashboard, budgeting, expense, CSV, and project-management flows backed by Supabase authentication.
- Collaborates through GitHub, Trello, and Agile/Scrum routines while contributing to AI-assisted insight features.

### IT Technician, Quest Technologies

- Aug 2024 to Sept 2025.
- Troubleshot hardware, software, workstation, and basic networking issues in professional environments.
- Set up devices, documented resolutions, and helped users return to productive work with less downtime.
- Built habits around diagnosis, reliability, communication, and follow-through.

## Projects

### LEGR

- HackPrinceton 2026 project.
- Won Best Business and Enterprise Hack.
- Won Best Use of Enter Pro.
- Built in 36 hours.
- Current card emphasizes AI-powered finance operations, real-time dashboard, iMessage-style alerts, sponsor API integration, backend wiring, real-time data flow, and testing support APIs.
- Proof includes the hero carousel, official winner material, Devpost, NJIT recognition, Enter Pro recognition, and sponsor-track validation.

### Creator Copilot By Tapyoca

- Sponsored capstone product for Tapyoca.
- Current card emphasizes frontend UI, dashboards, project flows, Supabase/auth integration, CSV/project finance flows, and AI assistant integration work.
- Proof includes live site, screenshot, tech stack, and product-manager feedback.

### OpsMesh AI

- Practical AI operations project.
- Messaging-first operations platform concept connecting a Next.js product surface, FastAPI backend, Postgres storage, orchestration agents, and Photon bridge support.
- Shows a deeper AI automation direction built from lessons in Tapyoca and HackPrinceton.

### Steam Games Library Rank System

- Systems integration project.
- Full-stack PHP and MySQL application integrated with the Steam Web API.
- Shows Dev / QA / Prod Linux environments, RabbitMQ messaging, Tailscale VPN access, database replication, backups, logging, monitoring, and deployment separation.
- Strengthens the portfolio by proving backend, infrastructure, deployment, and operational reliability skills.

### Python Calculator Application

- Supporting proof block, not a flagship project card.
- Shows Python fundamentals, testing, command routing, input handling, error handling, state/history management, modular design, logging, and documentation.

## External Validation Display Order

1. Hackathon Win: Best Business & Enterprise Hack, merged with official winner material.
2. Tapyoca Sponsor Feedback: stakeholder feedback from Myron Paes.
3. NJIT Recognition: institutional/public recognition.
4. Enter Pro Recognition: sponsor-track validation for Best Use of Enter Pro.

## Current UI Implementation Notes

- Hero carousel still uses HackPrinceton images as first-screen proof.
- External Validation no longer uses images; it uses four text proof cards in a clean 2x2 grid.
- Key Projects uses a 2x2 grid for the four strongest project cards.
- Python Calculator sits below Key Projects in an "Additional engineering proof" block.
- Project card CTAs are centered and compact.
- Heavy right-side shadow effects were reduced on the hero proof card, carousel caption, repeated cards, and contact CTA.

## Assets

- `public/assets/headshot_square.jpg`
- `public/assets/DSCF4249.JPG`
- `public/assets/HackPrinceton Winner.jpg`
- `public/assets/LEGR WINNER.png`
- `public/assets/Creator Copilot.png`

## Links

- Email: anthonyquispilaya@gmail.com
- LinkedIn: https://www.linkedin.com/in/anthony-quispilaya/
- GitHub: https://github.com/Anthony-Quispilaya
- LEGR Devpost: https://devpost.com/software/legr
- Creator Copilot live site: https://creator-copilot-frontend-production.up.railway.app/
- OpsMesh AI: https://github.com/Anthony-Quispilaya/opsmeshai
- Steam Games Library Rank System: https://github.com/Anthony-Quispilaya/Steam-Games-Library-Rank-System
- Python Calculator: https://github.com/Anthony-Quispilaya/midterm_ajq

## Remaining Improvements

- Add a polished deployment/hosting note once the final live portfolio URL is chosen.
- Add a resume PDF link if available.
- Add screenshots or project-detail pages later if recruiters need deeper proof.
- Continue checking mobile after major copy/layout changes.
- Ask 2-3 people to do a 10-second first impression test before sharing widely.
