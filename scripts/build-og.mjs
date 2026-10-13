// Builds public/og.png (1200×630) from the real character render.
//   node scripts/build-og.mjs
import sharp from "sharp";

const W = 1200;
const H = 630;
const text = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${W}" height="${H}" fill="#f5f3ee"/>
  <g stroke="#17191e" stroke-opacity="0.25">
    ${Array.from({ length: 43 }, (_, i) => `<line x1="${64 + i * 16}" y1="566" x2="${64 + i * 16}" y2="${i % 5 === 0 ? 556 : 561}"/>`).join("")}
  </g>
  <text x="64" y="96" font-family="Consolas, 'Courier New', monospace" font-size="20" letter-spacing="2" fill="#17191e">ANTHONY QUISPILAYA · SOFTWARE ENGINEER</text>
  <text font-family="'Segoe UI', Arial, sans-serif" font-weight="700" font-size="74" letter-spacing="-3" fill="#17191e">
    <tspan x="60" y="230">I build software</tspan>
    <tspan x="60" y="310">people use. And</tspan>
    <tspan x="60" y="390">experiences they</tspan>
  </text>
  <text x="62" y="472" font-family="Georgia, serif" font-style="italic" font-size="78" fill="#4a4fd6">remember.</text>
  <text x="64" y="530" font-family="Consolas, 'Courier New', monospace" font-size="18" fill="#5a5e67">React Native · Supabase · Godot · Blender</text>
</svg>`;

const character = await sharp("public/work/volley/ansoniq-poster.webp")
  .extract({ left: 150, top: 200, width: 560, height: 700 })
  .resize({ height: 540 })
  .toBuffer();

await sharp(Buffer.from(text))
  .composite([{ input: character, left: 760, top: 40 }])
  .png({ compressionLevel: 9 })
  .toFile("public/og.png");
console.log("public/og.png");
