# WoKiToKi Landing — Design

Date: 2026-10-20
Status: draft for approval

## 1. Intent

A landing page for **parents** that explains what WoKiToKi is and how it works, and lets them **register their interest** (and opt into the pilot). It will be public eventually but is **not going live yet**.

Why: the product is in proof of concept; the next phase (Pilot, 10–50 real families) needs interested families, and parents need to understand a screenless two-button box in seconds.

## 2. Goals, non-goals, anti-goals

**Goals**
- A parent understands in ~10 seconds: a box with two buttons and a light; the child talks, the family answers from their normal WhatsApp; no screens, no strangers.
- The page feels warm and playful, unmistakably WoKiToKi, with the **look of the reference design** (`diseno.jpeg`, "Scribo" template).
- Two interactive moments make the product tangible: a **"Pruébala" simulator** and the **anatomy exploded figure**.
- The registration form collects interest honestly.

**Non-goals**
- Selling: no buy button, no price, no reservation.
- A working backend for the form (page is not live yet).
- The 3D scroll-driven explode concept (tried in `landing/spike-scroll/`, rejected by the user — do not reuse that direction).
- Simian-dominant styling (that was the brochure).

**Anti-goals (failure even if it looks good)**
- Any claim forbidden by `docs/BRIEF-BROCHURE.md` §16: for sale/reservable; the box exists physically or photos presented as a real product; tested with children / "kids love it"; Ley 1581 compliance or certification; automatic deletion; encryption; QR onboarding as done; mic physically disconnected; works anywhere; official WhatsApp/Meta product or partnership; final name; invented metrics.
- Internal IDs (RF-xx, RNF-xx, D-xx, DH-xx) visible anywhere.
- WhatsApp or Meta logos/brand marks.
- Product illustrations of the box with a screen, words or UI icons on it.
- Alarmist tone about screens or dangers.

## 3. Constraints

- **Language:** neutral Spanish, Colombia as initial market. Warm, short sentences, concrete scenes (brief §14 tone).
- **Name:** WoKiToKi (keep a discreet "nombre provisional" note in the footer unless told otherwise).
- **Content truth:** `docs/BRIEF-BROCHURE.md`. Respect status labels: say "diseñado para" for designed-not-built behaviour; RF-34 (no private adult-child channel) is designed but not implemented — if mentioned, say so.
- **Visual reference:** `diseno.jpeg` (Scribo). Adopt its structure and language: cream background alternating with dark-green and forest-green full-bleed bands; hand-drawn doodles (squiggles, spirals, stars, arrows, hearts); key words highlighted in coloured pills; hero photo cropped in an arch with floating tilted pills; centred section titles; icon grid; big-number stats row; image cards; dark closing band with CTA; footer.
- **Identity:** WoKiToKi's own (not Simian). Base palette from Scribo (cream, dark green, forest green), accents = the six family colours (pink, blue, green, orange, violet, yellow) plus the product's red (talk) and green (listen). A rounded, friendly display typeface (not Vollkorn). Simian appears only as a signature ("Un desarrollo de Simian").
- **Accessibility:** WCAG AA contrast; keyboard-operable simulator and figure; respects `prefers-reduced-motion`; works at 390 px phone width with no horizontal scroll.
- **Tech:** static HTML/CSS/JS in `landing/` (no framework required). Web Audio API for sounds.
- **Quality loop:** every graphic element and the full page reviewed with the `impeccable` skill; findings fixed or consciously waived.

## 4. Decided structure (Scribo block → WoKiToKi section)

| # | Scribo block | WoKiToKi section | Content |
|---|---|---|---|
| 0 | Nav | Nav | Wordmark · Qué es · Cómo funciona · Seguridad · Preguntas · button "Sé de las primeras familias" (scrolls to form) |
| 1 | Hero "Creative Solutions" | **Hero** | "Su propia **voz**, sin pantallas." Sub: two buttons to talk with the whole family; family answers from the WhatsApp they already have. Arch photo: child pressing the red button. Floating pills: "Sin pantallas", "Solo su familia", "Nada que instalar". |
| 2 | "Who We Are" (dark band) | **Qué es** | Collage (box concept + grandparent with phone). Short explanation of the loop child ↔ WhatsApp. |
| 3 | "Confidence in Every Solution" (green band, 6 icons) | **Cómo funciona** | 6 icon items: Rojo para hablar · Verde para escuchar · La luz respira en el color de quien espera · Cada familiar tiene su melodía · Llega como nota de voz a WhatsApp · Nada que instalar. |
| 3b | (new) | **Pruébala** (simulator) | See §5. Placed right after "Cómo funciona". |
| 4 | "Design that drives Results" (stats) | **Cifras** | 2 botones · 0 pantallas · hasta 8 familiares · 3 notas por melodía. Only design facts — no invented metrics. |
| 5 | "Projects that Make a Difference" (cards) | **Para toda la familia** | Cards: Niño (3–7) "habla solo, sin ayuda" · Mamá/papá "funciona sin configurar nada" · Abuelos y tíos "responden desde su WhatsApp". |
| 6 | Video block | **Mírala por dentro** | The anatomy exploded figure, light theme, interactive (take apart, red, green). Caption: "Render conceptual · la caja está diseñada, aún no construida". |
| 7 | "Innovating with the Best" (logos) | **Pensado para protegerlo** | 4–6 tiles: Solo números que la familia autoriza (diseñado para) · Micrófono solo con el botón apretado · Sin feed, sin publicidad, sin desconocidos · Solo voz (textos, fotos y stickers se ignoran) · Volumen limitado (diseñado). Honest status wording. |
| 8 | (new) | **Preguntas frecuentes** | Accordion from brief §13, parent-relevant subset; must include "¿Ya se puede comprar? — Todavía no…". |
| 9 | "Let's Create Impact Together" (dark band) | **Registro** | Title "Sé de las primeras familias". Form (§6). |
| 10 | Footer | Footer | WoKiToKi wordmark · "Un desarrollo de Simian" · "Nombre provisional · Prueba de concepto · Sin afiliación con WhatsApp ni Meta". |

