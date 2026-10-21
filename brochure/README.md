# WoKiToKi — tri-fold brochure

Digital tri-fold brochure that presents **WoKiToKi** (provisional name) to Simian's
internal innovation committee. US Letter landscape (11 × 8.5 in), roll fold, two pages,
RGB, no bleed.

- Page 1, outside face: **Flap | Back | Cover**
- Page 2, inside face: **Inside 1 (problem → mission) | Inside 2 (how it works) | Inside 3 (benefits and protection)**

Spec: `../docs/superpowers/specs/2026-10-20-walkie-brochure-design.md`.
Content source of truth: `../docs/BRIEF-BROCHURE.md` (read §16 before changing any copy).

## Files

| Path | What it is |
|---|---|
| `index.html` | All copy and structure. One `<article class="panel …">` per panel, in fold order. |
| `styles.css` | Layout, brand tokens (`:root`), type scale. Physical units (in, pt). |
| `walkie-brochure.pdf` | The exported 2-page PDF. |
| `assets/PROMPTS.md` | Image list with sizes and ready-to-paste nanobanana prompts, icon list, logo list. |
| `assets/images/` | Drop the generated images here. |
| `assets/logo/` | Simian logos, vector, extracted from the identity manual. |
| `assets/icons/` | Source SVGs of the Streamline Core Line icons used (inlined in `index.html`). |

## Add the generated images

1. Generate each image with the prompts in `assets/PROMPTS.md`.
2. Save it in `assets/images/` with the exact name (the cover no longer takes an image: it shows the exploded figure from `../figures/wokitoki-box/export/`), any of `.png`, `.jpg`, `.jpeg`, `.webp`:
   - `inside2-nino` — Inside 2, left circle
   - `inside2-abuela` — Inside 2, right circle
3. Open `index.html` in Chrome to check, then re-export the PDF.

No HTML change is needed: a small script in `index.html` looks for each file and
replaces the dashed placeholder when it finds it (`back-caja-angulo` from PROMPTS.md is a
spare and has no slot). Circles crop the centre of the
image (`object-fit: cover`); to shift the crop, add e.g.
`style="object-position: 50% 40%"` to that `<img>`.

## Edit the copy

Edit the text directly in `index.html`. Keep it within the panel: each panel has a
fixed 8.5 in height and hides overflow, so re-export and look at both pages after any change.
Before adding a claim, check `../docs/BRIEF-BROCHURE.md` §16 ("Lo que NO se debe
afirmar") and the status labels in §7/§11. Never add internal IDs (RF-, RNF-, D-, DH-).

Colours, fonts and panel widths live in `:root` at the top of `styles.css`.
Panel widths follow the roll fold: the fold-in panel (Flap outside, Inside 3 inside)
is 3.625 in, the other two are 3.6875 in.

## Re-export the PDF

From this folder (`brochure/`), with Google Chrome installed (macOS path shown):

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless --disable-gpu --allow-file-access-from-files \
  --no-pdf-header-footer --virtual-time-budget=15000 \
  --print-to-pdf=walkie-brochure.pdf "file://$PWD/index.html"
```

Check it has exactly 2 pages of 792 × 612 pt: `pdfinfo walkie-brochure.pdf`.
Fonts (Vollkorn, Source Sans 3) load from Google Fonts, so the export needs internet.

Manual alternative: open `index.html` in Chrome → Print → Save as PDF, paper
**Letter**, layout **Landscape**, margins **None**, **Background graphics** on,
**Headers and footers** off.

## Going to print later

The layout already uses true tri-fold proportions. A print version needs only:
0.125 in bleed on the outer edges (extend panel backgrounds), crop marks, and a CMYK
conversion by the printer or in a prepress tool.

## Credits

- Logos: Simian, from the visual identity manual (vector paths extracted as is).
- Icons: Streamline Core Line – Free, CC BY 4.0 (credit line on the Back panel).
- Fonts: Vollkorn and Source Sans 3 (SIL Open Font License), via Google Fonts.
