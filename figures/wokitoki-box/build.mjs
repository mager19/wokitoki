// WoKiToKi box: an isometric exploded-view figure built with the anatomy kit.
// node build.mjs            -> wokitoki-box.html (dark) + wokitoki-box-light.html + export/wokitoki-exploded.svg
// node build.mjs --landing  -> landing/ only: the Spanish, landing-themed embeddable fragment + module
// node build.mjs --sim-box  -> landing/sim-box.js only: the assembled box, static, for the "Pruébala" simulator
// node build.mjs --audit    -> also proves the geometry (clearances, depth order, supports, explode frames)
//
// Units are millimetres of the real object: x along the 170 mm length, y across the 110 mm depth, z up.

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "./kit/iso-kit.mjs";
import * as G from "./kit/lathe.mjs";
import { tubePieces, tubeSvg } from "./kit/tube.mjs";
import * as A from "./kit/audit.mjs";
import { figureCss, landingCss } from "./palette.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const LANDING = process.argv.includes("--landing"); // add-only mode: the defaults below are unchanged without it
const SIM_BOX = process.argv.includes("--sim-box"); // add-only mode: the assembled box in the landing style
const LANDING_STYLE = LANDING || SIM_BOX; // same camera and scale as the landing figure, so both read as one object

// ---------------------------------------------------------------- truth
// Real parts (datasheet sizes, mm). The box itself is a concept: designed, not built.
const SPEC = {
  box: { l: 170, w: 110, h: 50 }, // a paperback lying flat, tall enough for 30 mm arcade buttons
  esp32: { l: 52, w: 25.4 }, // ESP32-S3 devkit (N16R8: 16 MB flash, 8 MB PSRAM)
  wroom: { l: 25.5, w: 18, h: 3.1 }, // ESP32-S3-WROOM-1 module
  usbc: { l: 7.35, w: 8.94, h: 3.2 }, // USB-C receptacle
  amp: { l: 17.8, w: 19.3 }, // MAX98357A breakout, class-D 3.2 W
  speaker: { d: 40, depth: 16 }, // 4 ohm 3 W, 40 mm
  ring: { od: 32, id: 18, leds: 8, led: 5 }, // WS2812B ring, 5050 LEDs
  mic: { d: 14 }, // INMP441 I2S MEMS breakout
  button: { hole: 30, flange: 34, cap: 24, below: 25 }, // 30 mm arcade push button
  microswitch: { l: 19.8, w: 6.4, h: 10.2 },
};

// ---------------------------------------------------------------- layout
const OUT = { x: -85, y: -55, w: 170, d: 110, r: 16 };
const WALL = 2.4;
const FLOOR_T = 2.6;
const INNER = k.insetPlan(OUT, WALL);
const SPLIT = 14; // base tray height; the shell sits on its rim
const TOP = 50; // outside top of the shell
const PLATE = TOP - 3; // underside of the shell's top plate
const SPK = [-46, 0];
const RING = [4, 0];
const MIC = [4, 34];
const BTN = { red: [50, 26], green: [50, -26] };
const SCREW_AT = k.corners(OUT, 10);
const ESP = { x: 30, y: -12.7, w: 52, d: 25.4, r: 1 };
const ESP_Z = 8; // underside of the devkit PCB on its 5.4 mm standoffs
const ESP_TOP = ESP_Z + 1.6;
const AMP = { x: -24, y: 20, w: 17.8, d: 19.3, r: 0.8 };
const AMP_Z = 8;
const AMP_TOP = AMP_Z + 1.6;

// Assemblies the box comes apart into, along the vertical axis (assemble <-> exploded).
const PIECES = {
  keys: { name: "Arcade buttons", say: "two 30 mm arcade buttons · talk and listen", move: [0, 0, 248] },
  shell: { name: "Top shell", say: "top shell · speaker grille, light window, mic pinhole", move: [0, 0, 198] },
  lid: { name: "Under the lid", say: "speaker 40 mm · LED ring · I2S microphone · button nuts", move: [0, 0, 86] },
  brain: { name: "Brain and amplifier", say: "ESP32-S3 · 16 MB flash · 8 MB PSRAM · MAX98357A amplifier", move: [0, 0, 30] },
  base: { name: "Base tray", say: "base tray · USB-C port · four rubber feet", move: [0, 0, 0] },
  screws: { name: "Screws", say: "four screws from below · nothing for little fingers to undo", move: [0, 0, -30] },
};
// Landing edition: a compact explode, so the box reads as one box being opened rather than a tall tower.
// (The default/brochure path keeps the moves above untouched.)
const COMPACT = { keys: 220, shell: 194, lid: 94, brain: 50, base: 0, screws: -32 };
if (LANDING_STYLE) for (const [id, z] of Object.entries(COMPACT)) PIECES[id].move = [0, 0, z];
const STAGGER = ["screws", "keys", "shell", "lid", "brain", "base"];
const SPRING = { stagger: 0.07, stiffness: 46, damping: 12.6, substeps: 4 };

// ---------------------------------------------------------------- camera
const W = 600;
const H = LANDING_STYLE ? 760 : 900;
const AZIMUTH = 54;
const ELEVATION = 32;
const lifted = (pts, dz) => pts.map(([x, y, z]) => [x, y, z + dz]);
const FIT = [
  ...k.boxCorners(OUT, -3, SPLIT),
  ...lifted(SCREW_AT.map(([x, y]) => [x, y, 0]), PIECES.screws.move[2]),
  ...lifted(k.boxCorners(OUT, SPLIT, TOP), PIECES.shell.move[2]),
  ...Object.values(BTN).flatMap(([x, y]) => [[x - 17, y - 17, 58 + PIECES.keys.move[2]], [x + 17, y + 17, 58 + PIECES.keys.move[2]]]),
];
const P = k.fitProjection(FIT, W, H, { pad: 26, azimuth: AZIMUTH, elevation: ELEVATION });
const V = G.viewOf(P);
const KS = G.scaleOf(P);
const at = (p) => k.iso(p, P);
const f2 = (v) => Math.round(v * 100) / 100;
const S = (paths, style = {}) => k.solidSvg(paths, style);
const Ln = (d, style) => k.lineSvg(d, style);
const Dots = (points, style) => k.dotsSvg(points, style);
const path3 = (points, closed = false) => k.pathOf(points.map(at), closed);
const UP = (x, y, z) => G.frameOf([x, y, z], [0, 0, 1], [1, 0, 0], [0, 1, 0]);

// ---------------------------------------------------------------- recorder
const R = A.recorder(P, { order: STAGGER, spring: SPRING });
const record = R.solid;
function put(piece, name, ref, svg, shapes = [], { bias = 0, attrs = "", ...rest } = {}) {
  return R.put({ piece, name: R.nameFor(name), at: ref, bias, svg, move: PIECES[piece].move, shapes, attrs, ...rest });
}
const mat = (name, style = {}) => ({ className: `m-${name}`, ...style });

function slab(piece, name, plan, z, h, material, { steps = 3, bevel = 0, tone = "hi", crease = "faint", extra = "", inner = "", bias = 0, cut, lit = false, attrs = "", wrap } = {}) {
  const shape = record(A.slab(plan, z, h, { name, ...(cut ? { cut } : {}) }, steps));
  const body = S(k.slabOf(plan, z, h, P, steps, bevel), mat(material, { tone, crease, inner, lit })) + extra;
  put(piece, name, [plan.x + plan.w / 2, plan.y + plan.d / 2, z + h / 2], wrap ? wrap(body) : body, [shape], { bias, attrs });
  return shape;
}
function cyl(piece, name, [x, y], r, z, h, material, { steps = 40, bevel = 0, tone = "hi", crease = "faint", extra = "", inner = "", bias = 0, cut, lit = false, wrap } = {}) {
  const shape = record(A.cylinder(x, y, r, z, h, { name, ...(cut ? { cut } : {}) }));
  const body = S(k.cylinder(x, y, r, z, h, P, steps, bevel), mat(material, { tone, crease, inner, lit })) + extra;
  put(piece, name, [x, y, z + h / 2], wrap ? wrap(body) : body, [shape], { bias });
  return shape;
}
// The far inner wall of a ring seen through its hole, clipped to the hole.
let clipCount = 0;
function boreSvg([x, y], r, z0, z1) {
  const phi = Math.atan2(t[1], t[0]);
  const arc = (z, from, to) => Array.from({ length: 49 }, (_, i) => {
    const a = from + ((to - from) * i) / 48;
    return [x + r * Math.cos(a), y + r * Math.sin(a), z];
  });
  const top = arc(z1, phi + Math.PI / 2, phi + (3 * Math.PI) / 2);
  const bottom = arc(z0, phi + (3 * Math.PI) / 2, phi + Math.PI / 2);
  const id = `wk-bore-${++clipCount}`;
  const hole = k.ring(x, y, r, z1, P, 72);
  return `<clipPath id="${id}"><path d="${hole}"/></clipPath><g clip-path="url(#${id})"><path class="iso-shade" data-shade="1" d="${path3([...top, ...bottom], true)}"/>${Ln(path3(arc(z0, phi + Math.PI / 2, phi + (3 * Math.PI) / 2)), { tone: "lo" })}</g>`;
}
function ringPart(piece, name, [x, y], rIn, rOut, z, h, material, { tone = "hi", extra = "", inner = "", bias = 0 } = {}) {
  const F = UP(x, y, z);
  const shape = record(A.ring(F, 0, h, rIn, rOut, { name }));
  put(piece, name, [x, y, z + h / 2], S(G.ringBand(0, h, rIn, rOut, F, P, { hole: [h, rIn] }), mat(material, { tone, inner: `<g class="m-${material}">${boreSvg([x, y], rIn, z, z + h)}</g>` + inner, className: `m-${material} wk-annulus` })) + extra, [shape], { bias });
  return shape;
}
function prismPart(piece, name, F, poly, s0, s1, material, { tone = "hi", extra = "", bias = 0 } = {}) {
  const shape = record(A.prism(F, poly, s0, s1, { name }));
  const cx = poly.reduce((a, p) => a + p[0], 0) / poly.length;
  const cy = poly.reduce((a, p) => a + p[1], 0) / poly.length;
  const centre = G.add3(G.add3(G.add3(F.o, G.mul3(F.a, (s0 + s1) / 2)), G.mul3(F.u, cx)), G.mul3(F.v, cy));
  put(piece, name, centre, S(G.prismOf(F, poly, s0, s1, P), mat(material, { tone })) + extra, [shape], { bias });
  return shape;
}

