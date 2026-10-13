# Asset provenance

Every visual on the site is either a real capture, a real render of my own
assets, or a clearly labelled diagram. Nothing is a mockup presented as a
screenshot.

| Asset | Source | How it was made |
| --- | --- | --- |
| `public/models/ansoniq.glb` | Backyard Volley `assets/character/*.glb` | `npm run build:character` (gltf-transform: keep saved-profile outfit, simplify, Meshopt) |
| `public/models/face/*.png` | `assets/character/face/` | copied unchanged |
| `public/work/volley/ansoniq-poster.webp` | the live web character | headless render of the hero scene |
| `public/work/volley/*-1280.webp`, `*-640.webp` | the running game | Godot 4.7 Movie Maker (`--write-movie`) using the game's own test flags (`--test-offline`, `--autopilot`, `--debug-view`, `--training=spike`, `--rig-view`, `--menu=library`) on a scratch copy of the project |
| `public/work/volley/pose-*.webp`, `hair-*.webp` | the game's menu preview | Movie Maker with `--pose-cycle` / `--hair-cycle`, cropped |
| `public/og.png` | poster + type | `npm run build:og` |
| `public/assets/*.webp` | previous portfolio (`docs/portfolio/source-assets/`) | resized/converted |
| `public/assets/njit-logo.png` | official NJIT wordmark, added by me | used unchanged (transparent PNG, 346×160); shown in the Education entry |
| Hero volleyball | — | drawn by a shader in `components/three/ball.ts` (classic 18-panel beach ball); no model file |
| MatchPoint visuals | — | none yet — the app is private company work; real screenshots pending |

Not used on purpose: the images in `Desktop/just volley images/` (reference
material from another game and AI-generated pose references), and any
MatchPoint branding.

## Rebuilding captures

From a copy of the game project (so the original isn't touched):

```bash
godot --path . --write-movie out/f.png --fixed-fps 10 --quit-after 500 -- --test-offline --autopilot --size=3 --map=0 --target=5
```
