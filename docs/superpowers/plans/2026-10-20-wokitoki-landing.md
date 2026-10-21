# WoKiToKi Landing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static landing page for parents that explains WoKiToKi in the Scribo visual language, with a "Pruébala" sound simulator, the anatomy figure and an honest registration form.

**Architecture:** One static page in `landing/` with plain HTML/CSS/ES modules and no build step. The pure logic (the simulator state machine and form validation) lives in small modules with no DOM access, tested with `node --test`. The DOM and audio bindings are thin modules on top. The anatomy figure gets an additional Spanish build output for the landing; the brochure's outputs stay untouched.

**Tech Stack:** HTML5, CSS (custom properties), vanilla ES modules, Web Audio API, Node 20+ (`node --test`), headless Chrome via `~/.claude/skills/anatomy/scripts/capture.mjs` for screenshots, the `impeccable` skill for review.

**Spec:** `docs/superpowers/specs/2026-10-20-wokitoki-landing-design.md` (read it first, along with `docs/BRIEF-BROCHURE.md` §5, §13, §14, §16 and `diseno.jpeg`).

## Global Constraints

- Copy in neutral Spanish (Colombia). Name: "WoKiToKi", with "nombre provisional" in the footer.
- Never state any §16 claim: for sale or reservable, the box physically exists, tested with children, Ley 1581 compliance, auto-deletion, encryption, QR onboarding done, mic physically disconnected, works anywhere, WhatsApp/Meta affiliation, final name, invented metrics.
- No internal IDs (`RF-`, `RNF-`, `D-0`, `DH-`) in the rendered text. No WhatsApp or Meta logos.
- No buy button, price or reservation. The CTA is "Sé de las primeras familias", and under the submit button: "Te avisamos cuando esté disponible. Aún no se puede comprar."
- People are illustrated, not photographic. The box is always a conceptual render: no screen, text or logos on it.
- Palette: Scribo cream, dark green and forest green. Accents: family colours pink, blue, green, orange, violet and yellow, plus product red (talk) and green (listen). Rounded display typeface (not Vollkorn). Simian only as "Un desarrollo de Simian".
- WCAG AA contrast. Keyboard operable. Respects `prefers-reduced-motion`. No horizontal scroll at 390 px.
- Brochure outputs `figures/wokitoki-box/export/wokitoki-exploded.svg` and `wokitoki-exploded@300dpi.png` must stay byte-identical.
- The project folder is not a git repo, so there are no commit steps. Each task ends with its verification instead.

## Review Focus

1. **A tap on red shorter than 300 ms:** expect a soft click, nothing sent, and no "enviado" sound or flash. Test: `short red tap sends nothing` (Task 3).
2. **Green pressed with an empty queue:** expect only a short squelch, the light stays off, and no crash. Test: `green with empty queue only squelches` (Task 3).
3. **Sound before any user gesture, or muted:** expect no AudioContext created until the first press, and the visuals still work while muted. Test: `audio is lazy and mute silences` (Task 3, manual check in Step 6).
4. **Form with neither email nor WhatsApp, or with consent unchecked:** expect it to be blocked, with the error shown next to the field. Tests: `requires email or whatsapp`, `requires consent` (Task 4).
5. **390 px phone and reduced motion:** expect no sideways scroll, a legible simulator, and no breathing animation. Verified by captures in Task 6.

---

### Task 1: Image prompts (first deliverable)

**Files:**
- Create: `landing/assets/PROMPTS.md`

**Interfaces:**
- Produces: these image filenames, which later tasks use as placeholders under `landing/assets/images/`: `hero-nino.(png|jpg|webp)` (arch, 4:5), `que-es-caja.*` (1:1), `que-es-abuela.*` (1:1), `familia-nino.*`, `familia-papas.*`, `familia-abuelos.*` (all 4:3).

- [ ] **Step 1: Write one nanobanana prompt per image** in English.
  - **Shared style block:** one consistent warm flat/soft illustration style that fits hand-drawn doodles; the Scribo cream background; the family-colour accents.
  - **The box, wherever it appears:** off-white shell, banana base, a red and a green arcade button, one soft light. It matches `figures/wokitoki-box/export/wokitoki-exploded@300dpi.png`. No screen, no text, no logos.
  - **People:** illustrated, never photoreal.
  - **The grandparent's phone:** a generic, unbranded chat with a voice-note bubble only.
  - **For each image:** list its target section, pixel size and aspect ratio.