const CABLES = [];
function cable(piece, name, points, r, { bend = 3, shells = [false, false], free = [false, false], material = "cable", rings, touch } = {}) {
  const route = G.fillet(points, Math.max(bend, r * 2.6), 10, { P, tube: r });
  const total = G.pathLength(route);
  const SHELL = Math.max(2.4, r * 3);
  const gaps = [...(shells[0] ? [[0, SHELL]] : []), ...(shells[1] ? [[total - SHELL, total]] : [])];
  const move = PIECES[piece].move;
  R.route(name, route, r, { gaps, limp: true, touch, free, piece, move, ride: piece, rims: shells.map((on) => (on ? r * 1.8 : r)) });
  CABLES.push({ name, piece });
  tubePieces(route, r, P, { maxLength: 10, spacing: Math.max(0.6, Math.min(1.4, r)), gaps, ...(rings ? { rings } : {}) }).forEach((chunk, index) =>
    put(piece, `${name}:${index}`, chunk.mid, `<g class="m-${material}">${tubeSvg(chunk, { tone: "hi" })}</g>`, [A.tube(chunk.points, chunk.radii)], { bias: 0.05, route: name, chunk: index }),
  );
  [0, 1].forEach((index) => {
    const end = index ? route[route.length - 1] : route[0];
    if (shells[index]) {
      const tangent = G.tangentAlong(route, index ? total : 0);
      const F = G.frameAlong(end, tangent);
      const [s0, s1] = index ? [-SHELL, 0] : [0, SHELL];
      const shape = record(A.disc(F, s0, s1, r * 1.8, { name: `${name}.shell${index}`, owner: name }));
      put(piece, `${name}.shell${index}`, G.add3(end, G.mul3(tangent, (s0 + s1) / 2)), S(G.disc(s0, s1, r * 1.8, F, P, { steps: 24, bevel: 0.2 }), mat("dark", { tone: "hi" })), [shape], { bias: 0.15 });
    } else {
      // the solder joint sits on the pad, its centre a little up the wire so it is never sunk into the board
      const size = Math.max(0.6, r * KS * 1.05);
      const tangent = G.tangentAlong(route, index ? total : 0);
      const c = G.add3(end, G.mul3(tangent, (index ? -1 : 1) * (size / KS) * 0.7));
      put(piece, `${name}.end${index}`, c, Dots([at(c)], { size, tone: "hi" }), [A.ball(c, size / KS, { name: `${name}.end${index}`, owner: name })], { bias: 0.2 });
    }
  });
  return route;
}

// ---------------------------------------------------------------- static: halo and feet
const back = [];
back.push(`<path class="iso-halo" d="${k.haloOf(OUT, -3, SPLIT, P)}"/>`);
const FEET = k.corners(OUT, 22);
for (const [x, y] of [...FEET].sort((a, b) => k.depthOf([a[0], a[1], 0], P) - k.depthOf([b[0], b[1], 0], P))) {
  back.push(S(k.cylinder(x, y, 6.5, -3, 3, P, 40, 0.4), mat("rubber", { tone: "hi" })));
  record(A.cylinder(x, y, 6.5, -3, 3, { name: "stand.foot", ground: true }));
}

// ---------------------------------------------------------------- base tray (split into back and front for painter's order)
const t = k.towardViewer(P);
const sil = (sx, sy) => {
  const n = [sx * Math.abs(t[1]), sy * Math.abs(t[0])];
  const L = Math.hypot(...n);
  return [sx * (OUT.w / 2 - OUT.r) + (OUT.r * n[0]) / L, sy * (OUT.d / 2 - OUT.r) + (OUT.r * n[1]) / L];
};
const SIL_A = sil(1, -1);
const SIL_B = sil(-1, 1);
const along = G.unit3([SIL_A[0] - SIL_B[0], SIL_A[1] - SIL_B[1], 0]);
let normal = [-along[1], along[0], 0];
if (normal[0] * t[0] + normal[1] * t[1] < 0) normal = G.mul3(normal, -1);
const HALF = (sign) => A.orientedBox(G.mul3(normal, sign * 300), [normal, along, [0, 0, 1]], [300, 400, 200]);
const CAVITY = A.slab(INNER, -20, 80, {}, 8);
const SCREW_HOLES = SCREW_AT.map(([x, y]) => A.cylinder(x, y, 1.7, -5, 30));
const COUNTERBORES = SCREW_AT.map(([x, y]) => A.cylinder(x, y, 3.2, -5, 7.4));
const USB_Y = [-4.8, 4.8];
const USB_Z = [9.3, 13.1];

