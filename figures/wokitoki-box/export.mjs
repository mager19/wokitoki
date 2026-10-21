// Flattens the styled exploded SVG (CSS custom properties, color-mix, classes) into a plain SVG with
// presentation attributes only, so print tools that ignore CSS still draw it right; then renders a 300 dpi PNG.
// Run after build.mjs:  node export.mjs   (needs Google Chrome)
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const HERE = dirname(fileURLToPath(import.meta.url));
const CHROME = process.env.CHROME_PATH || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const PRINT_WIDTH_IN = 3.4; // the size it is laid out at on the brochure cover
const STROKE = 0.7; // line weight in drawing units for print (about 0.3 pt at the cover size)

const styled = readFileSync(join(HERE, "shots", "exploded-styled.svg"), "utf8");
const tmp = join(HERE, "shots", "flatten.html");
const script = `
const svg = document.querySelector("svg");
const PROPS = ["fill", "fill-opacity", "fill-rule", "stroke", "stroke-opacity", "stroke-width", "stroke-linecap", "stroke-linejoin", "opacity", "clip-rule"];
const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
defs.innerHTML = '<filter id="wk-halo" x="-20%" y="-20%" width="140%" height="160%"><feGaussianBlur stdDeviation="9"/></filter>';
svg.insertBefore(defs, svg.firstChild);
for (const el of svg.querySelectorAll("path,circle,rect,line,polyline,polygon,g")) {
  const cs = getComputedStyle(el);
  if (el.tagName !== "g") {
    for (const p of PROPS) {
      let v = cs.getPropertyValue(p);
      if (!v) continue;
      if (p === "stroke-width") v = String(parseFloat(v) / 0.6 * ${STROKE});
      el.setAttribute(p, v);
    }
    if (cs.mixBlendMode && cs.mixBlendMode !== "normal") el.setAttribute("style", "mix-blend-mode:" + cs.mixBlendMode);
    if (el.classList.contains("iso-halo")) {
      el.setAttribute("filter", "url(#wk-halo)");
      el.setAttribute("transform", "translate(0 3)");
    }
  }
  if (cs.display === "none") el.setAttribute("display", "none");
}
for (const el of svg.querySelectorAll("*")) {
  el.removeAttribute("class");
  el.removeAttribute("vector-effect");
  for (const a of [...el.attributes]) if (a.name.startsWith("data-")) el.removeAttribute(a.name);
}
svg.querySelector("style").remove();
svg.removeAttribute("class");
document.body.setAttribute("data-out", btoa(unescape(encodeURIComponent(svg.outerHTML))));
`;
writeFileSync(tmp, `<!doctype html><html><body style="margin:0">${styled}<script>${script}</script></body></html>`);
const dom = execFileSync(CHROME, ["--headless", "--disable-gpu", "--allow-file-access-from-files", "--virtual-time-budget=4000", "--dump-dom", `file://${tmp}`], { maxBuffer: 64 * 1024 * 1024, stdio: ["ignore", "pipe", "ignore"] }).toString();
const b64 = dom.match(/data-out="([^"]+)"/)[1];
let flat = Buffer.from(b64, "base64").toString("utf8");
flat = flat.replace(/\s(vector-effect|style="")\S*/g, "");
flat = `<?xml version="1.0" encoding="UTF-8"?>\n<!-- WoKiToKi box, exploded view. Concept render: the box is designed, not built. -->\n` + flat;
mkdirSync(join(HERE, "export"), { recursive: true });
writeFileSync(join(HERE, "export", "wokitoki-exploded.svg"), flat);

// 300 dpi PNG at the cover size
const vb = flat.match(/viewBox="([^"]+)"/)[1].split(/\s+/).map(Number);
const px = Math.round(PRINT_WIDTH_IN * 300);
const pxH = Math.round((px * vb[3]) / vb[2]);
const page = join(HERE, "shots", "png.html");
writeFileSync(page, `<!doctype html><html><body style="margin:0;background:transparent"><img src="../export/wokitoki-exploded.svg" style="display:block;width:${px}px;height:${pxH}px"></body></html>`);
execFileSync(CHROME, ["--headless", "--disable-gpu", "--allow-file-access-from-files", "--hide-scrollbars", "--default-background-color=00000000", `--window-size=${px},${pxH}`, "--force-device-scale-factor=1", `--screenshot=${join(HERE, "export", "wokitoki-exploded@300dpi.png")}`, `file://${page}`], { stdio: "ignore" });
rmSync(tmp);
rmSync(page);
console.log(`wrote export/wokitoki-exploded.svg (${(flat.length / 1024).toFixed(0)} KB) and export/wokitoki-exploded@300dpi.png (${px} × ${pxH} px = ${PRINT_WIDTH_IN} × ${(pxH / 300).toFixed(2)} in at 300 dpi)`);