- [ ] **Step 2: Verify.** Run `grep -iE "whatsapp logo|photoreal|photograph" landing/assets/PROMPTS.md`. Matches are allowed only in negative instructions ("no …").

---

### Task 2: Page structure, tokens and static sections

**Files:**
- Create: `landing/index.html`, `landing/styles/tokens.css`, `landing/styles/main.css`, `landing/assets/doodles/{squiggle,spiral,star,arrow,heart,waves}.svg`, `landing/assets/icons/` (one consistent line set)

**Interfaces:**
- Consumes: image filenames from Task 1 (as `data-src` on sized placeholders).
- Produces:
  - Section ids in this order: `#inicio`, `#que-es`, `#como-funciona`, `#pruebala`, `#cifras`, `#familia`, `#por-dentro`, `#seguridad`, `#preguntas`, `#registro`, plus `footer`.
  - Empty mount points: `<div id="sim-mount">` in `#pruebala`, `<div id="figure-mount">` in `#por-dentro`, `<form id="registro-form">` in `#registro`.
  - CSS tokens: `--cream`, `--green-dark`, `--green-forest`, `--ink`, `--fam-pink`, `--fam-blue`, `--fam-green`, `--fam-orange`, `--fam-violet`, `--fam-yellow`, `--btn-red`, `--btn-green`.

- [ ] **Step 1: Build every section from the spec §4 table** in that order.
  - Hero with the arch crop and floating tilted pills.
  - Full-bleed bands alternate as in `diseno.jpeg`.
  - Highlight pills on key words.
  - Stats exactly "2 botones · 0 pantallas · hasta 8 familiares · 3 notas por melodía".
  - FAQ uses native `<details>`, with brief §13 items 1, 2, 3, 5, 6, 8, 10, 14, 15. Item 15 keeps "Todavía no…" wording.
  - Safety tiles use the spec §4 row 7 wording.
  - Footer line: "WoKiToKi · nombre provisional · Un desarrollo de Simian · Prueba de concepto · Sin afiliación con WhatsApp ni Meta".
- [ ] **Step 2: Add a small inline script** that swaps `data-src` placeholders for real files when they exist (try png/jpg/webp). Same behaviour as the brochure's script.
- [ ] **Step 3: Verify.** Capture 1440×900 and 390×844 full page with `node ~/.claude/skills/anatomy/scripts/capture.mjs "file://$PWD/landing/index.html" --width W --height H --scale 1 --out <png>`. Expected output: `scrolls sideways: no` and `console: clean`. Look at both PNGs.
- [ ] **Step 4: Verify copy.** Run `grep -nE "RF-|RNF-|D-0|DH-|comprar ahora|reserva" landing/index.html`. Expected: no matches, except "Aún no se puede comprar" and the FAQ "¿Ya se puede comprar?".

---

### Task 3: "Pruébala" simulator

**Files:**
- Create: `landing/js/simulator.js` (pure), `landing/js/sim-audio.js`, `landing/js/sim-view.js`, `landing/tests/simulator.test.mjs`
- Modify: `landing/index.html` (load `sim-view.js` as a module)

**Interfaces:**
- Consumes: `#sim-mount`, tokens `--btn-red`, `--btn-green`, `--fam-*`.
- Produces:
  - `createSimulator({ queue, minHoldMs = 300, maxHoldMs = 15000 })` returns `{ pressRed(t), releaseRed(t), pressGreen(t), tick(t), reset(), getState() }`.
  - Each event method returns an ordered array of effect strings from this exact set: `squelch-open`, `squelch-short`, `click`, `roger`, `sent`, `more`, `jingle:<id>`, `voice:<id>`, `light:off`, `light:solid:<colour>`, `light:pulse:amber`, `light:flash:green`, `light:breathe:<colour>`.
  - `queue` item: `{ id, name, colour, notes }`. Default queue:
    - `abuela`: pink, `['C4','E4','G4']`
    - `tio`: blue, `['G4','E4','C4']`
    - `mama`: green, `['C4','C4','G4']`
  - `getState()` returns `{ recording: boolean, pending: number, lastPlayedId: string|null }`.
  - `createAudio()` returns `{ play(effect), setMuted(bool), isMuted() }`. It creates its AudioContext lazily on the first `play`.