const openRing = k.roundedPlan(INNER, 8).map(([x, y]) => [x, y]);
const opening = path3(openRing.map(([x, y]) => [x, y, SPLIT]), true);
const trayPaths = k.slabOf(OUT, 0, SPLIT, P, 10, 0.8);
{
  // floor and the inner faces of the far walls, seen through the opening
  const floorD = path3(openRing.map(([x, y]) => [x, y, FLOOR_T]), true);
  const quads = [];
  const n = openRing.length;
  for (let i = 0; i < n; i++) {
    const [a, b] = [openRing[i], openRing[(i + 1) % n]];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const len = Math.hypot(dx, dy) || 1;
    let inward = [dy / len, -dx / len, 0];
    const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    if (inward[0] * (OUT.x + OUT.w / 2 - mid[0]) + inward[1] * (OUT.y + OUT.d / 2 - mid[1]) < 0) inward = G.mul3(inward, -1);
    if (G.dot3(inward, V) <= 1e-6) continue;
    quads.push(`<path class="iso-shade" data-shade="${Math.min(3, G.toneOf(inward, P))}" d="${path3([[a[0], a[1], FLOOR_T], [b[0], b[1], FLOOR_T], [b[0], b[1], SPLIT], [a[0], a[1], SPLIT]], true)}"/>`);
  }
  const farFloorEdge = [];
  for (let i = 0; i < n; i++) {
    const [a, b] = [openRing[i], openRing[(i + 1) % n]];
    const mid = [(a[0] + b[0]) / 2 - (OUT.x + OUT.w / 2), (a[1] + b[1]) / 2 - (OUT.y + OUT.d / 2)];
    if (mid[0] * t[0] + mid[1] * t[1] < 0) farFloorEdge.push([[a[0], a[1], FLOOR_T], [b[0], b[1], FLOOR_T]]);
  }
  const floorLines = farFloorEdge.map((seg) => path3(seg)).join("");
  const ribs = [-50, -25, 0, 25, 50].map((x) => path3([[x, INNER.y, FLOOR_T], [x, INNER.y + INNER.d, FLOOR_T]])).join("");
  const cavity = `<clipPath id="wk-open"><path d="${opening}"/></clipPath><g clip-path="url(#wk-open)" class="m-base"><path class="iso-top wk-floor" d="${floorD}"/>${Ln(ribs, { tone: "faint" })}${quads.join("")}${Ln(floorLines, { tone: "lo" })}</g>`;
  const shapes = [
    record(A.slab(OUT, 0, FLOOR_T, { name: "base.floor", cut: [...SCREW_HOLES, ...COUNTERBORES] }, 10)),
    record(A.slab(OUT, FLOOR_T, SPLIT - FLOOR_T, { name: "base.walls.back", cut: [CAVITY, HALF(1)] }, 10)),
  ];
  put("base", "base.tray.back", [0, 0, 1], S(trayPaths, mat("base", { tone: "hi" })) + cavity + Ln(opening, { tone: "mid" }), shapes, { bias: -1 });
}
{
  // the two near walls, drawn again over whatever stands in the tray
  const usbOutline = (() => {
    const xF = OUT.x + OUT.w + 0.02;
    const r = (USB_Z[1] - USB_Z[0]) / 2;
    const cz = (USB_Z[0] + USB_Z[1]) / 2;
    const pts = [];
    for (let i = 0; i <= 12; i++) {
      const a = -Math.PI / 2 + (i / 12) * Math.PI;
      pts.push([xF, USB_Y[1] - r + r * Math.cos(a), cz + r * Math.sin(a)]);
    }
    for (let i = 0; i <= 12; i++) {
      const a = Math.PI / 2 + (i / 12) * Math.PI;
      pts.push([xF, USB_Y[0] + r + r * Math.cos(a), cz + r * Math.sin(a)]);
    }
    return pts;
  })();
  const usb = `<path class="wk-hole" d="${path3(usbOutline, true)}"/>` + Ln(path3(usbOutline, true), { tone: "hi" });
  const seam = Ln(k.sideSeam(OUT, 4.5, P, 10), { tone: "faint" });
  // keep only what lies below the screen line through the two silhouette corners: the near walls and their rim
  const [a0, b0] = [at([SIL_B[0], SIL_B[1], SPLIT]), at([SIL_A[0], SIL_A[1], SPLIT])];
  const dir = [b0[0] - a0[0], b0[1] - a0[1]];
  const far = (p, s) => [p[0] + dir[0] * s, p[1] + dir[1] * s];
  const below = k.pathOf([far(a0, -3), far(b0, 3), [far(b0, 3)[0], far(b0, 3)[1] + 2000], [far(a0, -3)[0], far(a0, -3)[1] + 2000]], true);
  const front = `<clipPath id="wk-near"><path d="${below}"/></clipPath><clipPath id="wk-rim"><path clip-rule="evenodd" d="${trayPaths.fill}${opening}"/></clipPath><g clip-path="url(#wk-near)"><g clip-path="url(#wk-rim)">${S(trayPaths, mat("base", { tone: "hi", inner: seam }))}</g>${Ln(opening, { tone: "mid" })}</g>${usb}`;
  const shapes = [record(A.slab(OUT, FLOOR_T, SPLIT - FLOOR_T, { name: "base.walls.front", cut: [CAVITY, HALF(-1)] }, 10))];
  put("base", "base.tray.front", [OUT.x + OUT.w, OUT.y + OUT.d, SPLIT / 2], front, shapes, { bias: 2 });
}
// screw bosses moulded in the tray, and brass standoffs for the two boards
SCREW_AT.forEach(([x, y]) => {
  cyl("base", "base.boss", [x, y], 4, FLOOR_T, SPLIT - FLOOR_T, "base", { cut: [A.cylinder(x, y, 1.7, -5, 30)], extra: Ln(k.ring(x, y, 1.7, SPLIT, P, 24), { tone: "mid" }) + `<path class="wk-hole" d="${k.ring(x, y, 1.7, SPLIT, P, 24)}"/>` });
});
const ESP_HOLES = [[ESP.x + 2.6, ESP.y + 2.6], [ESP.x + ESP.w - 2.6, ESP.y + 2.6], [ESP.x + 2.6, ESP.y + ESP.d - 2.6], [ESP.x + ESP.w - 2.6, ESP.y + ESP.d - 2.6]];
const AMP_HOLES = [[AMP.x + 2.4, AMP.y + 2.4], [AMP.x + AMP.w - 2.4, AMP.y + AMP.d - 2.4]];
[...ESP_HOLES.map((p) => [p, ESP_Z]), ...AMP_HOLES.map((p) => [p, AMP_Z])].forEach(([p, z]) => cyl("base", "base.standoff", p, 2.2, FLOOR_T, z - FLOOR_T, "brass", { steps: 6 }));

// ---------------------------------------------------------------- screws (from below, into the shell's bosses)
SCREW_AT.forEach(([x, y]) => {
  const head = record(A.cylinder(x, y, 2.8, 0.2, 2.2, { name: "screw.head" }));
  const shank = record(A.cylinder(x, y, 1.4, 2.4, 24, { name: "screw.shank" }));
  const threads = Array.from({ length: 22 }, (_, i) => k.sideArc(x, y, 1.4, 4 + i * 1, P, 12)).join("");
  const svg = S(k.cylinder(x, y, 2.8, 0.2, 2.2, P, 28, 0.3), mat("metal", { tone: "hi" })) + S(k.cylinder(x, y, 1.4, 2.4, 24, P, 20), mat("metal", { tone: "hi", inner: Ln(threads, { tone: "lo" }) }));
  put("screws", "screw", [x, y, 13], svg, [head, shank]);
});

