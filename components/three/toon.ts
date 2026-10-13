// Three.js ports of Backyard Volley's cartoon shaders (scripts/toon.gd):
//   TOON_SHADER / SKIN_MASK_SHADER  → toonMaterial()
//   OUTLINE_SHADER                  → outlineMaterial()
//   FACE_TEX_SHADER                 → faceMaterial()
// Same math, same constants. Skinning comes from three's shader chunks, so the
// materials work on both the skinned body and the rigid head pieces.
import {
  BackSide,
  Color,
  FrontSide,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  Vector2,
  Vector3,
} from "three";

/** Direction toward the key light, in world space (upper-left, in front). */
export const LIGHT_DIR = new Vector3(-0.42, 0.78, 0.46).normalize();
const SHADOW_TINT = new Color(0.58, 0.55, 0.8);
export const INK = new Color(0.06, 0.06, 0.13);

const skinnedVertex = /* glsl */ `
  #include <common>
  #include <color_pars_vertex>
  #include <skinning_pars_vertex>
  uniform vec3 hide;
  uniform vec3 posOffset;
  varying vec3 vViewNormal;
  varying vec3 vViewDir;
  varying vec3 vObjPos;
  varying float vCovered;
  void main() {
    #include <color_vertex>
    #include <beginnormal_vertex>
    #include <skinbase_vertex>
    #include <skinnormal_vertex>
    #include <defaultnormal_vertex>
    #include <begin_vertex>
    vObjPos = position + posOffset;
    #include <skinning_vertex>
    #include <project_vertex>
    vViewNormal = normalize(transformedNormal);
    vViewDir = normalize(-mvPosition.xyz);
    #if defined(USE_COLOR) || defined(USE_COLOR_ALPHA)
      vCovered = dot(vColor.rgb, hide);
    #else
      vCovered = 0.0;
    #endif
  }
`;

const toonFragment = /* glsl */ `
  uniform vec3 albedo;
  uniform vec3 lightDir;
  uniform vec3 shadowTint;
  uniform float shadowAmt;
  varying vec3 vViewNormal;
  varying vec3 vViewDir;
  varying float vCovered;
  void main() {
    if (vCovered > 0.5) discard;
    vec3 n = normalize(vViewNormal);
    vec3 wn = normalize((vec4(n, 0.0) * viewMatrix).xyz);
    float ndl = dot(wn, normalize(lightDir));
    float band = smoothstep(-0.12, 0.22, ndl);
    vec3 shade = albedo * mix(vec3(1.0), shadowTint, shadowAmt);
    vec3 c = mix(shade, albedo, band);
    c = mix(c, c * 1.1 + vec3(0.025), smoothstep(0.72, 0.86, ndl) * 0.7);
    float rim = pow(1.0 - clamp(dot(n, vViewDir), 0.0, 1.0), 3.0);
    gl_FragColor = vec4(c + vec3(rim * 0.05), 1.0);
    #include <colorspace_fragment>
  }
`;

type ToonOptions = { hide?: [number, number, number]; vertexColors?: boolean };

export function toonMaterial(hex: string, opts: ToonOptions = {}) {
  return new ShaderMaterial({
    uniforms: {
      albedo: { value: new Color(hex) },
      lightDir: { value: LIGHT_DIR },
      shadowTint: { value: SHADOW_TINT },
      shadowAmt: { value: 0.3 },
      hide: { value: new Vector3(...(opts.hide ?? [0, 0, 0])) },
    },
    vertexShader: skinnedVertex,
    fragmentShader: toonFragment,
    vertexColors: opts.vertexColors ?? false,
    side: FrontSide,
  });
}

