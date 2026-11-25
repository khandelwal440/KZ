// Renders js/paper.js to the static background images in assets/img/.
// Needs @napi-rs/canvas:  npm i @napi-rs/canvas   then   node kaafizyada-site/tools/paper-texture.mjs
// (set KZ_CANVAS to the package's path if it is installed somewhere else)
import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const canvasPkg = process.env.KZ_CANVAS ? pathToFileURL(process.env.KZ_CANVAS).href : "@napi-rs/canvas";
const { createCanvas } = await import(canvasPkg);
// paper.js is a browser ES module; the repo's package.json is CommonJS, so load it as ESM source.
const src = fs.readFileSync(path.join(here, "../js/paper.js"), "utf8");
const { drawPaper } = await import("data:text/javascript;base64," + Buffer.from(src).toString("base64"));

const out = path.join(here, "../assets/img");
const SHEETS = [
  ["kz-paper-banner", 1750, 500],   // the original banner composition
  ["kz-paper-wide", 1920, 1080],    // desktop page / room background
  ["kz-paper-tall", 1080, 1920],    // phone page / room background
];
for (const [name, w, h] of SHEETS) {
  const c = createCanvas(w, h);
  drawPaper(c.getContext("2d"), w, h);
  const buf = await c.encode("webp", 82);
  fs.writeFileSync(path.join(out, name + ".webp"), buf);
  console.log(name, w + "x" + h, Math.round(buf.length / 1024) + " KB");
}
