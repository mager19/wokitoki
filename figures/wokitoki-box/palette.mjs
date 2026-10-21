// Colour tokens for the WoKiToKi box figure.
// Edit the base colours here (or the matching --wk-* custom properties in the page CSS):
// every fill tone is derived from one base colour per material.

export const PALETTE = {
  light: {
    card: "#FFFCF7",
    page: "#F6EFE6",
    ink: "#462B0D", // dark trunk: outlines and text
    accent: "#0B785D", // green forest: the one lit accent
    family: "#7A55C9", // a family member's colour for the "listen" breathing ring
    materials: {
      shell: "#FCF5EE", // warm off-white top shell
      base: "#F4DF97", // banana base tray
      red: "#D64033", // talk button
      green: "#228B3B", // listen button
      pcb: "#0B785D", // board green (forest)
      pcb2: "#1C5E4C", // second board, a darker green
      metal: "#C8C3BB",
      brass: "#C9A35A",
      dark: "#3B3128", // black plastics: switch bodies, terminal block
      rubber: "#4A4037",
      cone: "#6E5B47", // speaker cone paper
      led: "#F7F3EC",
      window: "#FFFFFF",
      cable: "#9A8A79",
    },
  },
  dark: {
    card: "#17130F",
    page: "#0F0C09",
    ink: "#F3E8DA",
    accent: "#3FC79A",
    family: "#A98BF0",
    materials: {
      shell: "#D8D0C6",
      base: "#CDB46A",
      red: "#C23A2E",
      green: "#1F7D36",
      pcb: "#0A6A52",
      pcb2: "#18533F",
      metal: "#9C978F",
      brass: "#A8874A",
      dark: "#2B241D",
      rubber: "#3A322B",
      cone: "#584838",
      led: "#D9D4CC",
      window: "#E6E2DC",
      cable: "#7B6D5F",
    },
  },
};

// Tone recipe: how far each face is pulled toward white (top) or toward the shade ink.
export const TONES = { top: 0.28, face: 0.12, s3: 0.07, s2: 0.13, s1: 0.2, s0: 0.28, paper: 0.13 };

const hex = (c) => {
  const v = c.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16) / 255);
};
const toHex = (rgb) => "#" + rgb.map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0")).join("");
const lin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const gam = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
function oklab([r, g, b]) {
  [r, g, b] = [r, g, b].map(lin);
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  return [0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s, 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s, 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s];
}
function fromOklab([L, a, b]) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s].map(gam);
}
// Same maths as CSS color-mix(in oklab, a (1-t), b t).
export function mix(a, b, t) {
  const A = oklab(hex(a));
  const B = oklab(hex(b));
  return toHex(fromOklab(A.map((v, i) => v + (B[i] - v) * t)));
}

const SHADE_INK = { light: "#2A1A08", dark: "#000000" };

// Resolved hex tokens for one theme (used for the static print SVG).
export function resolved(theme) {
  const T = PALETTE[theme];
  const lines = {
    hi: T.ink,
    mid: mix(T.ink, T.card, 0.42),
    lo: mix(T.ink, T.card, 0.62),
    faint: mix(T.ink, T.card, 0.8),
  };
  const materials = {};
  for (const [name, base] of Object.entries(T.materials)) {
    const shadeInk = SHADE_INK[theme];
    materials[name] = {
      base,
      top: mix(base, "#ffffff", theme === "light" ? TONES.top : TONES.top * 0.5),
      face: mix(base, "#ffffff", TONES.face * 0.5),
      paper: mix(base, shadeInk, TONES.paper),
      s3: mix(base, shadeInk, TONES.s3),
      s2: mix(base, shadeInk, TONES.s2),
      s1: mix(base, shadeInk, TONES.s1),
      s0: mix(base, shadeInk, TONES.s0),
    };
  }
  return { ...T, lines, materials };
}