// ---------------------------------------------------------------- brain: ESP32-S3 devkit and MAX98357A amplifier
{
  const pads = [];
  for (let i = 0; i < 19; i++) for (const y of [ESP.y + 1.27, ESP.y + ESP.d - 1.27]) pads.push([ESP.x + 4 + i * 2.54, y]);
  const padRings = pads.map(([x, y]) => k.ring(x, y, 0.75, ESP_TOP, P, 12)).join("");
  const holes = ESP_HOLES.map(([x, y]) => k.ring(x, y, 1.6, ESP_TOP, P, 20)).join("");
  const traces = Ln([path3([[ESP.x + 9, ESP.y + 5, ESP_TOP], [ESP.x + 9, ESP.y + ESP.d - 5, ESP_TOP]]), path3([[ESP.x + 66 - 10, ESP.y + 5, ESP_TOP], [ESP.x + 66 - 10, ESP.y + ESP.d - 5, ESP_TOP]])].join(""), { tone: "faint" });
  const extra = Ln(padRings + holes, { tone: "faint" }) + Dots(pads.map(([x, y]) => at([x, y, ESP_TOP])), { size: 0.32, tone: "mid" }) + Dots(ESP_HOLES.map(([x, y]) => at([x, y, ESP_TOP])), { size: 0.8, tone: "hi" });
  slab("brain", "esp32.pcb", ESP, ESP_Z, 1.6, "pcb", { steps: 3, extra, tone: "hi" });
  void traces;
}
// WROOM module: antenna strip and metal shield
{
  const ant = { x: ESP.x + 1, y: -9, w: 6.6, d: 18, r: 0.5 };
  const meander = [];
  for (let i = 0; i < 6; i++) {
    const y0 = ant.y + 2 + i * 2.8;
    meander.push([ant.x + 1.2, y0, ESP_TOP + 0.8], [ant.x + ant.w - 1.2, y0, ESP_TOP + 0.8], [ant.x + ant.w - 1.2, y0 + 1.4, ESP_TOP + 0.8], [ant.x + 1.2, y0 + 1.4, ESP_TOP + 0.8]);
  }
  const antExtra = Ln(path3([[ant.x + ant.w, ant.y + 2, ESP_TOP + 0.8], ...meander, [ant.x + 1.2, ant.y + ant.d - 0.6, ESP_TOP + 0.8], [ant.x + ant.w, ant.y + ant.d - 0.6, ESP_TOP + 0.8]]), { tone: "lo" });
  slab("brain", "esp32.antenna", ant, ESP_TOP, 0.8, "pcb2", { extra: antExtra });
  const shield = { x: ant.x + ant.w, y: -8.6, w: 18.4, d: 17.2, r: 0.6 };
  const dimples = [[4, 4], [14, 4], [4, 13], [14, 13]].map(([dx, dy]) => at([shield.x + dx, shield.y + dy, ESP_TOP + 3.1]));
  slab("brain", "esp32.shield", shield, ESP_TOP + 0.8, 2.3, "metal", { bevel: 0.4, extra: Ln(k.planOutline(k.insetPlan(shield, 1.6), ESP_TOP + 3.1, P, 3), { tone: "faint" }) + Dots(dimples, { size: 0.4, tone: "lo" }) });
  // module carrier under the shield
  slab("brain", "esp32.module", { x: ant.x + ant.w, y: -9, w: 18.9, d: 18, r: 0.4 }, ESP_TOP, 0.8, "pcb2");
}
// USB-C receptacle at the end wall, BOOT and RST buttons, LDO and the RGB status LED
{
  const u = { x: ESP.x + ESP.w - SPEC.usbc.l + 0.4, y: -SPEC.usbc.w / 2, w: SPEC.usbc.l, d: SPEC.usbc.w, r: 1.4 };
  const xF = u.x + u.w + 0.02;
  const mouth = [];
  for (let i = 0; i <= 24; i++) {
    const a = (i / 24) * Math.PI * 2;
    const ry = 3.6;
    const rz = 0.9;
    const yy = Math.cos(a) * ry;
    const zz = Math.sin(a) * rz;
    mouth.push([xF, Math.max(-ry + rz, Math.min(ry - rz, yy)) + Math.sign(yy) * Math.max(0, Math.abs(Math.cos(a) * rz) - 0) * 0, ESP_TOP + 1.6 + zz]);
  }
  const mouthD = path3(mouth, true);
  slab("brain", "esp32.usbc", u, ESP_TOP, SPEC.usbc.h, "metal", { steps: 4, bevel: 0.3, extra: `<path class="wk-hole" d="${mouthD}"/>` + Ln(mouthD, { tone: "lo" }) });
  for (const [i, y] of [[0, -7.6], [1, 4.4]]) {
    const b = { x: ESP.x + ESP.w - 15, y, w: 3.4, d: 4.2, r: 0.4 };
    slab("brain", "esp32.switch", b, ESP_TOP, 1.4, "dark", {
      extra: S(k.cylinder(b.x + 1.7, b.y + 2.1, 0.9, ESP_TOP + 1.4, 0.5, P, 16), mat("metal", { tone: "hi" })),
    });
    void i;
  }
  slab("brain", "esp32.ldo", { x: ESP.x + ESP.w - 21, y: -2.6, w: 3.6, d: 5.2, r: 0.2 }, ESP_TOP, 1.4, "dark");
  slab("brain", "esp32.led", { x: ESP.x + ESP.w - 20.4, y: 4.6, w: 1.8, d: 1.8, r: 0.2 }, ESP_TOP, 0.9, "led", { attrs: ' data-status=""' });
}
// MAX98357A amplifier with its 2-way screw terminal
{
  const pads = Array.from({ length: 7 }, (_, i) => [AMP.x + AMP.w - 1.5, AMP.y + 2 + i * 2.54]);
  const extra = Ln(pads.map(([x, y]) => k.ring(x, y, 0.75, AMP_TOP, P, 12)).join("") + AMP_HOLES.map(([x, y]) => k.ring(x, y, 1.5, AMP_TOP, P, 20)).join(""), { tone: "faint" }) + Dots(pads.map(([x, y]) => at([x, y, AMP_TOP])), { size: 0.32, tone: "mid" }) + Dots(AMP_HOLES.map(([x, y]) => at([x, y, AMP_TOP])), { size: 0.8, tone: "hi" });
  slab("brain", "amp.pcb", AMP, AMP_Z, 1.6, "pcb", { extra });
  slab("brain", "amp.chip", { x: AMP.x + 7, y: AMP.y + 8, w: 3, d: 3, r: 0.2 }, AMP_TOP, 0.8, "dark", { extra: Dots([at([AMP.x + 7.6, AMP.y + 8.6, AMP_TOP + 0.8])], { size: 0.3, tone: "lo" }) });
  const term = { x: AMP.x + 0.4, y: AMP.y + 4.6, w: 6.4, d: 10.2, r: 0.4 };
  const screws = [term.y + 2.55, term.y + 7.63].map((y) => [term.x + 3.6, y]);
  const screwHeads = screws.map(([x, y]) => S(k.cylinder(x, y, 1.5, 17.6, 0.4, P, 20), mat("metal", { tone: "hi", inner: Ln(k.lineOnTop([x - 1, y + 0.6], [x + 1, y - 0.6], 18, P), { tone: "lo" }) }))).join("");
  slab("brain", "amp.terminal", term, AMP_TOP, 8, "green", { bevel: 0.3, extra: screwHeads });
}
// cables: soldered to the devkit's edge pads, plugged onto the parts under the lid and on the switches
const PAD = (i, side) => [ESP.x + 4 + i * 2.54, side > 0 ? ESP.y + ESP.d - 1.27 : ESP.y + 1.27, ESP_TOP];
const SW = (id) => ({ x: BTN[id][0] - SPEC.microswitch.l / 2, y: BTN[id][1] - SPEC.microswitch.w / 2, w: SPEC.microswitch.l, d: SPEC.microswitch.w, r: 0.4 });
const SW_Z = [11.8, 22];
const RING_Z = 43; // underside of the LED ring board
const MIC_Z = 44; // underside of the microphone board
const SPK_TAB = { x: -27.4, y: -3.4, w: 5.4, d: 6.8, r: 0.6 };
const SPK_TAB_Z = [44.6, 45.8];
{
  const red = SW("red");
  const green = SW("green");
  const pr = PAD(4, 1);
  cable("brain", "cable.talk", [pr, [pr[0], pr[1], 16.5], [pr[0], red.y, 16.5]], 0.75, { shells: [false, true], free: [false, true], bend: 3 });
  const pg = PAD(4, -1);
  cable("brain", "cable.listen", [pg, [pg[0], pg[1], 16.5], [pg[0], green.y + green.d, 16.5]], 0.75, { shells: [false, true], free: [false, true], bend: 3 });
  const pl = PAD(1, -1);
  cable("brain", "cable.ring", [pl, [pl[0], pl[1], 30], [RING[0] + 13, RING[1] - 4, 30], [RING[0] + 13, RING[1] - 4, RING_Z]], 0.8, { shells: [false, true], free: [false, true], bend: 4 });
  const pm = PAD(1, 1);
  cable("brain", "cable.mic", [pm, [pm[0], pm[1], 30], [MIC[0] + 4, MIC[1] - 1.5, 30], [MIC[0] + 4, MIC[1] - 1.5, MIC_Z]], 0.8, { shells: [false, true], free: [false, true], bend: 4 });
  const pa = PAD(8, 1);
  cable("brain", "cable.amp", [pa, [pa[0], pa[1], 14], [pa[0], 15.6, 14], [AMP.x + AMP.w - 1.5, 15.6, 14], [AMP.x + AMP.w - 1.5, AMP.y + 9.62, 14], [AMP.x + AMP.w - 1.5, AMP.y + 9.62, AMP_TOP]], 0.9, { bend: 3 });
  const ty = AMP.y + 4.6 + 5.09;
  cable("brain", "cable.speaker", [[AMP.x + 0.4, ty, 12.2], [AMP.x - 2.6, ty, 12.2], [AMP.x - 2.6, ty, 36], [SPK_TAB.x + 2.7, 0, 36], [SPK_TAB.x + 2.7, 0, SPK_TAB_Z[0]]], 0.75, { shells: [false, true], free: [false, true], bend: 4, material: "dark" });
}

// ---------------------------------------------------------------- under the lid: speaker, LED ring, microphone, button nuts
{
  const F = G.frameOf([SPK[0], SPK[1], PLATE], [0, 0, -1], [1, 0, 0], [0, -1, 0]);
  const profile = [[0, 20], [1.2, 20], [1.2, 18.4], [9, 10.5, 1], [9.6, 10.5], [15.6, 10.5], [16, 9]];
  const shape = record(A.solid(F, profile, { name: "speaker" }));
  const z = PLATE;
  const disc = (r) => k.ring(SPK[0], SPK[1], r, z, P, 72);
  const face = [
    `<path class="wk-surround" d="${disc(18.2)}"/>`,
    `<path class="wk-cone" d="${disc(15.6)}"/>`,
    Ln(disc(18.2) + disc(15.6), { tone: "mid" }),
    Ln(disc(12.4) + disc(9.6), { tone: "faint" }),
    S(G.sphereOf([SPK[0], SPK[1], z - 2.6], 5.2, P, { steps: 40 }), mat("cone", { tone: "mid" })),
  ].join("");
  // the dust cap rises out of the cone; clip it to the cone mouth
  const clip = `<clipPath id="wk-cone"><path d="${disc(15.6)}"/></clipPath>`;
  const faceClipped = `${clip}<g clip-path="url(#wk-cone)">${face}</g>${Ln(disc(18.2) + disc(15.6), { tone: "mid" })}`;
  const bolts = Dots([0, 1, 2, 3].map((i) => at([SPK[0] + 19.1 * Math.cos(Math.PI / 4 + (i * Math.PI) / 2), SPK[1] + 19.1 * Math.sin(Math.PI / 4 + (i * Math.PI) / 2), z])), { size: 0.55, tone: "hi" });
  put("lid", "speaker", [SPK[0], SPK[1], z - 8], S(G.solidOf(profile, F, P), mat("metal", { tone: "hi" })) + faceClipped + bolts, [shape]);
  slab("lid", "speaker.tabs", SPK_TAB, SPK_TAB_Z[0], SPK_TAB_Z[1] - SPK_TAB_Z[0], "pcb2", { extra: Dots([1.6, -1.6].map((y) => at([SPK_TAB.x + 1.2, y, SPK_TAB_Z[1]])), { size: 0.5, tone: "hi" }) });
}
{
  const [cx, cy] = RING;
  ringPart("lid", "ring.pcb", RING, 9, 16, RING_Z, 1.6, "pcb", {
    extra: Dots([0, 1, 2].map((i) => at([cx + 14.6, cy - 1.6 - i * 2.4, RING_Z + 1.6])), { size: 0.45, tone: "hi" }),
  });
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const u = [Math.cos(a), Math.sin(a), 0];
    const v = [-Math.sin(a), Math.cos(a), 0];
    const F = G.frameOf([cx + 12.5 * u[0], cy + 12.5 * u[1], RING_Z + 1.6], [0, 0, 1], u, v);
    const top = RING_Z + 1.6 + 1.6;
    const lens = `<path class="wk-led" style="--i:${i}" d="${k.ring(cx + 12.5 * u[0], cy + 12.5 * u[1], 1.7, top, P, 20)}"/>`;
    prismPart("lid", "ring.led", F, [[-2.5, -2.5], [2.5, -2.5], [2.5, 2.5], [-2.5, 2.5]], 0, 1.6, "led", { extra: lens + Ln(k.ring(cx + 12.5 * u[0], cy + 12.5 * u[1], 1.7, top, P, 20), { tone: "lo" }) });
  }
  for (let i = 0; i < 3; i++) {
    const a = ((i * 3 + 1.5) / 8) * Math.PI * 2;
    cyl("lid", "ring.clip", [cx + 12.5 * Math.cos(a), cy + 12.5 * Math.sin(a)], 1.1, RING_Z + 1.6, PLATE - RING_Z - 1.6, "dark", { steps: 16 });
  }
}
{
  const [mx, my] = MIC;
  const pads = Array.from({ length: 6 }, (_, i) => [mx - 3.6 + (i % 3) * 3.6, my + (i < 3 ? -4.4 : 4.4)]);
  cyl("lid", "mic.pcb", MIC, 7, MIC_Z, 1.6, "pcb", { extra: Ln(pads.map(([x, y]) => k.ring(x, y, 0.6, MIC_Z + 1.6, P, 12)).join(""), { tone: "faint" }) + Dots(pads.map(([x, y]) => at([x, y, MIC_Z + 1.6])), { size: 0.3, tone: "mid" }) });
  ringPart("lid", "mic.gasket", MIC, 1, 2.6, MIC_Z + 1.6, PLATE - MIC_Z - 1.6, "rubber");
  slab("lid", "mic.chip", { x: mx + 3.2, y: my - 1.4, w: 2.4, d: 2.8, r: 0.3 }, MIC_Z + 1.6, 0.9, "metal");
}
for (const id of ["red", "green"]) {
  const [x, y] = BTN[id];
  const F = UP(x, y, 40);
  const ribs = k.fadedSvg(G.ribsOf(F, 0.6, 6.4, 19, 48, P, { fade: [0.1, 0.55], seams: true }), { tone: "lo" });
  ringPart("lid", `nut.${id}`, [x, y], 14, 19, 40, 7, id, { extra: ribs });
}

