# Anthony Quispilaya — Portfolio ("Engineering in Motion")

A one-page, editorial portfolio built around two engineering case studies —
**MatchPoint** (production React Native app) and **Backyard Volley** (my Godot +
Blender game) — with a live 3D version of my in-game player in the hero.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

## Checks

```bash
npm run typecheck
npm run lint
npm test             # Vitest: game-logic ports, contact validation
npm run build        # static export → out/
```

## Deploy

The site is a static export (`output: "export"`), so `out/` can go anywhere.

- **Vercel / custom domain:** import the repo, framework "Next.js", no extra
  settings. Set `NEXT_PUBLIC_SITE_URL` (and optionally
  `NEXT_PUBLIC_CONTACT_ENDPOINT`).
- **GitHub Pages:** `.github/workflows/deploy-pages.yml` builds with
  `NEXT_PUBLIC_BASE_PATH=/<repo>`; every asset URL goes through
  `lib/base-path.ts`, so models, images, and the résumé resolve under that path.

### Contact form

Set `NEXT_PUBLIC_CONTACT_ENDPOINT` to a JSON-accepting form endpoint (e.g. a
Formspree form URL — public by design, no secret). Without it, the form opens
the visitor's email app with the message pre-filled. Validation, a honeypot,
and a minimum-time check run client-side either way.

## Where things live

```
app/                 layout (fonts, metadata, JSON-LD), page, sitemap, robots
content/             ALL copy and data — edit here, not in components
  site.ts            identity, links, hero copy, chapter index
  matchpoint.ts      case study, architecture nodes + scenarios, outcomes
  backyard-volley.ts case study, stages, systems, pose list
  projects.ts        the numbered project index
  profile.ts         about, experience, skills, education
components/
  hero/              hero + 3D stage (lazy, poster fallback)
  three/             Three.js / R3F: character controller, toon shaders, scenes
  case-study/        "Behind the Build" switcher
  matchpoint/        architecture diagram, RLS before/after, phone sketches
  volley/            spike lab, setter read, netcode, pose lab, annotated shot
  sections/          project index, about, skills + education
  contact/           contact form + section (also the footer)
lib/
  game/              TypeScript ports of the game's real formulas
  contact.ts         form validation
scripts/
  build-character.mjs  game GLBs → optimized web character (public/models)
  build-og.mjs         Open Graph image from the character render
tests/               Vitest
```

## The 3D character

`public/models/ansoniq.glb` is built from the Backyard Volley repo's own
Blender exports (`body_rig.glb`, `character_kit.glb`, `hair_kit.glb`) by
`npm run build:character` (expects the game at `../BackyardVolley`). It keeps
the outfit from my saved in-game profile, simplifies meshes (332k → ~70k
triangles), and Meshopt-compresses the result (~0.8 MB). The face decals and
the volleyball come from the same repo.

At runtime (`components/three/character.ts`) the head kit is attached to the
Head bone exactly like `avatar.gd`, the game's toon / outline / face shaders
are ported to GLSL, and the 20 Blender pose clips are blended per bone. The
scene renders on demand (full rate only while something moves, ~24 fps idle,
nothing off-screen), respects `prefers-reduced-motion`, skips auto-loading on
Save-Data, and falls back to a static poster without WebGL.

## Images

Everything under `public/work/volley/` was captured from the running game with
Godot's Movie Maker mode — no mockups. See `docs/portfolio/ASSETS.md`.