// CSS that styles the figure. With `live`, materials derive from --wk-* tokens through color-mix,
// so the landing page can re-theme by changing a handful of custom properties.
export function figureCss({ live = true, scope = ".wk" } = {}) {
  const out = [];
  for (const theme of ["light", "dark"]) {
    const R = resolved(theme);
    const sel = theme === "light" ? `.iso[data-theme="light"] ${scope}, ${scope}[data-theme="light"]` : `.iso:not([data-theme="light"]) ${scope}, ${scope}[data-theme="dark"]`;
    const vars = [
      `--anatomy-card:${R.card}`,
      `--anatomy-paper:${R.card}`,
      `--anatomy-hi:${R.lines.hi}`,
      `--anatomy-mid:${R.lines.mid}`,
      `--anatomy-lo:${R.lines.lo}`,
      `--anatomy-faint:${R.lines.faint}`,
      `--anatomy-lit:${R.accent}`,
      `--anatomy-dot:${R.ink}`,
      `--anatomy-halo:${theme === "light" ? "#6b4a22" : "#000000"}`,
      `--anatomy-halo-opacity:${theme === "light" ? ".26" : ".85"}`,
      `--wk-ink:${R.ink}`,
      `--wk-accent:${R.accent}`,
      `--wk-family:${R.family}`,
      `--wk-hole:${theme === "light" ? mix(R.ink, "#000000", 0.2) : "#050403"}`,
      `--wk-shadow:${theme === "light" ? R.ink : "#000000"}`,
      ...Object.entries(R.materials).map(([name, m]) => `--wk-${name}:${m.base}`),
    ];
    out.push(`${sel}{${vars.join(";")}}`);
    if (!live) {
      for (const [name, m] of Object.entries(R.materials)) {
        out.push(`${theme === "light" ? `${scope}[data-theme="light"]` : `${scope}[data-theme="dark"]`} .m-${name}{--anatomy-paper:${m.paper};--anatomy-face:${m.face};--anatomy-top:${m.top};--anatomy-shade-3:${m.s3};--anatomy-shade-2:${m.s2};--anatomy-shade-1:${m.s1};--anatomy-shade-0:${m.s0};--anatomy-lit-top:${m.top};--anatomy-lit-shade:${m.s3}}`);
      }
    }
  }
  if (live) {
    const names = Object.keys(PALETTE.light.materials);
    for (const theme of ["light", "dark"]) {
      const ink = SHADE_INK[theme];
      const topT = theme === "light" ? TONES.top : TONES.top * 0.5;
      const sel = (name) => (theme === "light" ? `.iso[data-theme="light"] ${scope} .m-${name}, ${scope}[data-theme="light"] .m-${name}` : `.iso:not([data-theme="light"]) ${scope} .m-${name}, ${scope}[data-theme="dark"] .m-${name}`);
      for (const name of names) {
        const c = `var(--wk-${name})`;
        const m = (t, to = ink) => `color-mix(in oklab, ${c}, ${to} ${(t * 100).toFixed(1)}%)`;
        out.push(`${sel(name)}{--anatomy-paper:${m(TONES.paper)};--anatomy-face:${m(TONES.face * 0.5, "#fff")};--anatomy-top:${m(topT, "#fff")};--anatomy-shade-3:${m(TONES.s3)};--anatomy-shade-2:${m(TONES.s2)};--anatomy-shade-1:${m(TONES.s1)};--anatomy-shade-0:${m(TONES.s0)};--anatomy-lit-top:${m(topT, "#fff")};--anatomy-lit-shade:${m(TONES.s3)}}`);
      }
    }
  }
  return out.join("\n");
}

// ---------------------------------------------------------------- landing edition (node build.mjs --landing)
// The landing page's tokens (landing/styles/tokens.css): cream panel, dark and forest green, ink,
// family violet, and the product's talk/listen red and green. Only --wk-* and --anatomy-* tokens are
// overridden; the default PALETTE above (and so the brochure export) is untouched.
export const LANDING = {
  card: "#EFE3C8", // --cream-deep: the #por-dentro panel the figure sits on
  ink: "#1B2E25", // --ink
  inkSoft: "#44564C", // --ink-soft: small text, AA on the panel
  accent: "#1E5A3E", // --green-forest
  family: "#8E6BC9", // --fam-violet
  halo: "#16332B", // --green-dark
  materials: {
    shell: "#FBF6EC",
    base: "#F3D77E", // banana base, pulled toward --fam-yellow
    red: "#E5483B", // --btn-red
    green: "#3FAE5A", // --btn-green
    pcb: "#1E5A3E", // --green-forest
    pcb2: "#16332B", // --green-dark
  },
};

// Token overrides for the landing figure, scoped to its root. Its specificity beats figureCss's light rules.
export function landingCss(scope = ".wk-landing") {
  const L = LANDING;
  const vars = [
    `--anatomy-card:${L.card}`,
    `--anatomy-paper:${L.card}`,
    `--anatomy-text:${L.inkSoft}`,
    `--anatomy-strong:${L.ink}`,
    `--anatomy-muted:${L.inkSoft}`,
    `--anatomy-hi:${L.ink}`,
    `--anatomy-mid:${mix(L.ink, L.card, 0.42)}`,
    `--anatomy-lo:${mix(L.ink, L.card, 0.62)}`,
    `--anatomy-faint:${mix(L.ink, L.card, 0.8)}`,
    `--anatomy-lit:${L.accent}`,
    `--anatomy-dot:${L.ink}`,
    `--anatomy-halo:${L.halo}`,
    `--anatomy-halo-opacity:.24`,
    `--wk-ink:${L.ink}`,
    `--wk-accent:${L.accent}`,
    `--wk-family:${L.family}`,
    `--wk-hole:${mix(L.ink, "#000000", 0.2)}`,
    `--wk-shadow:${L.ink}`,
    ...Object.entries(L.materials).map(([name, c]) => `--wk-${name}:${c}`),
  ];
  // Flat finish: the top and the base fill take the material colour as is; the side faces get one of two
  // flat shades (lit side, shadow side), so the volume still reads without four-tone gradients.
  const flat = Object.keys(PALETTE.light.materials).map((name) => {
    const c = `var(--wk-${name})`;
    const s = (t) => `color-mix(in oklab, ${c}, ${L.ink} ${t}%)`;
    return `${scope}.iso[data-theme="light"] .wk[data-theme="light"] .m-${name}{--anatomy-paper:${c};--anatomy-face:${c};--anatomy-top:${c};--anatomy-lit-top:${c};--anatomy-shade-3:${s(LANDING_FLAT.lit)};--anatomy-shade-2:${s(LANDING_FLAT.lit)};--anatomy-lit-shade:${s(LANDING_FLAT.lit)};--anatomy-shade-1:${s(LANDING_FLAT.shadow)};--anatomy-shade-0:${s(LANDING_FLAT.shadow)}}`;
  });
  return `${scope}.iso[data-theme="light"] .wk[data-theme="light"]{${vars.join(";")}}` + flat.join("");
}
// Ink share (%) of the two flat side shades in the landing finish.
export const LANDING_FLAT = { lit: 7, shadow: 16 };