// ---------------------------------------------------------------- top shell
const SHELL_HOLES = Object.values(BTN).map(([x, y]) => A.cylinder(x, y, 15, PLATE - 1, 5));
{
  const holes = [];
  holes.push([0, 0]);
  for (const [r, n] of [[4.6, 6], [9.2, 12], [13.8, 18], [18.2, 24]]) for (let i = 0; i < n; i++) holes.push([r * Math.cos((i / n) * Math.PI * 2 + r), r * Math.sin((i / n) * Math.PI * 2 + r)]);
  const grille = holes.map(([dx, dy]) => k.ring(SPK[0] + dx, SPK[1] + dy, 1.05, TOP, P, 12)).join("");
  const win = k.ring(RING[0], RING[1], 17, TOP, P, 72);
  const winGroove = k.ring(RING[0], RING[1], 18.6, TOP, P, 72);
  const micHole = k.ring(MIC[0], MIC[1], 0.6, TOP, P, 12);
  const micRing = k.ring(MIC[0], MIC[1], 2.2, TOP, P, 24);
  const details = [
    `<path class="wk-hole" d="${grille}"/>`,
    Ln(k.ring(SPK[0], SPK[1], 21.4, TOP, P, 72), { tone: "faint" }),
    `<path class="wk-window" d="${win}"/>`,
    `<path class="wk-glow" d="${win}"/>`,
    Ln(win, { tone: "mid" }),
    Ln(winGroove, { tone: "faint" }),
    `<path class="wk-hole" d="${micHole}"/>`,
    ...Object.values(BTN).map(([x, y]) => `<path class="wk-hole wk-bore" d="${k.ring(x, y, 15, TOP, P, 64)}"/>` + Ln(k.ring(x, y, 15, TOP, P, 64), { tone: "mid" })),
    Ln(micRing, { tone: "faint" }),
    Ln(k.planOutline(k.insetPlan(OUT, 6), TOP, P, 10), { tone: "faint" }),
  ].join("");
  const shape = record(A.slab(OUT, SPLIT, TOP - SPLIT, { name: "shell", cut: [A.slab(INNER, -40, PLATE + 40, {}, 8), ...SHELL_HOLES] }, 10));
  const bosses = SCREW_AT.map(([x, y]) => record(A.cylinder(x, y, 3.8, SPLIT, PLATE - SPLIT, { name: "shell.boss", cut: [A.cylinder(x, y, 1.2, 0, 60)] })));
  put("shell", "shell", [0, 0, (SPLIT + TOP) / 2], S(k.slabOf(OUT, SPLIT, TOP - SPLIT, P, 10, 1.6), mat("shell", { tone: "hi" })) + details, [shape, ...bosses]);
}

// ---------------------------------------------------------------- arcade buttons
// The housing, switch and tabs live inside the shell until they slide out through the 30 mm hole:
// each is clipped to the column above the shell's top face, and the clip rides the shell (data-follow).
const SLIDE_CLIP = (id) => `wk-slide-${id}`;
for (const id of ["red", "green"]) {
  const [x, y] = BTN[id];
  const column = k.cylinder(x, y, 15.4, TOP, 420, P, 64).fill;
  const clipDef = `<clipPath id="${SLIDE_CLIP(id)}"><path data-follow="shell" d="${column}"/></clipPath>`;
  const clipped = (body) => `<g clip-path="url(#${SLIDE_CLIP(id)})">${body}</g>`;
  const threads = Array.from({ length: 8 }, (_, i) => k.sideArc(x, y, 14, 25 + i * 2, P, 40)).join("");
  cyl("keys", `button.${id}.housing`, [x, y], 14, SW_Z[1], PLATE + 3 - SW_Z[1], id, { inner: Ln(threads, { tone: "mid" }), wrap: (body) => clipDef + clipped(body) });
  const sw = SW(id);
  slab("keys", `button.${id}.switch`, sw, SW_Z[0], SW_Z[1] - SW_Z[0], "dark", { extra: Dots([at([sw.x + 2, sw.y + sw.d, SW_Z[0] + 2]), at([sw.x + sw.w - 2, sw.y + sw.d, SW_Z[0] + 2])], { size: 0.5, tone: "lo" }), wrap: clipped });
  for (const dx of [-7, 0, 7]) slab("keys", `button.${id}.tab`, { x: x + dx - 1.6, y: y - 0.25, w: 3.2, d: 0.5, r: 0.1 }, 6, SW_Z[0] - 6, "metal", { steps: 1, wrap: clipped });
  cyl("keys", `button.${id}.flange`, [x, y], 17, TOP, 2.4, id, { bevel: 0.6 });
  const capTop = TOP + 2.4 + 5;
  cyl("keys", `button.${id}.cap`, [x, y], 12, TOP + 2.4, 5, id, {
    bevel: 0.8,
    lit: false,
    extra: Ln(k.ring(x, y, 8.6, capTop, P, 56), { tone: "mid" }),
    wrap: (body) => `<g data-cap="${id}">${body}</g>`,
  });
}

// ---------------------------------------------------------------- settle and audit
A.settle(R, P);
R.items.sort((a, b) => a.key - b.key);

const LABEL =
  "An exploded isometric view of a children's voice device: a rounded rectangular box the size of a paperback, with an off-white top shell and a banana-yellow base. From top to bottom: a red and a green 30 mm arcade button; the top shell with a round speaker grille, a frosted light window and a microphone pinhole; under the lid a 40 mm speaker, a ring of eight colour LEDs, a MEMS microphone board and the two button nuts; the ESP32-S3 board with its USB-C port and a class-D amplifier with wires to the speaker and the switches; the base tray on four rubber feet; and four screws from below.";

const groups = (pose) =>
  R.items.map((item, index) => {
    const [mx, my, mz] = item.move;
    const offset = pose ? at([mx, my, mz]).map((v, i) => v - at([0, 0, 0])[i]) : null;
    const tr = offset && (Math.abs(offset[0]) > 0.001 || Math.abs(offset[1]) > 0.001) ? ` transform="translate(${offset[0].toFixed(2)} ${offset[1].toFixed(2)})"` : "";
    const body = pose
      ? item.svg.replace(/data-follow="(\w+)"/g, (_, other) => {
          const d = G.sub3(PIECES[other].move, item.move);
          const o = at(d).map((v, i) => v - at([0, 0, 0])[i]);
          return `transform="translate(${o[0].toFixed(2)} ${o[1].toFixed(2)})"`;
        })
      : item.svg;
    return { key: item.key + (pose ? G.dot3(item.move, V) : 0), svg: `<g class="it" data-piece="${item.piece}" data-k="${item.key.toFixed(2)}" data-m="${mx},${my},${mz}" data-i="${index}"${tr}${item.attrs ?? ""}>${body}</g>` };
  });

const unit = (vector) => {
  const o = at([0, 0, 0]);
  const p = at(vector);
  return [p[0] - o[0], p[1] - o[1]];
};
const DATA = {
  V,
  EX: unit([1, 0, 0]),
  EY: unit([0, 1, 0]),
  EZ: unit([0, 0, 1]),
  pieces: Object.fromEntries(Object.entries(PIECES).map(([id, p]) => [id, { name: p.name, say: p.say }])),
  stagger: STAGGER,
  spring: SPRING,
  order: ["keys", "shell", "lid", "brain", "base", "screws"],
  press: unit([0, 0, -3]),
  moves: Object.fromEntries(Object.entries(PIECES).map(([id, p]) => [id, p.move])),
  parts: R.items.length,
};
// assembled, the box sits low in the card (the room above is for the explode): lift it to the middle
{
  const ys = [...k.boxCorners(OUT, -3, TOP), ...Object.values(BTN).map(([x, y]) => [x, y, TOP + 7.4])].map((p) => at(p)[1]);
  DATA.shift = H / 2 - (Math.min(...ys) + Math.max(...ys)) / 2;
}

