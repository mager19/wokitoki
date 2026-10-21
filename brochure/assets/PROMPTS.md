# WoKiToKi brochure — image, icon and logo resources

Everything the brochure (`brochure/index.html`) needs, panel by panel.
The layout already holds a sized placeholder for each image. Generate the image,
save it under `brochure/assets/images/` with the exact filename below, and it appears
in the layout without editing the HTML (`.png`, `.jpg` or `.webp` all work).

## Global rules (apply to every image)

- **Look:** conceptual product render, soft 3D, matte materials, slightly stylised
  (think "industrial design concept board", not a photo). It must read as a concept,
  never as a photo of a real, finished product: the box is designed, not built.
- **Palette:** Simian green forest `#0B785D`, banana light `#F4DF97`, dark trunk
  `#462B0D`, warm off-white `#FCF5EE`. The only other colours allowed are the two
  arcade buttons: **red** (talk) and **green** (listen).
- **Light:** one soft, diffuse key light from the upper left, gentle contact shadows.
  The box has exactly **one** small soft-glowing light.
- **Never:** a screen or display on the box, text, letters, numbers, labels, stickers,
  UI icons, logos, brand marks, watermarks. No WhatsApp or Meta logo, no WhatsApp
  green header or speech-bubble mark anywhere.
- **Colour mode:** RGB (sRGB). Sizes below are for 300 dpi at the placed size in the
  US Letter tri-fold; generating larger is fine, never smaller than the minimum.

### Box description (paste the same block in every prompt so the box stays consistent)

