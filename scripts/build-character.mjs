// Builds the web character from the Backyard Volley game assets.
//
//   node scripts/build-character.mjs [path/to/BackyardVolley]
//
// Reads (never writes) the game's Blender exports:
//   assets/character/body_rig.glb       skinned body, uniform, 20 pose clips
//   assets/character/character_kit.glb  head + ear pieces
//   assets/character/hair_kit.glb       hairstyles
//   assets/character/face/*.png         face decal textures
// and writes web-optimized copies to public/models/.
//
// The kept garments match the saved in-game profile ("Ansoniq"): classic
// jersey, short shorts, knee pads, arm sleeves, side-part hair (M3).
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS, EXTMeshoptCompression } from "@gltf-transform/extensions";
import {
  dedup,
  mergeDocuments,
  meshopt,
  prune,
  simplify,
  weld,
} from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptSimplifier } from "meshoptimizer";
import { copyFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";

const gameDir = path.resolve(process.argv[2] ?? "../BackyardVolley");
const outDir = path.resolve("public/models");
const src = (...p) => path.join(gameDir, ...p);

const KEEP_BODY = new Set([
  "Body",
  "Arm.L",
  "Arm.R",
  "Jersey",
  "apparel_shorts_short_01",
  "KneePad.L",
  "KneePad.R",
  "Shoe.L",
  "Shoe.R",
  "Sock.L",
  "Sock.R",
  "Sleeve.L",
  "Sleeve.R",
]);
const KEEP_HEAD = new Set(["Head", "Ear", "Hair.M3"]);
const FACE_TEXTURES = [
  "eyes_00",
  "eyes_closed",
  "eyes_happy",
  "eyes_effort",
  "brows_01",
  "brows_angry",
  "mouth_05",
  "mouth_03",
  "mouth_act_spike",
  "mouth_act_set",
  "mouth_act_block",
  "mouth_act_dive",
  "nose",
  "blush",
];

await MeshoptEncoder.ready;
await MeshoptSimplifier.ready;
const io = new NodeIO()
  .registerExtensions(ALL_EXTENSIONS)
  .registerDependencies({ "meshopt.encoder": MeshoptEncoder });

function keepOnly(doc, keep) {
  for (const node of doc.getRoot().listNodes()) {
    if (node.getMesh() && !keep.has(node.getName())) {
      node.getMesh().dispose();
      node.dispose();
    }
  }
}

async function size(file) {
  return `${((await stat(file)).size / 1024).toFixed(0)} KB`;
}

await mkdir(path.join(outDir, "face"), { recursive: true });

// ---- character ------------------------------------------------------------
const body = await io.read(src("assets/character/body_rig.glb"));
keepOnly(body, KEEP_BODY);

for (const file of ["character_kit.glb", "hair_kit.glb"]) {
  const part = await io.read(src("assets/character", file));
  keepOnly(part, KEEP_HEAD);
  mergeDocuments(body, part);
}

// Fold every merged scene's roots under one "HeadParts" group in the main scene.
const [mainScene, ...extraScenes] = body.getRoot().listScenes();
const headParts = body.createNode("HeadParts");
for (const scene of extraScenes) {
  for (const node of scene.listChildren()) {
    scene.removeChild(node);
    if (node.getMesh()) headParts.addChild(node);
  }
  scene.dispose();
}
mainScene.addChild(headParts);
body.getRoot().setDefaultScene(mainScene);

// Single-buffer output.
const [firstBuffer, ...otherBuffers] = body.getRoot().listBuffers();
for (const accessor of body.getRoot().listAccessors()) accessor.setBuffer(firstBuffer);
for (const b of otherBuffers) b.dispose();

await body.transform(
  prune({ keepAttributes: true }),
  dedup(),
  weld(),
  simplify({ simplifier: MeshoptSimplifier, ratio: 0.32, error: 0.0006, lockBorder: true }),
  prune(),
  meshopt({ encoder: MeshoptEncoder, level: "medium" }),
);
body.createExtension(EXTMeshoptCompression).setRequired(true);
const charOut = path.join(outDir, "ansoniq.glb");
await io.write(charOut, body);
console.log("character ->", charOut, await size(charOut));

// ---- face decals (already small, single-channel masks) ---------------------
for (const name of FACE_TEXTURES) {
  const from = src("assets/character/face", `${name}.png`);
  const to = path.join(outDir, "face", `${name}.png`);
  await copyFile(from, to);
}
console.log("face      ->", FACE_TEXTURES.length, "textures");