- [ ] **Step 1: Write failing tests** in `landing/tests/simulator.test.mjs` (`node:test`, `node:assert/strict`):
  - `red hold then release sends`: `pressRed(0)` returns `['squelch-open','light:solid:red']`. `releaseRed(1000)` returns `['roger','light:pulse:amber','sent','light:flash:green']`.
  - `short red tap sends nothing`: `pressRed(0)`, then `releaseRed(200)` returns `['click','light:off']`.
  - `hold past max auto-cuts and sends`: `pressRed(0)`, then `tick(15001)` contains `'roger'` and `'sent'`. A later `releaseRed` returns `[]`.
  - `green plays oldest first with its colour`: the first `pressGreen` contains `'jingle:abuela'`, `'light:solid:pink'`, `'voice:abuela'`, `'more'`.
  - `last message has no more tone`: after 3 presses, the third result does not contain `'more'`, and `getState().pending === 0`.
  - `green with empty queue only squelches`: with an empty queue, `pressGreen` returns `['squelch-short']`.
  - `pending light breathes in oldest colour`: `reset()` returns an array containing `'light:breathe:pink'`.
- [ ] **Step 2: Run the tests and confirm they fail.** Run `node --test landing/tests/`. Expected: FAIL (module not found).
- [ ] **Step 3: Implement `createSimulator`** in `landing/js/simulator.js` with no DOM or audio access. Timing comes only from the `t` arguments.
- [ ] **Step 4: Run the tests and confirm they pass.** Run `node --test landing/tests/`. Expected: all PASS.
- [ ] **Step 5: Implement `createAudio`** in `sim-audio.js` with Web Audio synthesis:
  - squelch: filtered noise burst;
  - roger beep: short 1 kHz;
  - `sent`: two soft ascending notes;
  - `more`: two short ascending notes;
  - `click`: very short dry tick;
  - jingles: the three notes at about 160 ms each;
  - `voice`: a soft babble stand-in, made of short formant-like tones, never recorded audio.

  Then implement `sim-view.js`:
  - Draw the 2D box (no text on it) with a light and two buttons as `<button>` elements with `aria-label`s.
  - Pointer and keyboard events: Space/Enter keydown = press, keyup = release.
  - A legend outside the box: family member, colour and melody.
  - "Reiniciar" and "Silenciar" controls.
  - Render the `light:*` effects with CSS classes. Under reduced motion, breathe and pulse become static colours.
- [ ] **Step 6: Manual check in the browser:**
  - no sound before the first press;
  - mute silences everything while the light still responds;
  - Tab reaches both buttons and Space works.

---

### Task 4: Registration form

**Files:**
- Create: `landing/js/registro.js` (pure validation), `landing/js/registro-view.js`, `landing/tests/registro.test.mjs`
- Modify: `landing/index.html` (form markup in `#registro`, privacy placeholder link)

**Interfaces:**
- Consumes: `#registro-form`.
- Produces:
  - `validateRegistration({ nombre, email, whatsapp, edad, ciudad, piloto, consentimiento })` returns `{ ok: boolean, errors: Record<string,string> }`.
  - `submitRegistration(data)`: the single future-endpoint hook. Today it resolves `{ ok: true }` without any network request, and a `// TODO(endpoint)` marks it.