const CSS = readFileSync(join(HERE, "wokitoki.css"), "utf8") + "\n" + figureCss({ live: true });
const LIVE = readFileSync(join(HERE, "live.js"), "utf8").replace("__DATA__", JSON.stringify(DATA));
const kitScript = readFileSync(join(HERE, "kit", "iso-kit.mjs"), "utf8").replace(/^export /gm, "");

const svgOf = (body, extraClass = "") => `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg wk-svg${extraClass}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${LABEL}">${body}</svg>`;
const assembled = groups(false);
const figure = svgOf(`<g class="wk-scene" transform="translate(0 ${DATA.shift.toFixed(1)})">${back.join("")}<g class="wk-items">${assembled.map((g) => g.svg).join("")}</g></g>`);

const PARTS = DATA.order.map((id, index) => `<button type="button" class="wk-part" data-part="${id}"><span class="wk-num">${String(index + 1).padStart(2, "0")}</span>${PIECES[id].name}</button>`).join("");
const controls = `<div class="wk-controls"><button type="button" class="wk-btn" data-apart aria-pressed="false"><span data-apart-label>Take apart</span></button><button type="button" class="wk-btn wk-btn-red" data-press="red">Talk</button><button type="button" class="wk-btn wk-btn-green" data-press="green">Listen</button></div>`;
const corners = `<div class="iso-plate-corners" aria-hidden="true"><span class="iso-plate-corner" data-corner="fig">Fig 1</span><span class="iso-plate-corner" data-corner="title">The box · exploded</span><span class="iso-plate-corner" data-corner="hint">Space · R · G</span><span class="iso-plate-corner" data-corner="readout" data-readout>assembled · ${R.items.length} parts</span></div>`;
const stage = `<div class="wk-stage" tabindex="0" role="group" aria-label="The box, drawn in isometric view. Press Space or the Take apart button to explode it along its vertical axis; press R to talk (the light ring turns red) and G to listen (the ring breathes in a family colour).">${figure}<span class="wk-sr" role="status" aria-live="polite" data-live></span></div>`;
const caption =
  "A concept, designed but not built. The box is 170 × 110 × 50 mm, the size of a paperback lying flat. Two 30 mm arcade buttons go through the top shell; under it sit a 40 mm, 4 Ω 3 W speaker behind the grille, a ring of eight WS2812B LEDs under the frosted window and an INMP441 I2S microphone behind the pinhole. An ESP32-S3 board (16 MB flash, 8 MB PSRAM, WiFi) drives a MAX98357A class-D amplifier with a limiter, and takes its power through USB-C in the base. No screen, no words: red talks, green listens. The battery is still undecided, so it is left out.";
const plate = `<figure class="iso-figure wk"><div class="iso-plate">${corners}${stage}${controls}</div><figcaption class="iso-legend"><span class="wk-parts">${PARTS}</span><span class="iso-caption">${caption}</span></figcaption></figure>`;

if (!LANDING_STYLE) for (const theme of ["dark", "light"]) {
  const page = k.pageHtml({ title: "The box · exploded", theme, body: `<style>${CSS}</style>${plate}`, script: kitScript + LIVE, width: 720 });
  const name = theme === "light" ? "wokitoki-box-light.html" : "wokitoki-box.html";
  writeFileSync(join(HERE, name), page);
  console.log("wrote", name, `${(page.length / 1024).toFixed(0)} KB`);
}

