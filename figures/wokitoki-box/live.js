const D = __DATA__;
const root = document.querySelector(".wk");
const stage = root.querySelector(".wk-stage");
const layer = stage.querySelector(".wk-items");
const scene = stage.querySelector(".wk-scene");
const readout = root.querySelector("[data-readout]");
const live = root.querySelector("[data-live]");
const apartButton = root.querySelector("[data-apart]");
const apartLabel = root.querySelector("[data-apart-label]");
const pressButtons = [...root.querySelectorAll("[data-press]")];
const partButtons = [...root.querySelectorAll(".wk-part")];
const still = matchMedia("(prefers-reduced-motion: reduce)");

const nodes = [...layer.querySelectorAll(".it")].map((el) => ({
  el,
  piece: el.dataset.piece,
  key: Number(el.dataset.k),
  m: el.dataset.m.split(",").map(Number),
  shown: "",
}));
for (const node of nodes) node.lift = node.m[0] * D.V[0] + node.m[1] * D.V[1] + node.m[2] * D.V[2];
let order = nodes.map((_, index) => index);
const follows = [...layer.querySelectorAll("[data-follow]")].map((el) => ({ el, other: el.dataset.follow, own: el.closest(".it").dataset.piece, shown: "" }));
const screenOf = (m, share) => [(D.EX[0] * m[0] + D.EY[0] * m[1] + D.EZ[0] * m[2]) * share, (D.EX[1] * m[0] + D.EY[1] * m[1] + D.EZ[1] * m[2]) * share];
const caps = Object.fromEntries(["red", "green"].map((id) => [id, layer.querySelector(`[data-cap="${id}"]`)]));

const IDS = Object.keys(D.pieces);
const piece = Object.fromEntries(IDS.map((id) => [id, { x: 0, v: 0, target: 0, pending: null }]));
const press = { red: { x: 0, v: 0 }, green: { x: 0, v: 0 } };
const RED = getComputedStyle(root).getPropertyValue("--wk-red").trim() || "#D64033";
const FAMILY = () => getComputedStyle(root).getPropertyValue("--wk-family").trim() || "#7A55C9";

let clock = 0;
let apart = false;
let selected = null;
let mode = "idle"; // idle | talk | listen
let modeAt = -9;
let touring = !still.matches;
let tourClock = 0;
let idleTimer = 0;
let visible = false;
let frame = 0;
let last = 0;
let ringOn = { x: 0, v: 0 };

function say(text) {
  if (readout.textContent !== text) readout.textContent = text;
}
function announce(text) {
  if (live.textContent !== text) live.textContent = text;
}

function setApart(on) {
  if (apart === on) return;
  apart = on;
  const goal = on ? 1 : 0;
  let index = 0;
  for (const id of on ? D.stagger : [...D.stagger].reverse()) {
    if (piece[id].target === goal && !piece[id].pending) continue;
    if (piece[id].target === goal) piece[id].pending = null;
    else piece[id].pending = { value: goal, at: clock + (still.matches ? 0 : index++ * D.spring.stagger) };
  }
  apartButton.setAttribute("aria-pressed", on ? "true" : "false");
  apartLabel.textContent = on ? "Put together" : "Take apart";
  announce(on ? "taking apart" : "putting together");
  run();
}

function select(id) {
  if (selected === id) return;
  selected = id;
  for (const node of nodes) {
    if (id && node.piece === id) node.el.setAttribute("data-on", "");
    else node.el.removeAttribute("data-on");
  }
  if (id) stage.setAttribute("data-focus", "");
  else stage.removeAttribute("data-focus");
  partButtons.forEach((b) => (b.dataset.part === id ? b.setAttribute("data-on", "") : b.removeAttribute("data-on")));
  if (id) announce(D.pieces[id].say);
  run();
}

function talk(id) {
  mode = id === "red" ? "talk" : "listen";
  modeAt = clock;
  pressButtons.forEach((b) => (b.dataset.press === id ? b.setAttribute("data-active", "") : b.removeAttribute("data-active")));
  announce(id === "red" ? "talk · the ring turns red" : "listen · the ring breathes in a family colour");
  run();
}