- [ ] **Step 1: Write failing tests** in `landing/tests/registro.test.mjs`. Use these exact error strings:
  - `requires name`: an empty `nombre` gives `errors.nombre === 'Escribe tu nombre.'`.
  - `requires email or whatsapp`: both empty gives `errors.contacto === 'Déjanos un correo o un WhatsApp.'`.
  - `rejects malformed email`: `email:'ana@'` gives `errors.email === 'Revisa el correo.'`.
  - `accepts colombian whatsapp`: `whatsapp:'+57 300 123 4567'` gives no `whatsapp` error. Fewer than 7 digits gives `errors.whatsapp === 'Revisa el número.'`.
  - `edad must be 3 to 7`: `edad:'8'` gives `errors.edad === 'Elige una edad entre 3 y 7 años.'`.
  - `requires consent`: `consentimiento:false` gives `errors.consentimiento === 'Necesitamos tu autorización para guardar tus datos.'`.
  - `valid data passes`: complete valid data gives `ok === true` and `{}` errors. `piloto` is optional.
- [ ] **Step 2: Run the tests and confirm they fail.** Run `node --test landing/tests/registro.test.mjs`. Expected: FAIL.
- [ ] **Step 3: Implement `validateRegistration`** and `submitRegistration`. Trim strings. For WhatsApp, count digits only.
- [ ] **Step 4: Run the tests and confirm they pass.** Run `node --test landing/tests/`. Expected: all PASS.
- [ ] **Step 5: Wire up `registro-view.js`:**
  - validate on submit;
  - each error goes next to its field with `aria-describedby`, and focus moves to the first error;
  - on success, replace the form with "¡Listo! Te avisaremos." in an `aria-live` region.
  - The consent label links to `#privacidad` (a placeholder section or modal), marked in source and visible text as "[Texto legal pendiente de revisión — Ley 1581]".

---

### Task 5: Anatomy figure, landing edition

**Files:**
- Modify: `figures/wokitoki-box/build.mjs` and `palette.mjs`. Add only; do not change existing defaults or outputs.
- Create: the landing build output under `figures/wokitoki-box/landing/` (a self-contained embeddable fragment, assets and script), and its embed in `#figure-mount`.

**Interfaces:**
- Consumes: `#figure-mount`, landing tokens.
- Produces: `node figures/wokitoki-box/build.mjs --landing`, which writes the Spanish, landing-themed figure. The existing invocation stays unchanged.

- [ ] **Step 1: Record the brochure hashes.** Run `shasum -a 256 figures/wokitoki-box/export/*`.
- [ ] **Step 2: Add a `--landing` mode:**
  - Spanish strings for all UI and part names: buttons "Desarmar" / "Armar", "Hablar", "Escuchar", and every `PIECES` name/`say` text translated.
  - Light theme, re-themed through the `--wk-*` tokens to the landing palette.
  - Output as an embeddable fragment, not an iframe. Its CSS is scoped to its root.
  - Keyboard: keep Space/R/G scoped to the figure when it has focus.
- [ ] **Step 3: Rebuild both modes,** then run the audit: `node figures/wokitoki-box/build.mjs`, `node figures/wokitoki-box/build.mjs --landing`, `node figures/wokitoki-box/build.mjs --audit`. Expected: `audit passed`.
- [ ] **Step 4: Re-run `shasum -a 256 figures/wokitoki-box/export/*`.** Expected: identical to Step 1.
- [ ] **Step 5: Embed** the fragment in `#por-dentro`. Add the caption "Render conceptual · la caja está diseñada, aún no construida". Capture the section at 1440 and 390 px and look at both.

---

### Task 6: Impeccable review pass and final verification

**Files:**
- Modify: any `landing/` file the findings point to.

- [ ] **Step 1: Run `/impeccable critique`** on `landing/index.html`, with the dual assessment. Then run `/Users/mager19/.claude/skills/impeccable/scripts/impeccable detect --json landing/index.html`.
- [ ] **Step 2: Fix every P0/P1 finding in one batch.** For P2/P3, fix them or write the waiver in `landing/README.md`.
- [ ] **Step 3: Run the confirmation round, at most once:**
  - full-page captures at 1440×900, 2000×790 and 390×844, plus a reduced-motion capture;
  - `node --test landing/tests/` all PASS;
  - the copy grep from Task 2 Step 4 clean;
  - the brochure hashes unchanged.
- [ ] **Step 4: Write `landing/README.md`:**
  - how to open the page;
  - where images go (`landing/assets/images/` + filenames);
  - how to run the tests;
  - how to rebuild the figure;
  - the open legal placeholder;
  - the `submitRegistration` hook.