## 5. "Pruébala" simulator

- A drawn (2D, on-brand) version of the box: one light, a red button, a green button. **No text on the box itself**; instructions live outside it.
- **Red (press and hold):** squelch sound, light solid red while held; on release roger beep, light amber pulse, then two soft ascending notes + green flash ("enviado"). A tap shorter than ~300 ms gives a soft dry click and sends nothing.
- **Green (press):** plays the next pending family member's 3-note jingle and the light holds that member's colour; then a short "message" (a synthesized babble or a soft tone sequence standing in for a voice — no recorded voices); if more remain, the two-note "hay más" tone. With nothing pending: a short squelch.
- Pre-loaded queue, e.g. Abuela (do-mi-sol, pink), Tío (sol-mi-do, blue), Mamá (do-do-sol, green); while messages wait, the light breathes slowly in the colour of the oldest one.
- A small legend outside the box maps colours/melodies to family members and offers "Reiniciar".
- All sounds synthesized with Web Audio (matches the real product). Sound starts only after a user gesture; visible mute toggle.
- Keyboard: buttons focusable, Space/Enter act as press; reduced motion → no breathing animation (static colour).

## 6. Registration form

- Fields: nombre; correo o WhatsApp (at least one); edad del niño (3–7 select); ciudad; checkbox "Quiero participar en el piloto"; **required consent checkbox** for data processing linking to a privacy policy.
- Under the button: "Te avisamos cuando esté disponible. Aún no se puede comprar."
- Not live: client-side validation and a success state ("¡Listo! Te avisaremos.") only; no network request. Leave a single clearly marked hook for a future endpoint.
- The privacy-policy text and consent wording are **placeholders to be written/reviewed by legal** (Ley 1581); mark them visibly as such in the source.

## 7. Assets

- **Nanobanana images (prompts to be produced for the user):** hero arch photo (child 3–7 pressing the red button of the box, warm home light); "Qué es" collage pieces (box concept; grandparent smiling while listening to a voice note on a phone with a generic unbranded chat UI); three family cards (child, parent, grandparent). **People are illustrated, not photographic** (user decision). Use one consistent warm illustration style that sits naturally next to Scribo's hand-drawn doodles, so it never reads as a real child testing a real product. The arch and card crops from the reference stay. Rules: box always a conceptual render matching the anatomy figure (off-white shell, banana base, red/green buttons, one light), no screen/text/logos on it, no WhatsApp branding, stylised enough not to read as a photo of a real finished product.
- **Anatomy figure:** `figures/wokitoki-box/` light theme; its UI strings must be translated to Spanish and re-themed to the landing palette via its `--wk-*` tokens if needed.
- **Doodles:** hand-drawn SVG set (squiggle, spiral, star, arrow, heart, sound waves) in family colours.
- **Icons:** one consistent line-icon set.
- Until images arrive, sized placeholders with matching filenames.

## 8. Calls made by Claude (check these)

- CTA is a registration form, not a buy button (brief §16; public audience).
- Consent checkbox + privacy link added because the form collects parents' data in Colombia.
- "Pruébala" simulator added as the main explanatory interaction (user approved).
- Rounded display typeface instead of Vollkorn; Scribo palette + family colours.
- The anatomy figure is reused as "Mírala por dentro". The builder may modify the figure's source in `figures/wokitoki-box/`, but only by **adding** a separate landing build output: Spanish strings and the landing theme, embedded in the page as a component and not in an iframe. The existing outputs the brochure depends on (`export/wokitoki-exploded.svg` and the PNG) must stay byte-identical. Check them with a hash before and after.
- Images: the nanobanana prompts are the first deliverable, and they are new prompts for the landing palette; the brochure prompts are not reused. The page is built with sized placeholders, and the images go in when they arrive.

## 9. Left to the builder

- Exact typefaces (rounded display + readable body), spacing, grid and breakpoints.
- Doodle drawings and placement.
- Final Spanish copy within the constraints.
- Simulator timing/synthesis details within §5.
- File structure inside `landing/`.