> a small, friendly, rounded rectangular box about the size of a paperback book lying
> flat, soft pillowy edges, matte warm off-white (#FCF5EE) top shell on a banana-yellow
> (#F4DF97) base, with exactly two large round arcade buttons on top: one glossy red,
> one glossy green, side by side, and one small round diffused light between and slightly
> above them, glowing softly; no screen, no display, no text, no icons, no logos

## Images

| # | File | Panel (page) | Placed size | Minimum px (300 dpi) | Generate at | Aspect |
|---|---|---|---|---|---|---|
| 1 | ~~`cover-hero`~~ **replaced** | Cover (page 1, right) — now the anatomy exploded figure, no image to generate | — | — | — | — |
| 2 | `inside2-nino` | Inside 2 "Cómo funciona" (page 2, center) — circular crop, left | 1.35 × 1.35 in | 405 × 405 | 1024 × 1024 | 1:1 |
| 3 | `inside2-abuela` | Inside 2 "Cómo funciona" (page 2, center) — circular crop, right | 1.35 × 1.35 in | 405 × 405 | 1024 × 1024 | 1:1 |
| 4 | `back-caja-angulo` *(optional, no slot in the current layout)* | Spare: alternative cover hero, or future landing/slides | — | 1920 × 1080 | 1920 × 1080 | 16:9 |

Images 2–3 are cropped to a circle by the layout: keep the subject centred with
about 12 % empty margin on every side. Image 4 is optional and has no slot in the current layout: the Back panel is
full, and a band image there pushed the disclaimer off the page (tested). Use it as
an alternative hero or for other pieces.

### 1. `cover-hero` — Cover hero (page 1, cover panel) — REPLACED

**No longer used.** The cover now shows the isometric exploded view of the box built with the
`anatomy` skill: `../figures/wokitoki-box/export/wokitoki-exploded.svg` (vector, flattened for print;
300 dpi PNG fallback next to it, 1020 × 1691 px = 3.4 × 5.64 in). It sits on a rounded paper card,
about 2.4 × 4.05 in, with the caption "Render conceptual · la caja está diseñada, no construida".
To change it, edit and rebuild `figures/wokitoki-box/` (`node build.mjs && node export.mjs`), then
re-export the PDF. The prompt below is kept only as a spare for other pieces (landing, slides).


```
Conceptual product render of a small, friendly, rounded rectangular box about the size of a paperback book lying flat, soft pillowy edges, matte warm off-white (#FCF5EE) top shell on a banana-yellow (#F4DF97) base, with exactly two large round arcade buttons on top: one glossy red, one glossy green, side by side, and one small round diffused light between and slightly above them, glowing softly in warm pink; no screen, no display, no text, no icons, no logos. Three-quarter view from slightly above, the box centred with generous empty space around it (about 12% margin on every side) so it can be cropped to a circle. Plain seamless warm off-white (#FCF5EE) background with a very subtle warm gradient, soft contact shadow under the box tinted dark trunk brown (#462B0D). One soft diffuse key light from the upper left, gentle highlights on the glossy buttons. Soft 3D industrial-design concept render, matte materials, calm and warm, minimal, toy-like but premium. Square 1:1, 2048x2048, sRGB. No text, no letters, no numbers, no logos, no watermark, no screen, no UI icons, no stickers, no WhatsApp or Meta branding, no people, no props.
```

### 2. `inside2-nino` — Child pressing the red button (page 2, Inside 2, left circle)

```
Conceptual soft 3D illustration, same render style as a product concept board: a young child about 5 years old, at home, sitting at a low wooden table, pressing and holding the big red arcade button of a small, friendly, rounded rectangular box (matte warm off-white #FCF5EE top shell on a banana-yellow #F4DF97 base, exactly two large round arcade buttons on top, one glossy red, one glossy green, and one small round diffused light glowing soft red; no screen, no display, no text, no icons, no logos). The child is speaking happily toward the box, eyes on the box, natural and candid, stylised (not photorealistic) so the child is not an identifiable real person. Cosy living room softly out of focus, palette limited to green forest (#0B785D), banana light (#F4DF97), dark trunk brown (#462B0D) and warm off-white (#FCF5EE); child's clothes in green forest or banana tones. One soft window light from the upper left. Subject centred with about 12% empty margin on every side for a circular crop. Square 1:1, 1024x1024, sRGB. No text, no letters, no numbers, no logos, no watermark, no screens anywhere in the scene, no phones, no tablets, no TV, no UI icons.
```

### 3. `inside2-abuela` — Grandmother listening on her phone (page 2, Inside 2, right circle)

```
Conceptual soft 3D illustration, same render style as a product concept board: a warm, smiling grandmother in her late sixties at home in an armchair, holding a smartphone close to her ear-side while listening to a voice message, gentle surprised joy on her face. The phone screen, if visible, shows only a generic, unbranded chat interface: a plain light background, two or three rounded neutral grey chat bubbles and one voice-message bubble with a simple audio waveform and a round play button; no app logo, no green header bar, no WhatsApp or Meta branding, no readable text, no names, no numbers, no profile photos. Stylised, not photorealistic, not an identifiable real person. Cosy room softly out of focus, palette limited to green forest (#0B785D), banana light (#F4DF97), dark trunk brown (#462B0D) and warm off-white (#FCF5EE); her cardigan in green forest or banana tones. One soft window light from the upper left. Subject centred with about 12% empty margin on every side for a circular crop. Square 1:1, 1024x1024, sRGB. No text, no letters, no numbers, no logos, no watermark, no brand marks, no speech-bubble logo.
```

### 4. `back-caja-angulo` *(optional)* — Alternative angle of the box (spare, no slot)

```
Conceptual product render, top-down view (about 70 degrees from above) of a small, friendly, rounded rectangular box about the size of a paperback book lying flat, soft pillowy edges, matte warm off-white (#FCF5EE) top shell on a banana-yellow (#F4DF97) base, with exactly two large round arcade buttons on top: one glossy red, one glossy green, side by side, and one small round diffused light between and slightly above them, glowing softly in warm green; no screen, no display, no text, no icons, no logos. The box sits slightly right of centre on a plain seamless warm off-white (#FCF5EE) surface, soft contact shadow tinted dark trunk brown (#462B0D), plenty of empty space on the left. One soft diffuse key light from the upper left. Soft 3D industrial-design concept render, matte materials, calm, minimal, premium. Wide 16:9, 1920x1080, sRGB. No text, no letters, no numbers, no logos, no watermark, no screen, no UI icons, no stickers, no WhatsApp or Meta branding, no people, no props.
```

### Checklist before dropping an image in

- [ ] The box has no screen, no text and no logo; exactly two buttons (red and green) and one light.
- [ ] No WhatsApp/Meta logo or green WhatsApp header (image 3 included).
- [ ] Only the Simian palette plus the red and green buttons.
- [ ] It reads as a concept render, not as a photo of a real product.
- [ ] Size at least the minimum above; sRGB.

## Icons — Streamline Core Line (Free), CC BY 4.0

Source: Streamline "Core Line – Free" set (14 px grid, 1 px stroke), fetched from the
Iconify mirror of the official set (`streamline:<name>`). Copies are in
`brochure/assets/icons/`; the brochure inlines them as SVG in green forest.
Credit line on the Back panel: "Iconos: Streamline (CC BY 4.0)".

| Where | Meaning | Icon name |
|---|---|---|
| Flap — Para quién | Niño (3–7) | `happy-face` |
| Flap — Para quién | Cuidador principal | `user-circle-single` |
| Flap — Para quién | Círculo cercano | `user-multiple-group` |
| Back — Hecho a la medida | Servidor propio | `database-server-1` |
| Back — Hecho a la medida | Simulador de la caja | `desktop-code` |
| Back — Hecho a la medida | Conexión por la API oficial de WhatsApp | `chat-bubble-oval` |
| Back — Hecho a la medida | Hardware de la caja (diseñado) | `computer-chip-1` |
| Inside 2 — Cómo funciona | Voice relay between the two circles | `voice-mail` |
| Inside 2 — Cómo funciona | "Validado de punta a punta" note | `shield-check` |
| Inside 3 — Beneficios | Autonomía | `one-finger-tap` |
| Inside 3 — Beneficios | Sin pantallas | `browser-block` |
| Inside 3 — Beneficios | Solo su familia | `user-check-validate` |
| Inside 3 — Beneficios | Sabe quién le habla sin leer | `music-note-2` |
| Inside 3 — Beneficios | A prueba de errores | `shield-check` |
| Inside 3 — Beneficios | Micrófono solo con el botón apretado | `voice-mail` |
| Inside 3 — Beneficios | Nada que instalar para la familia | `chat-two-bubbles-oval` |

## Logo assets

Extracted from `docs/Manual de identidad Visual - Simian.pdf` as the original vector
paths and fills (no redraw, no recolor, proportions kept). Saved in `brochure/assets/logo/`.

| File | Source page | Use |
|---|---|---|
| `simian-imagotipo-horizontal.svg` | p. 8 "Imagotipo — Horizontal principal" | Light backgrounds |
| `simian-imagotipo-horizontal-fondo-oscuro.svg` | p. 11 "Uso sobre fondos — Fondo oscuro" (white wordmark + white-bordered monkey) | Dark backgrounds (cover) |
| `simian-simio.svg` | p. 8 (monkey only, polychrome) | Light backgrounds |
| `simian-simio-borde-blanco.svg` | p. 11 (white-bordered monkey) | Dark backgrounds |

If official SVG/AI master files exist, drop them in with the same filenames.