function stepSpring(state, dt, calm) {
  if (state.pending && clock >= state.pending.at) {
    state.target = state.pending.value;
    state.pending = null;
  }
  if (calm) {
    state.x = state.target;
    state.v = 0;
    return state.pending !== null;
  }
  for (let i = 0; i < D.spring.substeps; i++) {
    const h = dt / D.spring.substeps;
    state.v += ((state.target - state.x) * D.spring.stiffness - state.v * D.spring.damping) * h;
    state.x += state.v * h;
  }
  if (Math.abs(state.target - state.x) < 2e-4 && Math.abs(state.v) < 2e-4) {
    state.x = state.target;
    state.v = 0;
    return state.pending !== null;
  }
  return true;
}

function settleTo(state, target, dt, seconds, calm) {
  if (calm) {
    state.x = target;
    state.v = 0;
    return false;
  }
  const w = 1 / seconds;
  for (let i = 0; i < 4; i++) {
    const h = dt / 4;
    state.v += (w * w * (target - state.x) - 2 * w * state.v) * h;
    state.x += state.v * h;
  }
  if (Math.abs(target - state.x) < 1e-4 && Math.abs(state.v) < 1e-4) {
    state.x = target;
    state.v = 0;
    return false;
  }
  return true;
}

function place() {
  const mean = IDS.reduce((sum, id) => sum + piece[id].x, 0) / IDS.length;
  scene.setAttribute("transform", `translate(0 ${(D.shift * (1 - Math.min(1, Math.max(0, mean)))).toFixed(2)})`);
  for (const node of nodes) {
    const share = piece[node.piece].x;
    const tx = (D.EX[0] * node.m[0] + D.EY[0] * node.m[1] + D.EZ[0] * node.m[2]) * share;
    const ty = (D.EX[1] * node.m[0] + D.EY[1] * node.m[1] + D.EZ[1] * node.m[2]) * share;
    const text = share === 0 ? "" : `translate(${tx.toFixed(2)} ${ty.toFixed(2)})`;
    if (text !== node.shown) {
      node.shown = text;
      if (text) node.el.setAttribute("transform", text);
      else node.el.removeAttribute("transform");
    }
  }
  const next = nodes.map((_, i) => i).sort((a, b) => nodes[a].key + nodes[a].lift * piece[nodes[a].piece].x - (nodes[b].key + nodes[b].lift * piece[nodes[b].piece].x));
  if (next.some((index, i) => index !== order[i])) {
    const fragment = document.createDocumentFragment();
    for (const index of next) fragment.appendChild(nodes[index].el);
    layer.appendChild(fragment);
    order = next;
  }
  for (const f of follows) {
    const a = screenOf(D.moves[f.other], piece[f.other].x);
    const b = screenOf(D.moves[f.own], piece[f.own].x);
    const text = `translate(${(a[0] - b[0]).toFixed(2)} ${(a[1] - b[1]).toFixed(2)})`;
    if (text !== f.shown) {
      f.shown = text;
      f.el.setAttribute("transform", text);
    }
  }
  for (const id of ["red", "green"]) {
    const d = press[id].x;
    if (caps[id]) caps[id].setAttribute("transform", d > 0.001 ? `translate(${(D.press[0] * d).toFixed(2)} ${(D.press[1] * d).toFixed(2)})` : "");
  }
}

// one scripted loop that shows the point of the figure when nobody is touching it
const TOUR = [
  [0, () => setApart(false)],
  [1.2, () => talk("red")],
  [4.0, () => talk("green")],
  [8.0, () => (mode = "idle")],
  [8.6, () => setApart(true)],
  [11.0, () => select("brain")],
  [13.0, () => select("lid")],
  [15.0, () => select(null)],
  [16.6, () => setApart(false)],
];
const TOUR_LENGTH = 19;
let tourStep = 0;
function tour(dt) {
  tourClock += dt;
  while (tourStep < TOUR.length && tourClock >= TOUR[tourStep][0]) TOUR[tourStep++][1]();
  if (tourClock >= TOUR_LENGTH) {
    tourClock = 0;
    tourStep = 0;
  }
}
function takeOver() {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (still.matches) return;
    touring = true;
    tourClock = 0;
    tourStep = 0;
    run();
  }, 6000);
}

