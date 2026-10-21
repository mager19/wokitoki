# WoKiToKi landing

A static page in plain HTML, CSS and ES modules. It has no build step for the page itself.

## Open the page

The page loads ES modules and fetches the box figure, so it must be **served over http**. Opening `index.html` as a `file://` URL does not work.

`landing/` is self-contained: the box figure is copied into `landing/vendor/wokitoki-figure/`, so you can serve or deploy `landing/` on its own:

```sh
# from landing/
python3 -m http.server 8901
# then open http://localhost:8901/
```

Serving the project root and opening `/landing/` works too. If the figure cannot be fetched, the mount shows "No pudimos cargar la vista por dentro" instead of an empty box.

## Images

Images go in `landing/assets/images/`, **saved as `.png`** with exactly these filenames:

| File | Where it shows |
|---|---|
| `hero-nino.png` | Hero arch (4:5) |
| `que-es-caja.png` | "Qué es" collage, front card (1:1). A conceptual render of the box |
| `que-es-abuela.png` | "Qué es" collage, back card (1:1) |
| `familia-nino.png` | "Para toda la familia", first card (4:3) |
| `familia-papas.png` | "Para toda la familia", second card (4:3) |
| `familia-abuelos.png` | "Para toda la familia", third card (4:3) |

Each `<img>` points straight at `assets/images/<name>.png`. When the file loads, it replaces the illustrated placeholder. When it is missing, the `<img>` is removed, so you get no broken-image icon and the placeholder stays with its filename label. To use another format, change the `src` in `index.html`. The prompts for each image are in `assets/PROMPTS.md`.

People are illustrated, never photographed. The box is always a conceptual render, with no screen, text or logos on it.

## Tests

```sh
# from the project root
node --test landing/tests/*.test.mjs
```

The tests cover the simulator state machine (`js/simulator.js`) and the form validation (`js/registro.js`). Both are pure modules with no DOM access.

## Rebuild the box figure

The "Mírala por dentro" figure is generated, so do not edit the files in `figures/wokitoki-box/landing/` or `landing/vendor/wokitoki-figure/` by hand. The page loads `vendor/wokitoki-figure/wokitoki-figure.js`, and that module fetches `wokitoki-figure.html` next to it. `--landing` writes both files to `figures/wokitoki-box/landing/` and copies them into `landing/vendor/wokitoki-figure/`, so rebuild after any change to `build.mjs`, `live.js` or the landing styles.

```sh
# from the project root
node figures/wokitoki-box/build.mjs --landing   # writes figures/wokitoki-box/landing/ + landing/vendor/wokitoki-figure/
node figures/wokitoki-box/build.mjs --audit     # geometry audit, must end with "audit passed"
shasum -a 256 -c .superpowers/sdd/2026-10-20-wokitoki-landing/brochure-hashes.txt   # brochure exports unchanged
```

The landing edition's words are in `buildLanding()` in `build.mjs`, and its layout is in `figures/wokitoki-box/landing.css`. Its colours come from `LANDING` in `palette.mjs`. The `--landing` mode never touches the brochure exports in `figures/wokitoki-box/export/`.

## Privacy: removed for now

The privacy section and the consent checkbox were removed on purpose, to be added back later. A `TODO(privacy)` comment in `index.html` marks where the consent field goes. Before the form collects real data, add back a consent checkbox, a privacy policy reviewed by legal (Ley 1581), and the consent rule in `validateRegistration`. Until then the page must not claim Ley 1581 compliance.

## The `submitRegistration` hook

`js/registro.js` exports `submitRegistration(data)`, the one place to connect a backend. Today it sends nothing and resolves `{ ok: true }`. Replace its body with the real request and return a promise for `{ ok: boolean }`. The view (`js/registro-view.js`) then shows success, or shows the retry message when the call rejects or returns `ok: false`.

`data` has the fields `nombre`, `email`, `whatsapp`, `edad`, `ciudad` and `piloto`.

## Waivers (Task 6 review)

- **Cream background (`cream-palette` detector rule):** the Scribo cream base is a brand decision from the brief, so it stays.
- **`cramped-padding` on full-bleed bands:** the bands are edge-to-edge colour fields by design. Their content is inset by `.container` and `--section-y`.
- **`gray-on-color` for `--on-dark-soft` (#CBDCCF) on the green bands:** this is a green-tinted cream, not a neutral gray, and it passes AA on both greens (about 5.7:1 on #1E5A3E and 9:1 on #16332B).
