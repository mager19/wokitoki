// DOM view for the "Pruébala" simulator. Wires the pure state machine
// (simulator.js) to synthesized sound (sim-audio.js) and the CSS light.

import { createSimulator, DEFAULT_QUEUE } from './simulator.js';
import { createAudio } from './sim-audio.js';

const COLOUR_VAR = {
  red: 'var(--btn-red)',
  green: 'var(--btn-green)',
  amber: 'var(--sim-amber)',
  pink: 'var(--fam-pink)',
  blue: 'var(--fam-blue)',
  orange: 'var(--fam-orange)',
  violet: 'var(--fam-violet)',
  yellow: 'var(--fam-yellow)',
};
const COLOUR_ES = { pink: 'rosa', blue: 'azul', green: 'verde', orange: 'naranja', violet: 'violeta', yellow: 'amarillo' };
const SOLFEGE = { C4: 'do', D4: 're', E4: 'mi', F4: 'fa', G4: 'sol', A4: 'la', B4: 'si' };

const FLASH_MS = 800;
const SENDING_MS = 700; // how long the amber "sending" pulse shows before "sent"
const SETTLE_MS = 350; // pause after a message before the light goes back to ambient

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) node.append(c);
  return node;
}

export function mountSimulator(mount, { queue = DEFAULT_QUEUE } = {}) {
  const sim = createSimulator({ queue });
  const audio = createAudio();

  // ---- build the DOM ----
  const light = el('span', { class: 'sim-light', 'data-mode': 'off' });
  const redBtn = el('button', { class: 'sim-btn sim-btn--red', type: 'button', 'aria-label': 'Botón rojo: mantenlo apretado para hablar y suéltalo para enviar' });
  const greenBtn = el('button', { class: 'sim-btn sim-btn--green', type: 'button', 'aria-label': 'Botón verde: apriétalo para escuchar el siguiente mensaje' });
  const status = el('p', { class: 'sr-only', role: 'status', 'aria-live': 'polite' });

  const box = el('div', { class: 'sim-box' }, [
    el('div', { class: 'sim-box__shell' }, [
      el('div', { class: 'sim-box__bezel' }, [light]),
      el('div', { class: 'sim-box__buttons' }, [
        el('div', { class: 'sim-box__socket' }, [redBtn]),
        el('div', { class: 'sim-box__socket' }, [greenBtn]),
      ]),
      el('div', { class: 'sim-box__base' }),
    ]),
  ]);

  const legendItems = queue.map((m) => {
    const melody = m.notes.map((n) => SOLFEGE[n] ?? n).join(' · ');
    return el('li', { class: 'sim-legend__item' }, [
      el('span', { class: 'sim-legend__dot', style: `--lc: ${COLOUR_VAR[m.colour]}`, 'aria-hidden': 'true' }),
      el('span', { class: 'sim-legend__name' }, m.name),
      el('span', { class: 'sim-legend__colour' }, COLOUR_ES[m.colour] ?? m.colour),
      el('span', { class: 'sim-legend__melody' }, melody),
    ]);
  });

  const resetBtn = el('button', { class: 'btn btn--small btn--ghost', type: 'button' }, 'Reiniciar');
  const muteBtn = el('button', { class: 'btn btn--small btn--ghost', type: 'button', 'aria-pressed': 'false' }, 'Silenciar');

  const side = el('div', { class: 'sim__side' }, [
    el('ol', { class: 'sim-steps' }, [
      el('li', {}, [el('strong', {}, 'Rojo: '), 'mantenlo apretado, habla y suelta para enviar.']),
      el('li', {}, [el('strong', {}, 'Verde: '), 'apriétalo para escuchar el mensaje más antiguo que espera.']),
    ]),
    el('div', { class: 'sim-legend' }, [
      el('h3', { class: 'sim-legend__title' }, 'Mensajes esperando'),
      el('ul', { class: 'sim-legend__list' }, legendItems),
    ]),
    el('div', { class: 'sim__controls' }, [resetBtn, muteBtn]),
    el('p', { class: 'sim__note' }, 'Con teclado, ve con Tab hasta un botón y mantén Espacio o Enter. Es una simulación en pantalla: la caja aún no está construida.'),
  ]);

  mount.replaceChildren(el('div', { class: 'sim' }, [el('div', { class: 'sim__stage' }, [box]), side]), status);
  mount.setAttribute('role', 'region');

  // ---- light ----
  let timers = [];
  const later = (ms, fn) => timers.push(setTimeout(fn, ms));
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

  function setLight(mode, colour) {
    light.dataset.mode = mode;
    if (colour) light.style.setProperty('--lc', COLOUR_VAR[colour] ?? colour);
    else light.style.removeProperty('--lc');
  }

  function ambient() {
    const { pending, recording } = sim.getState();
    if (recording) return;
    if (pending > 0) setLight('breathe', queue[queue.length - pending].colour);
    else setLight('off');
  }

  function announce(text) { status.textContent = text; }

  // ---- effects ----
  function run(effects) {
    if (!effects.length) return;
    clearTimers();
    let lastStart = 0;
    let lastEnd = 0;
    let holdRed = false;
    let settle = 0;
    let sentPending = false;

    for (const effect of effects) {
      if (effect.startsWith('light:')) {
        const [, mode, colour] = effect.split(':');
        const at = mode === 'pulse' ? lastEnd : lastStart;
        if (mode === 'pulse') sentPending = true;
        holdRed = mode === 'solid' && colour === 'red';
        later(at, () => setLight(mode, colour));
        if (mode === 'flash') settle = Math.max(settle, at + FLASH_MS);
        else if (mode === 'solid' || mode === 'off') settle = Math.max(settle, at);
        continue;
      }
      const notes = effect.startsWith('jingle:') ? queue.find((q) => `jingle:${q.id}` === effect)?.notes : undefined;
      const slot = audio.play(effect, { delay: effect === 'sent' && sentPending ? SENDING_MS : 0, notes });
      if (slot) {
        lastStart = slot.start;
        lastEnd = slot.end;
        settle = Math.max(settle, slot.end + SETTLE_MS);
      }
    }

    if (!holdRed) later(settle, ambient);

    const first = effects[0];
    if (first === 'squelch-open') announce('Grabando.');
    else if (effects.includes('sent')) announce('Mensaje enviado.');
    else if (first === 'click') announce('Toque muy corto: no se envió nada.');
    else if (first.startsWith('jingle:')) {
      const m = queue.find((q) => `jingle:${q.id}` === first);
      announce(`Mensaje de ${m ? m.name : 'la familia'}.${effects.includes('more') ? ' Hay más mensajes.' : ''}`);
    } else if (first === 'squelch-short') announce('No hay mensajes.');
  }

  // ---- input ----
  let watchdog = null;
  const now = () => performance.now();

  function stopWatchdog() { clearInterval(watchdog); watchdog = null; }

  function pressRed() {
    const out = sim.pressRed(now());
    if (!out.length) return;
    // Cut any message still playing so the red light and squelch start now.
    audio.cancel();
    redBtn.classList.add('is-pressed');
    run(out);
    watchdog = setInterval(() => {
      const cut = sim.tick(now());
      if (cut.length) {
        stopWatchdog();
        redBtn.classList.remove('is-pressed');
        run(cut);
      }
    }, 100);
  }

  function releaseRed() {
    stopWatchdog();
    redBtn.classList.remove('is-pressed');
    run(sim.releaseRed(now()));
  }

  function pressGreen() {
    const out = sim.pressGreen(now());
    if (!out.length) return;
    greenBtn.classList.add('is-pressed');
    run(out);
  }

  function releaseGreen() { greenBtn.classList.remove('is-pressed'); }

  function bindButton(btn, down, up) {
    let activePointer = null;
    btn.addEventListener('pointerdown', (e) => {
      if (e.button !== undefined && e.button > 0) return;
      activePointer = e.pointerId;
      try { btn.setPointerCapture(e.pointerId); } catch { /* not capturable */ }
      down();
    });
    const end = (e) => {
      if (activePointer === null || (e && e.pointerId !== activePointer)) return;
      activePointer = null;
      up();
    };
    btn.addEventListener('pointerup', (e) => {
      audio.resume(); // iOS only unlocks audio inside pointerup/click
      end(e);
    });
    btn.addEventListener('click', () => audio.resume());
    btn.addEventListener('pointercancel', end);
    btn.addEventListener('lostpointercapture', end);
    btn.addEventListener('contextmenu', (e) => e.preventDefault());

    let keyHeld = false;
    btn.addEventListener('keydown', (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      if (e.repeat || keyHeld) return;
      keyHeld = true;
      down();
    });
    btn.addEventListener('keyup', (e) => {
      if (e.key !== ' ' && e.key !== 'Enter') return;
      e.preventDefault();
      if (!keyHeld) return;
      keyHeld = false;
      up();
    });
    btn.addEventListener('blur', () => {
      if (keyHeld) { keyHeld = false; up(); }
    });
  }

  bindButton(redBtn, pressRed, releaseRed);
  bindButton(greenBtn, pressGreen, releaseGreen);

  resetBtn.addEventListener('click', () => {
    stopWatchdog();
    clearTimers();
    audio.cancel();
    audio.resume();
    redBtn.classList.remove('is-pressed');
    greenBtn.classList.remove('is-pressed');
    const [first] = sim.reset();
    const [, mode, colour] = first.split(':');
    setLight(mode, colour);
    announce('Simulador reiniciado.');
  });

  muteBtn.addEventListener('click', () => {
    audio.setMuted(!audio.isMuted());
    const muted = audio.isMuted();
    muteBtn.setAttribute('aria-pressed', String(muted));
    announce(muted ? 'Sonido silenciado' : 'Sonido activado');
  });

  // Initial state: messages are waiting, so the light breathes. No sound yet.
  const [first] = sim.reset();
  const [, mode, colour] = first.split(':');
  setLight(mode, colour);
}

const mount = typeof document !== 'undefined' && document.getElementById('sim-mount');
if (mount) mountSimulator(mount);
