# Needs Anthony's review

Everything on the site was checked against a source (repos, résumé, diploma,
PROOF.md). These are the places where a source was missing, conflicting, or
where wording speaks for you. Edit the referenced `content/*.ts` file.

## Facts to confirm

- **Quest Technologies dates** — résumé (Oct 2026) says *Aug 2024 – Present*; the
  previous site said *Aug 2024 – Sept 2025*. The site uses the résumé.
  → `content/profile.ts`
- **Graduation date** — résumé says May 2026; diploma was conferred Aug 15, 2026.
  The site shows "2026". → `content/profile.ts`
- **MatchPoint stats** — 98 non-merge commits and 52/112 migrations were counted
  from the local clone on Oct 7, 2026. Re-count before publishing if the repo
  has moved on. → `content/matchpoint.ts`
- **MatchPoint team description** ("Small product team · shared repo · PR-based
  workflow") — inferred from git history. → `content/matchpoint.ts`
- **Creator Copilot live link** (Railway) — carried over from the old site; not
  re-verified. → `content/projects.ts`
- **LEGR role** — from the résumé/PROOF.md; the LEGR repo wasn't available.
- **Volleyball "Sep – Oct 2026"** — from file dates in the game repo (its git
  repo has no commits yet).

## Missing assets / links

- **Real MatchPoint screenshots** — none exist in the repo, and it's company
  work, so the case study has no app visuals yet. If you're allowed, add 2–3
  screenshots (friends / team chat, payment portal, live event card) to the
  Product panel in `components/matchpoint/matchpoint-chapter.tsx`.
- **Backyard Volley download** — `anthonyquispilaya.itch.io/backyard-volley`
  returns 404 (likely unpublished). Publish it and add the link to
  `content/backyard-volley.ts` (`volleyOutcome.review` + a link).
- **Short gameplay video** — ffmpeg wasn't available, so the game section uses
  stills. A 10–20 s muted MP4/WebM loop would be a strong addition.
- **Contact endpoint** — set `NEXT_PUBLIC_CONTACT_ENDPOINT` (e.g. Formspree) or
  the form uses mailto.
- **Résumé PDF** — `public/Anthony_Quispilaya_Resume.pdf` is the Oct 2026 file
  from your Desktop and includes your phone number. Remove/replace if you don't
  want that public.

## Project facts that come from you (not from code)

- **MP Board:** replaced a paid monthly Jira subscription, is used by the whole MatchPoint team, and lowered company expenses. No dollar amount is shown; add one to `content/projects.ts` if you can share it.
- **Air Quality:** the motivation (you had pneumonia) and "first time using an external API". The result wording says the analysis showed *correlations*, not causation — keep it that way.
- **Steam:** first team project; IT490 course requirement to build on existing data.
- **MatchPoint redesign:** user testing with friends and volleyball players, the research-driven redesign (Mobbin / Dribbble references), friends and messaging, group chats and team group chats, the participation waiver, the payment portal, event-setup form components, and live event cards. These come from you, not from the repo history. They live in `redesign` in `content/matchpoint.ts`. Screenshots of these screens would be the strongest proof to add.
- **LEGR:** problem, solution and architecture come from the team’s Devpost write-up; your role is your own Devpost statement. The demo savings figures on Devpost (e.g. "$4,140/yr") were demo scenarios, so they’re not shown as results.

## Positioning

- The site presents you as a versatile software engineer (developer + technician), not a frontend specialist. The only remaining "Frontend Developer" is your actual Tapyoca job title from the résumé — change it there only if the official title was different.
- "Video editing" in skills comes from what you told me; there’s no project on the page showing it yet. A short edited clip (e.g. Backyard Volley gameplay) would back it up.

## Voice to check (written for you — make it yours)

- About paragraphs and the hero intro (`content/profile.ts`, `content/site.ts`).
- "What I learned" bullets in both case studies.
- Skills I left out because I couldn't verify recent use: FastAPI, C#. Java and
  C++ are listed as coursework, per the workshop notes.

## Not used

- OpsMesh AI and the Python calculator (previous site) — not on disk to verify;
  add to `content/projects.ts` if you want them back.
- Images in `Desktop/just volley images/` — reference material from another game
  and AI-generated sheets, not your work.