function ringState(calm) {
  const age = clock - modeAt;
  if (mode === "talk") {
    const held = age < 2.4;
    if (!held) mode = "idle";
    return { color: RED, level: held ? 1 : 0, pressed: { red: held ? 1 : 0, green: 0 } };
  }
  if (mode === "listen") {
    const held = age < 3.6;
    if (!held) mode = "idle";
    const breath = calm ? 0.8 : 0.35 + 0.65 * (0.5 - 0.5 * Math.cos(((age * 2 * Math.PI) / 1.8)));
    return { color: FAMILY(), level: held ? breath : 0, pressed: { red: 0, green: age < 0.35 ? 1 : 0 } };
  }
  return { color: null, level: 0, pressed: { red: 0, green: 0 } };
}
let lastColor = RED;

function readoutText() {
  const moving = IDS.some((id) => piece[id].pending || piece[id].x !== piece[id].target);
  if (mode === "talk") return "talk · ring red · recording";
  if (mode === "listen") return "listen · ring breathes · family colour";
  if (selected) return D.pieces[selected].say;
  if (moving) return apart ? "taking apart" : "putting together";
  return apart ? `apart · ${IDS.length} assemblies · ${D.parts} parts` : `assembled · ${D.parts} parts`;
}

function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  clock += dt;
  const calm = still.matches;
  if (touring) tour(dt);
  let moving = false;
  for (const id of IDS) moving = stepSpring(piece[id], dt, calm) || moving;
  const ring = ringState(calm);
  if (ring.color) lastColor = ring.color;
  root.style.setProperty("--wk-ring", lastColor);
  moving = settleTo(ringOn, ring.level, dt, mode === "listen" ? 0.12 : 0.08, calm) || moving;
  root.style.setProperty("--wk-on", ringOn.x.toFixed(3));
  for (const id of ["red", "green"]) moving = settleTo(press[id], ring.pressed[id], dt, 0.05, calm) || moving;
  place();
  say(readoutText());
  const busy = touring || moving || mode !== "idle";
  frame = visible && busy ? requestAnimationFrame(tick) : 0;
}
function run() {
  if (!frame && visible) {
    last = 0;
    frame = requestAnimationFrame(tick);
  }
}

new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);
if (still.matches) touring = false;

apartButton.addEventListener("click", () => {
  takeOver();
  setApart(!apart);
});
pressButtons.forEach((b) => b.addEventListener("click", () => {
  takeOver();
  talk(b.dataset.press);
}));
for (const id of ["red", "green"]) caps[id]?.addEventListener("click", (event) => {
  event.stopPropagation();
  takeOver();
  talk(id);
});
partButtons.forEach((b) => {
  b.addEventListener("pointerenter", () => {
    takeOver();
    select(b.dataset.part);
  });
  b.addEventListener("pointerleave", () => select(null));
  b.addEventListener("focus", () => {
    takeOver();
    select(b.dataset.part);
  });
  b.addEventListener("blur", () => select(null));
  b.addEventListener("click", () => {
    takeOver();
    if (!apart) setApart(true);
    select(b.dataset.part);
  });
});
stage.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (key === " " || key === "enter") setApart(!apart);
  else if (key === "r") talk("red");
  else if (key === "g") talk("green");
  else if (key === "escape") {
    setApart(false);
    select(null);
  } else if (key === "arrowdown" || key === "arrowright" || key === "arrowup" || key === "arrowleft") {
    const step = key === "arrowdown" || key === "arrowright" ? 1 : -1;
    const at = selected ? D.order.indexOf(selected) : -1;
    const next = Math.max(0, Math.min(D.order.length - 1, at + step));
    if (!apart) setApart(true);
    select(D.order[next]);
  } else return;
  event.preventDefault();
  takeOver();
});
stage.addEventListener("focus", () => announce(readoutText()));
place();
say(readoutText());