// Screen-space outline: inverted hull pushed along the projected normal by a
// constant number of pixels (scaled to a 1080p reference), so it reads as a
// bold sticker line at any size. depthPush keeps cloth from outlining itself.
const outlineVertex = /* glsl */ `
  #include <common>
  #include <color_pars_vertex>
  #include <skinning_pars_vertex>
  uniform float px;
  uniform float depthPush;
  uniform vec2 viewport;
  uniform vec3 hide;
  varying float vCovered;
  void main() {
    #include <color_vertex>
    #include <beginnormal_vertex>
    #include <skinbase_vertex>
    #include <skinnormal_vertex>
    #include <defaultnormal_vertex>
    #include <begin_vertex>
    #include <skinning_vertex>
    #include <project_vertex>
    #ifdef FLIP_SIDED
      transformedNormal = -transformedNormal; // BackSide flips it; the hull must grow outward
    #endif
    vec4 vp = mvPosition;
    vp.z -= depthPush;
    vec4 clip = projectionMatrix * vp;
    vec2 dir = (projectionMatrix * vec4(transformedNormal, 0.0)).xy;
    float l = length(dir);
    dir = l > 0.0001 ? dir / l : vec2(0.0);
    float w = px * (viewport.y / 1080.0);
    clip.xy += dir * w * 2.0 / viewport * clip.w;
    gl_Position = clip;
    #if defined(USE_COLOR) || defined(USE_COLOR_ALPHA)
      vCovered = dot(vColor.rgb, hide);
    #else
      vCovered = 0.0;
    #endif
  }
`;

const outlineFragment = /* glsl */ `
  uniform vec3 color;
  varying float vCovered;
  void main() {
    if (vCovered > 0.5) discard;
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;

/** Shared so one resize updates every outline. */
export const outlineViewport = { value: new Vector2(1280, 720) };

export function outlineMaterial(px = 3.9, opts: ToonOptions & { depthPush?: number } = {}) {
  return new ShaderMaterial({
    uniforms: {
      color: { value: INK },
      px: { value: px },
      depthPush: { value: opts.depthPush ?? 0 },
      viewport: outlineViewport,
      hide: { value: new Vector3(...(opts.hide ?? [0, 0, 0])) },
    },
    vertexShader: outlineVertex,
    fragmentShader: outlineFragment,
    vertexColors: opts.vertexColors ?? false,
    side: BackSide,
  });
}

// ------------------------------------------------------------------ face
export type FaceTextures = Record<
  | "eyes"
  | "eyesClosed"
  | "eyesHappy"
  | "eyesEffort"
  | "brows"
  | "browsAngry"
  | "mouth"
  | "mouthGrin"
  | "mouthSpike"
  | "mouthSet"
  | "mouthBlock"
  | "nose"
  | "blush",
  Texture
>;

export const FACE_FILES: Record<keyof FaceTextures, string> = {
  eyes: "eyes_00",
  eyesClosed: "eyes_closed",
  eyesHappy: "eyes_happy",
  eyesEffort: "eyes_effort",
  brows: "brows_01",
  browsAngry: "brows_angry",
  mouth: "mouth_05",
  mouthGrin: "mouth_03",
  mouthSpike: "mouth_act_spike",
  mouthSet: "mouth_act_set",
  mouthBlock: "mouth_act_block",
  nose: "nose",
  blush: "blush",
};

export function prepareFaceTexture(t: Texture) {
  // Godot samples these with source_color (sRGB) and top-left UV origin.
  t.colorSpace = SRGBColorSpace;
  t.flipY = false;
  t.needsUpdate = true;
  return t;
}

const faceFragment = /* glsl */ `
  uniform vec3 skin;
  uniform vec3 lightDir;
  uniform vec3 shadowTint;
  uniform float shadowAmt;
  uniform vec3 browColor;
  uniform vec3 eyeColor;
  uniform vec3 blushColor;
  uniform int expr;          // 0 normal, 1 effort, 2 happy
  uniform float blink;
  uniform vec2 look;
  uniform int actionMouth;   // 1 spike, 2 block, 4 set
  uniform float faceDrop;
  uniform float span;
  uniform sampler2D eyesTex, eyesClosed, eyesHappy, eyesEffort;
  uniform sampler2D browsTex, browsAngry;
  uniform sampler2D mouthTex, mouthGrin, mouthSpike, mouthBlock, mouthSet;
  uniform sampler2D noseTex, blushTex;
  varying vec3 vViewNormal;
  varying vec3 vObjPos;
  vec2 fuv(vec2 p) { return vec2(p.x, -p.y) / (2.0 * span) + 0.5; }
  void main() {
    vec3 d = normalize(vObjPos);
    vec3 col = skin;
    float front = smoothstep(0.2, 0.4, -d.z);
    vec2 p = d.xy + vec2(0.0, faceDrop);
    vec2 uv = fuv(p);
    col = mix(col, blushColor, texture2D(blushTex, uv).r * 0.5 * front);
    vec2 euv = fuv(p - look);
    vec4 e = texture2D(eyesTex, euv);
    if (expr == 1) e = texture2D(eyesEffort, euv);
    else if (expr == 2) e = texture2D(eyesHappy, uv);
    if (blink > 0.6 && expr != 2) e = texture2D(eyesClosed, uv);
    float br = texture2D(browsTex, uv).r;
    if (expr == 1) br = texture2D(browsAngry, uv).r;
    col = mix(col, browColor, br * front);
    vec4 m = texture2D(mouthTex, uv);
    if (expr == 2) m = texture2D(mouthGrin, uv);
    if (actionMouth == 1) m = texture2D(mouthSpike, uv);
    else if (actionMouth == 2) m = texture2D(mouthBlock, uv);
    else if (actionMouth == 4) m = texture2D(mouthSet, uv);
    col = mix(col, m.rgb, m.a * front);
    col = mix(col, vec3(0.08, 0.05, 0.05), texture2D(noseTex, uv).r * front);
    col = mix(col, eyeColor, e.r * front);
    col = mix(col, vec3(1.0), e.g * front);
    vec3 wn = normalize((vec4(normalize(vViewNormal), 0.0) * viewMatrix).xyz);
    float band = smoothstep(-0.12, 0.22, dot(wn, normalize(lightDir)));
    vec3 shade = col * mix(vec3(1.0), shadowTint, shadowAmt);
    gl_FragColor = vec4(mix(shade, col, band), 1.0);
    #include <colorspace_fragment>
  }
