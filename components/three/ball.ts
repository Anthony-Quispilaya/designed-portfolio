// A classic volleyball, drawn by a shader on a plain sphere — no texture, so
// there is no UV seam or stretching to hide.
//
// Topology: a volleyball is a cube mapped onto a sphere. Each of the six faces
// is one group of three parallel panels, and neighbouring groups run crosswise,
// so three groups meet in a pinwheel at every cube corner (the "Y" you see on a
// real ball). Every seam is part of a great circle:
//   - face edges lie on the planes |a| = |b| (e.g. x = ±y),
//   - panel seams lie on planes through the centre, tilted ±15° off the face
//     axis, which splits each face's 90° into three equal 30° panels.
// The fragment shader measures the true angular distance from the surface
// point to the nearest of those planes, so seams keep the same width
// everywhere on the ball and from every viewing angle.
import { Color, ShaderMaterial } from "three";

import { LIGHT_DIR } from "./toon";

const vertex = /* glsl */ `
  varying vec3 vLocal;
  varying vec3 vWorldNormal;
  void main() {
    vLocal = position;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  uniform vec3 panel;
  uniform vec3 seam;
  uniform float halfWidth; // seam half-width, radians of arc
  uniform vec3 lightDir;
  varying vec3 vLocal;
  varying vec3 vWorldNormal;

  // tan(15°): panel seams sit ±15° either side of the face centre.
  const float K = 0.26794919;
  const float INV_K = 0.96592583; // 1 / sqrt(1 + K²) = cos(15°)

  void main() {
    vec3 v = normalize(vLocal);
    vec3 a = abs(v);

    // Which cube face we're on: its axis value (h), the coordinate the three
    // panels are stacked across (c), and the one they run along (r).
    // Faces cycle x → z, y → x, z → y so neighbouring groups run crosswise.
    float h; float c; float r;
    if (a.x >= a.y && a.x >= a.z)      { h = a.x; c = v.z; r = v.y; }
    else if (a.y >= a.z)               { h = a.y; c = v.x; r = v.z; }
    else                               { h = a.z; c = v.y; r = v.x; }

    // Face edges: great circles |c| = h and |r| = h (normal (1,-1)/√2 in that plane).
    float edge = min(abs(abs(c) - h), abs(abs(r) - h)) * 0.70710678;
    // Panel seams: great circles c = ±K·h (normal (1, -K) / √(1+K²)).
    float split = abs(abs(c) - K * h) * INV_K;
    float d = asin(clamp(min(edge, split), 0.0, 1.0));

    // Antialiased line: soft by about one screen pixel, so it stays crisp
    // and doesn't shimmer while the ball spins.
    float aa = fwidth(d);
    float ink = 1.0 - smoothstep(halfWidth - aa, halfWidth + aa, d);
    vec3 col = mix(panel, seam, ink);

    // Two-tone cel shade to match the character.
    float lit = step(0.0, dot(normalize(vWorldNormal), lightDir));
    col *= mix(0.86, 1.0, lit);
    gl_FragColor = vec4(col, 1.0);
    // Colours are given in sRGB; convert like the built-in materials do.
    #include <colorspace_fragment>
  }
`;

export function beachBallMaterial() {
  return new ShaderMaterial({
    uniforms: {
      panel: { value: new Color("#f7f6f1") },
      seam: { value: new Color("#16161b") },
      // ~0.075 of the radius in total line weight, matching the reference icon
      halfWidth: { value: 0.038 },
      lightDir: { value: LIGHT_DIR },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
  });
}