// ---------------------------------------------------------------- static print export: exploded pose, light theme, no card
if (!LANDING_STYLE) {
  const apart = groups(true).sort((a, b) => a.key - b.key);
  const css = k.ISO_CSS + readFileSync(join(HERE, "wokitoki.css"), "utf8") + figureCss({ live: false, scope: ".wk" });
  // crop the viewBox to the drawing in the apart pose
  const box = [Infinity, Infinity, -Infinity, -Infinity];
  for (const p of FIT) {
    const [sx, sy] = at(p);
    box[0] = Math.min(box[0], sx);
    box[1] = Math.min(box[1], sy);
    box[2] = Math.max(box[2], sx);
    box[3] = Math.max(box[3], sy);
  }
  const padX = 10;
  const vb = [box[0] - padX, box[1] - padX, box[2] - box[0] + 2 * padX, box[3] - box[1] + 2 * padX + 12].map((v) => v.toFixed(1));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="iso iso-svg wk wk-svg wk-print" data-theme="light" viewBox="${vb.join(" ")}" width="${vb[2]}" height="${vb[3]}" role="img" aria-label="${LABEL}"><style>${css}</style>${back.join("")}<g class="wk-items">${apart.map((g) => g.svg).join("")}</g></svg>`;
  // the print figure shows the ring off: drop the live light overlays
  const still = svg.replace(/<path class="wk-(glow|led)"[^>]*\/>/g, "");
  mkdirSync(join(HERE, "shots"), { recursive: true });
  writeFileSync(join(HERE, "shots", "exploded-styled.svg"), still);
  console.log("wrote shots/exploded-styled.svg (run node export.mjs to flatten it for print)", `viewBox ${vb.join(" ")}`);
}

if (LANDING) buildLanding();
if (SIM_BOX) buildSimBox();

console.log(`${R.items.length} items · ${CABLES.length} cables · scale ${KS.toFixed(3)} px/mm`);
const named = (re) => (name) => re.test(name);
const ALLOW = [
  // screws sit inside the base bosses and the floor's counterbores: hidden at rest, below the base when apart
  [named(/^screw/), named(/^base\./)],
  // housing, switch and tabs are clipped to the column above the shell's top face (SLIDE_CLIP), so the part
  // still inside the shell or the nut is never drawn
  [named(/^button\.(red|green)\.(housing|switch|tab)/), named(/^(shell|nut\.)/)],
  // the nuts show through the shell's 30 mm button holes, which are drawn as dark openings
  [named(/^nut\./), named(/^shell$/)],
];
A.auditOrExit(R, P, { allow: ALLOW });

// CSS scoped to a fragment's root: rules on .iso itself land on the root, everything else under it.
// Dark-theme rules can never match a light fragment, so they are dropped.
function scopeCssTo(ROOT, css) {
  const dark = (sel) => sel.includes(':not([data-theme="light"])') || sel.includes('[data-theme="dark"]');
  const scopeSel = (sel) => (sel.startsWith(ROOT) ? sel : /^\.iso(?![\w-])/.test(sel) ? ROOT + sel : `${ROOT} ${sel}`);
  function scopeCss(css) {
    css = css.replace(/\/\*[\s\S]*?\*\//g, "");
    let out = "";
    let i = 0;
    for (;;) {
      const open = css.indexOf("{", i);
      if (open < 0) break;
      const head = css.slice(i, open).trim();
      let depth = 1;
      let j = open + 1;
      for (; depth && j < css.length; j++) depth += css[j] === "{" ? 1 : css[j] === "}" ? -1 : 0;
      const body = css.slice(open + 1, j - 1);
      if (/^@(media|supports)/.test(head)) out += `${head}{${scopeCss(body)}}`;
      else if (head.startsWith("@")) out += `${head}{${body}}`;
      else {
        const sels = head.split(",").map((s) => s.trim()).filter((s) => !dark(s));
        if (sels.length) out += `${sels.map(scopeSel).join(",")}{${body.trim()}}`;
      }
      i = j;
    }
    return out;
  }
  return scopeCss(css);
}

// ---------------------------------------------------------------- landing edition (--landing)
// A Spanish, landing-themed copy of the live figure, written as an embeddable fragment (no iframe):
//   landing/wokitoki-figure.html  the markup with its CSS, every rule scoped to .wk-landing
//   landing/wokitoki-figure.js    an ES module that fetches the fragment into #figure-mount and runs it
// Geometry, painter's order and motion are the default figure's; only words and tokens change.
function buildLanding() {
  const ROOT = ".wk-landing";
  const ES = {
    keys: { name: "Dos botones grandes", say: "Rojo para hablar y verde para escuchar. Grandes y firmes, hechos para manos pequeñas." },
    shell: { name: "Tapa", say: "Por aquí sale la voz de la familia, se ve la luz y entra la voz del niño." },
    lid: { name: "Bajo la tapa", say: "Un parlante pequeño, un anillo de luces de colores y el micrófono, diseñado para grabar solo mientras el botón rojo está apretado." },
    brain: { name: "Cerebro", say: "Un pequeño computador con WiFi que envía su voz y recibe las de la familia." },
    base: { name: "Base", say: "La bandeja de abajo, con la entrada del cable USB y patas de caucho para que no se resbale." },
    screws: { name: "Tornillos", say: "Tornillos por debajo, para que manitos curiosas no la abran." },
  };
  const LIVE_ES = [
    // The apart button keeps a changing label only, so aria-pressed is dropped (label and state never disagree).
    [`apartButton.setAttribute("aria-pressed", on ? "true" : "false");\n`, ``],
    [`apartLabel.textContent = on ? "Put together" : "Take apart";`, `apartLabel.textContent = on ? "Armar" : "Desarmar";`],
    // Leave browser and system shortcuts (Cmd/Ctrl/Alt + key) alone.
    [`stage.addEventListener("keydown", (event) => {\n`, `stage.addEventListener("keydown", (event) => {\n  if (event.metaKey || event.ctrlKey || event.altKey) return;\n`],
    [`announce(on ? "taking apart" : "putting together");`, `announce(on ? "desarmando" : "armando");`],
    [`"talk · the ring turns red" : "listen · the ring breathes in a family colour"`, `"hablar · el anillo se pone rojo" : "escuchar · el anillo respira en el color de un familiar"`],
    [`return "talk · ring red · recording";`, `return "hablar · anillo rojo · grabando";`],
    [`return "listen · ring breathes · family colour";`, `return "escuchar · el anillo respira · color de la familia";`],
    [`return apart ? "taking apart" : "putting together";`, `return apart ? "desarmando" : "armando";`],
    ["`apart · ${IDS.length} assemblies · ${D.parts} parts` : `assembled · ${D.parts} parts`", "`desarmada en ${IDS.length} partes` : `armada`"],
    [`const D = __DATA__;\nconst root = document.querySelector(".wk");\n`, `function start(root) {\nconst D = DATA;\n`],
    // The tour is silent: only what the reader does is announced, never the scripted loop.
    [`function announce(text) {\n`, `function announce(text, fromUser = !touring) {\n  if (!fromUser) return;\n`],
    [`stage.addEventListener("focus", () => announce(readoutText()));`, `stage.addEventListener("focus", () => announce(readoutText(), true));`],
    // The first interaction stops the tour for good (it never restarts after an idle pause).
    [`  idleTimer = setTimeout(() => {\n    if (still.matches) return;\n    touring = true;\n    tourClock = 0;\n    tourStep = 0;\n    run();\n  }, 6000);\n`, ``],
    // Keys stop the tour before they act, so their announcement is not swallowed as tour narration.
    [`  if (key === " " || key === "enter") setApart(!apart);`, `  if ([" ", "enter", "r", "g", "escape", "arrowdown", "arrowright", "arrowup", "arrowleft"].includes(key)) takeOver();\n  if (key === " " || key === "enter") setApart(!apart);`],
    // Margin labels ride with their assembly (see LABELS_JS).
    [`function place() {\n`, `function place() {\n  placeLabels();\n`],
  ];
  // Landing-only additions, appended inside start(root): margin labels and the narrow-screen viewBox.
  const LABELS_JS = `
function placeLabels() {
  const list = placeLabels.list || (placeLabels.list = [...root.querySelectorAll(".wk-label")].map((el) => ({ el, id: el.dataset.piece, shown: "", alpha: "" })));
  for (const l of list) {
    const share = piece[l.id].x;
    const [tx, ty] = screenOf(D.moves[l.id], share);
    const text = share === 0 ? "" : \`translate(\${tx.toFixed(2)} \${ty.toFixed(2)})\`;
    if (text !== l.shown) {
      l.shown = text;
      if (text) l.el.setAttribute("transform", text);
      else l.el.removeAttribute("transform");
    }
    const alpha = Math.max(0, Math.min(1, (share - 0.35) / 0.65)).toFixed(2);
    if (alpha !== l.alpha) {
      l.alpha = alpha;
      l.el.setAttribute("opacity", alpha);
      l.el.style.pointerEvents = alpha > 0.5 ? "" : "none";
    }
    l.el.toggleAttribute("data-on", selected === l.id);
  }
}
for (const el of root.querySelectorAll(".wk-label")) {
  el.addEventListener("pointerenter", () => {
    takeOver();
    select(el.dataset.piece);
  });
  el.addEventListener("pointerleave", () => select(null));
}
{
  const svgEl = stage.querySelector("svg");
  const narrow = matchMedia("(max-width: 560px)");
  const fitView = () => svgEl.setAttribute("viewBox", narrow.matches ? svgEl.dataset.viewNarrow : svgEl.dataset.viewWide);
  narrow.addEventListener("change", fitView);
  fitView();
}
`;
  const LABEL_ES =
    "Render conceptual en vista isométrica desarmada de un dispositivo de voz para niños: una caja rectangular de esquinas redondeadas, del tamaño de un libro de bolsillo, con la tapa superior color hueso y la base amarillo banano. De arriba abajo: un botón grande rojo y uno verde; la tapa superior con la rejilla redonda del parlante, una ventana de luz esmerilada y el orificio del micrófono; bajo la tapa, un parlante pequeño, un anillo de luces de colores, el micrófono y las dos tuercas de los botones; un pequeño computador con WiFi, su entrada de carga y cables al parlante y a los botones; la bandeja base sobre cuatro patas de caucho; y cuatro tornillos por debajo.";

  const scopeCss = (css) => scopeCssTo(ROOT, css);
  const css = scopeCss(k.ISO_CSS + readFileSync(join(HERE, "wokitoki.css"), "utf8") + "\n" + figureCss({ live: true }) + "\n" + readFileSync(join(HERE, "landing.css"), "utf8")).replace(/\biso-(flow|pulse)\b/g, "wk-iso-$1") + landingCss(ROOT);

  let live = readFileSync(join(HERE, "live.js"), "utf8");
  for (const [from, to] of LIVE_ES) {
    const n = live.split(from).length - 1;
    if (n !== 1) throw new Error(`landing: expected one match in live.js for ${JSON.stringify(from)}, found ${n}`);
    live = live.replace(from, () => to);
  }
  const loader = `
// Mounts the fragment into #figure-mount. ES modules and fetch need the page served over http.
const mount = document.getElementById("figure-mount");
if (mount) {
  // Give up after 15 s so a stalled request ends in the visible fallback, not an empty panel.
  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(new Error("timeout")), 15000);
  fetch(new URL("./wokitoki-figure.html", import.meta.url), { signal: abort.signal })
    .finally(() => clearTimeout(timer))
    .then((r) => (r.ok ? r.text() : Promise.reject(new Error("HTTP " + r.status))))
    .then((html) => {
      mount.innerHTML = html;
      start(mount.querySelector(".wk"));
    })
    .catch((error) => {
      console.error("wokitoki figure:", error);
      const note = document.createElement("p");
      note.className = "mount__fallback";
      note.textContent = "No pudimos cargar la vista por dentro. Recarga la página para intentarlo de nuevo.";
      mount.replaceChildren(note);
    });
}
export { start };
`;
  const js = `// Generated by figures/wokitoki-box/build.mjs --landing. Do not edit: edit live.js or build.mjs and rebuild.\nconst DATA = ${JSON.stringify({ ...DATA, pieces: ES })};\n${live}\n${LABELS_JS}\n}\n${loader}`;

  const parts = DATA.order.map((id, index) => `<button type="button" class="wk-part" data-part="${id}"><span class="wk-num">${String(index + 1).padStart(2, "0")}</span><span class="wk-part-name">${ES[id].name}</span><span class="wk-part-say">${ES[id].say}</span></button>`).join("");
  const controls = `<div class="wk-controls"><button type="button" class="wk-btn" data-apart><span data-apart-label>Desarmar</span></button><button type="button" class="wk-btn wk-btn-red" data-press="red">Hablar</button><button type="button" class="wk-btn wk-btn-green" data-press="green">Escuchar</button></div>`;
  const corners = `<div class="iso-plate-corners" aria-hidden="true"><span class="iso-plate-corner" data-corner="title">La caja por dentro</span><span class="iso-plate-corner" data-corner="readout" data-readout>armada</span></div>`;
  // Margin labels: a numbered badge and a short name in a left or right column, tied to its part by a dotted
  // leader. They ride with their assembly and fade in as it comes apart (live.js, placeLabels).
  const SHORT = { keys: "Botones", shell: "Tapa", lid: "Bajo la tapa", brain: "Cerebro", base: "Base", screws: "Tornillos" };
  const SIDE = { keys: 1, shell: -1, lid: 1, brain: -1, base: 1, screws: -1 };
  const circ = ([x, y], r, z, n = 36) => Array.from({ length: n }, (_, i) => [x + r * Math.cos((i / n) * 2 * Math.PI), y + r * Math.sin((i / n) * 2 * Math.PI), z]);
  const planAt = (plan, z) => k.roundedPlan(plan, 8).map(([x, y]) => [x, y, z]);
  const corners4 = (p, z) => [[p.x, p.y, z], [p.x + p.w, p.y, z], [p.x, p.y + p.d, z], [p.x + p.w, p.y + p.d, z]];
  const CAND = {
    keys: Object.values(BTN).flatMap((c) => circ(c, 12, TOP + 6)),
    shell: planAt(OUT, (SPLIT + TOP) / 2),
    lid: [...circ(SPK, 18, PLATE - 6), ...Object.values(BTN).flatMap((c) => circ(c, 19, 44))],
    brain: [...corners4(ESP, ESP_TOP), ...corners4(AMP, AMP_TOP)],
    base: planAt(OUT, SPLIT / 2),
    screws: SCREW_AT.map(([x, y]) => [x, y, 12]),
  };
  const BADGE = { x: 36, r: 15 };
  const NARROW = 36 + 15 + 8;
  const MARGIN = 236;
  const labels = DATA.order.map((id, index) => {
    const side = SIDE[id];
    const pts = CAND[id].map((p) => at(p));
    const [ax, ay] = pts.reduce((best, p) => (side * p[0] > side * best[0] ? p : best));
    const bx = side > 0 ? W + BADGE.x : -BADGE.x;
    const tx = bx + side * (BADGE.r + 9);
    return `<g class="wk-label" data-piece="${id}" data-side="${side > 0 ? "right" : "left"}" aria-hidden="true" opacity="0"><path class="wk-leader" d="M${f2(ax)} ${f2(ay)}H${f2(bx - side * BADGE.r)}"/><circle class="wk-tip" cx="${f2(ax)}" cy="${f2(ay)}" r="3"/><circle class="wk-badge" cx="${f2(bx)}" cy="${f2(ay)}" r="${BADGE.r}"/><text class="wk-badge-num" x="${f2(bx)}" y="${f2(ay)}" dy=".36em" text-anchor="middle">${String(index + 1).padStart(2, "0")}</text><text class="wk-label-name" x="${f2(tx)}" y="${f2(ay)}" dy=".36em" text-anchor="${side > 0 ? "start" : "end"}">${SHORT[id]}</text></g>`;
  });
  const viewWide = `${-MARGIN} 0 ${W + 2 * MARGIN} ${H}`;
  const viewNarrow = `${-NARROW} 0 ${W + 2 * NARROW} ${H}`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg wk-svg" viewBox="${viewWide}" data-view-wide="${viewWide}" data-view-narrow="${viewNarrow}" role="img" aria-label="${LABEL_ES}"><g class="wk-scene" transform="translate(0 ${DATA.shift.toFixed(1)})">${back.join("")}<g class="wk-items">${assembled.map((g) => g.svg).join("")}</g><g class="wk-labels">${labels.join("")}</g></g></svg>`;
  const stage = `<div class="wk-stage" tabindex="0" role="group" aria-label="La caja en vista isométrica. Presiona Espacio o el botón Desarmar para separarla pieza por pieza; presiona R para hablar (el anillo de luz se pone rojo) y G para escuchar (el anillo respira en el color de un familiar).">${svg}<span class="wk-sr" role="status" aria-live="polite" data-live></span></div>`;
  const html = `<div class="wk-landing iso" data-theme="light" lang="es"><style>${css}</style><figure class="iso-figure wk" data-theme="light"><div class="iso-plate">${corners}${stage}${controls}</div><div class="iso-legend" role="group" aria-label="Piezas de la caja"><span class="wk-parts">${parts}</span></div></figure></div>`;

  const dir = join(HERE, "landing");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "wokitoki-figure.html"), html);
  writeFileSync(join(dir, "wokitoki-figure.js"), js);
  console.log("wrote landing/wokitoki-figure.html", `${(html.length / 1024).toFixed(0)} KB`, "+ landing/wokitoki-figure.js", `${(js.length / 1024).toFixed(0)} KB`);
  // A copy inside the site folder, so landing/ deploys on its own (the page loads vendor/, not ../figures).
  const vendor = join(HERE, "..", "..", "landing", "vendor", "wokitoki-figure");
  mkdirSync(vendor, { recursive: true });
  writeFileSync(join(vendor, "wokitoki-figure.html"), html);
  writeFileSync(join(vendor, "wokitoki-figure.js"), js);
  console.log("copied both to landing/vendor/wokitoki-figure/");
}

// ---------------------------------------------------------------- simulator box (--sim-box)
// The assembled box, drawn exactly as the landing figure draws it (same camera, outlines and flat finish),
// as a static SVG for the "Pruébala" simulator. The simulator drives three hooks:
//   .sim-light (data-mode, --lc)  the round light face, painted over the frosted window
//   .sim-cap[data-cap=red|green]  the two button caps (pressed: they sink and their top darkens)
//   hits.red / hits.green         where the caps sit, in % of the drawing, for the real <button> overlays
// Parts hidden inside the closed box (under the lid, the brain, the screws, the button bodies) are left out.
function buildSimBox() {
  const ROOT = ".wk-simbox";
  const hidden = /^(button\.(red|green)\.(housing|switch|tab)|base\.(boss|standoff))/;
  const keep = R.items.filter((item) => ["base", "shell", "keys"].includes(item.piece) && !hidden.test(item.name));

  const glowD = k.ring(RING[0], RING[1], 23, TOP, P, 72);
  const faceD = k.ring(RING[0], RING[1], 17, TOP, P, 72);
  const shineD = k.ring(RING[0] - 5, RING[1] + 4, 5.5, TOP, P, 36);
  const light = `<g class="sim-light" data-mode="off"><path class="sim-light__glow" filter="url(#wk-sim-glow)" d="${glowD}"/><path class="sim-light__face" d="${faceD}"/><path class="sim-light__shine" d="${shineD}"/></g>`;

  let body = keep.map((item) => `<g class="it" data-piece="${item.piece}">${item.svg}</g>`).join("");
  const glowTag = /<path class="wk-glow" d="[^"]*"\/>/g;
  const n = body.match(glowTag)?.length ?? 0;
  if (n !== 1) throw new Error(`sim-box: expected one light window, found ${n}`);
  body = body.replace(glowTag, () => light);
  for (const id of ["red", "green"]) {
    const tag = `<g data-cap="${id}">`;
    if (body.split(tag).length !== 2) throw new Error(`sim-box: expected one ${id} cap`);
    body = body.replace(tag, `<g class="sim-cap sim-cap--${id}" data-cap="${id}">`);
  }
  // ids must not clash with the landing figure on the same page
  body = (back.join("") + body).replace(/id="wk-/g, 'id="wk-sim-').replace(/url\(#wk-(?!sim-)/g, "url(#wk-sim-");
  const defs = `<defs><filter id="wk-sim-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter></defs>`;

  // crop to the closed box (halo and glow included)
  const circ = ([x, y], r, z, n = 48) => Array.from({ length: n }, (_, i) => [x + r * Math.cos((i / n) * 2 * Math.PI), y + r * Math.sin((i / n) * 2 * Math.PI), z]);
  const pts = [...k.boxCorners(OUT, -3, TOP), ...Object.values(BTN).flatMap((c) => circ(c, 17, TOP + 7.4))].map(at);
  const pad = 14;
  const x0 = Math.min(...pts.map((p) => p[0])) - pad;
  const y0 = Math.min(...pts.map((p) => p[1])) - pad;
  const vw = Math.max(...pts.map((p) => p[0])) + pad - x0;
  const vh = Math.max(...pts.map((p) => p[1])) + pad - y0;
  const pct = (v) => Math.round(v * 10000) / 100;
  const hits = {};
  for (const [id, c] of Object.entries(BTN)) {
    const s = [...circ(c, 17, TOP), ...circ(c, 17, TOP + 2.4), ...circ(c, 12, TOP + 7.4)].map(at);
    const [a, b] = [Math.min(...s.map((p) => p[0])), Math.max(...s.map((p) => p[0]))];
    const [u, v] = [Math.min(...s.map((p) => p[1])), Math.max(...s.map((p) => p[1]))];
    hits[id] = { cx: pct(((a + b) / 2 - x0) / vw), cy: pct(((u + v) / 2 - y0) / vh), w: pct((b - a) / vw), h: pct((v - u) / vh) };
  }
  const press = unit([0, 0, -2.4]);

  const css =
    scopeCssTo(ROOT, k.ISO_CSS + readFileSync(join(HERE, "wokitoki.css"), "utf8") + "\n" + figureCss({ live: true }) + "\n" + readFileSync(join(HERE, "landing.css"), "utf8").replaceAll(".wk-landing", ROOT)).replace(/\biso-(flow|pulse)\b/g, "wk-iso-$1") +
    landingCss(ROOT);
  const vb = [x0, y0, vw, vh].map(f2).join(" ");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" class="iso-svg wk-svg" viewBox="${vb}" aria-hidden="true" focusable="false">${defs}${body}</svg>`;
  const html = `<div class="wk-simbox iso" data-theme="light" style="--sim-press:${f2(press[1])}px"><style>${css}</style><div class="wk" data-theme="light">${svg}</div></div>`;
  const js = `// Generated by figures/wokitoki-box/build.mjs --sim-box. Do not edit: edit build.mjs and rebuild.\n// The assembled box for the "Pruébala" simulator: markup (with its scoped CSS), and where the two caps sit.\nexport const SIM_BOX = ${JSON.stringify({ html, hits, ratio: f2(vw / vh) })};\n`;

  const dir = join(HERE, "landing");
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, "sim-box.js"), js);
  const vendor = join(HERE, "..", "..", "landing", "vendor", "wokitoki-figure");
  mkdirSync(vendor, { recursive: true });
  writeFileSync(join(vendor, "sim-box.js"), js);
  console.log("wrote landing/sim-box.js + landing/vendor/wokitoki-figure/sim-box.js", `${(js.length / 1024).toFixed(0)} KB`, `viewBox ${vb}`, JSON.stringify(hits));
}