`;

export function faceMaterial(t: FaceTextures, colors: { skin: string; brow: string; eye: string }) {
  return new ShaderMaterial({
    uniforms: {
      skin: { value: new Color(colors.skin) },
      lightDir: { value: LIGHT_DIR },
      shadowTint: { value: SHADOW_TINT },
      shadowAmt: { value: 0.3 },
      browColor: { value: new Color(colors.brow) },
      eyeColor: { value: new Color(colors.eye) },
      blushColor: { value: new Color(0.97, 0.55, 0.55) },
      expr: { value: 0 },
      blink: { value: 0 },
      look: { value: new Vector2() },
      actionMouth: { value: 0 },
      faceDrop: { value: 0.04 },
      posOffset: { value: new Vector3() },
      span: { value: 0.8 },
      eyesTex: { value: t.eyes },
      eyesClosed: { value: t.eyesClosed },
      eyesHappy: { value: t.eyesHappy },
      eyesEffort: { value: t.eyesEffort },
      browsTex: { value: t.brows },
      browsAngry: { value: t.browsAngry },
      mouthTex: { value: t.mouth },
      mouthGrin: { value: t.mouthGrin },
      mouthSpike: { value: t.mouthSpike },
      mouthBlock: { value: t.mouthBlock },
      mouthSet: { value: t.mouthSet },
      noseTex: { value: t.nose },
      blushTex: { value: t.blush },
    },
    vertexShader: skinnedVertex,
    fragmentShader: faceFragment,
  });
}
