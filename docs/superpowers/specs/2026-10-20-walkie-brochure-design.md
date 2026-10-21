# WoKiToKi Brochure — Design

Date: 2026-10-20
Status: draft for approval

## 1. Intent

Produce a printed/PDF tri-fold brochure that presents **WoKiToKi** (provisional name) to an **internal innovation committee**. The goal is to *communicate the idea*: the mission, what the project wants to achieve, and that it is a **custom, in-house development by Simian**. It is not a sales piece and does not ask the committee for a decision.

Why: the committee reviews innovation initiatives; they need to understand the problem, the idea, how it works and where it stands, quickly and credibly.

## 2. Goals, non-goals, anti-goals

**Goals**
- A reader understands in under a minute: who it is for, the problem, the idea, how a message travels.
- The mission is explicit and memorable.
- "Desarrollo propio, hecho a la medida" is clearly visible.
- Technical content is present but light (3–4 plain-language points, no jargon walls).
- Looks unmistakably Simian.

**Non-goals**
- Selling to parents, pricing, business model, purchase/booking CTA.
- A WoKiToKi-owned visual identity (separate future exercise).
- Deep technical documentation (architecture diagram, component table, costs).

**Anti-goals (a failure even if it looks good)**
- Any claim listed in `docs/BRIEF-BROCHURE.md` §16 ("Lo que NO se debe afirmar"). Key ones: for sale; the box physically exists; tested with children; legal compliance (Ley 1581); automatic audio deletion; encryption; QR onboarding as done; mic physically disconnected; works anywhere; official WhatsApp/Meta association; "WoKiToKi" as final name.
- Internal IDs (RF-xx, RNF-xx, D-xx, DH-xx) appearing anywhere.
- Product illustrations showing a screen, words or UI icons on the box.
- WhatsApp or Meta logos.

## 3. Constraints

- **Language:** neutral Spanish (Colombia as initial market).
- **Source of truth for content:** `docs/BRIEF-BROCHURE.md`. Respect the status labels (Validado / Implementado / Diseñado / Pendiente) when wording anything.
- **Brand:** Simian visual identity manual (`docs/Manual de identidad Visual - Simian.pdf`):
  - Primary colors: Green forest `#0B785D`, Banana light `#F4DF97`, Dark trunk `#462B0D`. Neutrals: gray scale 0 `#FFFFFF`, 100 `#E7E5E4`, 600 `#6B6561`, 800 `#363330`, 900 `#1B1918`; warm off-white (Dark trunk 100) as used in the manual's stationery (~`#FBF6EE`).
  - Type: **Vollkorn** (H1/H2: 700/600/500) and **Source Sans Pro / Source Sans 3** (H3, body, labels: 700/600/400).
  - Icons: Streamline **Core Line – Free** (CC BY 4.0, requires credit).
  - Photo treatment, if photos are used: dark green or yellow duotone filters.
  - Logo rules: horizontal imagotype preferred; white-bordered monkey on dark backgrounds; no recolor, reorder, distortion or cropping; respect safety area.
  - Text/background pairs must meet WCAG AA (manual lists approved pairs).
- **Product accent:** the red (talk) and green (listen) button colors are the *only* non-Simian colors. The six family colors are not used in this piece (reserved for the WoKiToKi-identity exercise).
- **Format:** tri-fold, US Letter landscape (11 × 8.5 in), two faces, folded in three (roll fold). Each panel ≈ 3.67 in wide.
- **Distribution:** digital only for now (sent as PDF, read on screen). No print run planned.
- **Deliverables:** a 2-page landscape PDF in RGB, without bleed or crop marks: page 1 is the outside face, page 2 the inside face. The source HTML/CSS stays in `brochure/` for future edits. The layout keeps real tri-fold panel proportions, so a print version later only needs bleed and color-mode changes.
- **Project layout:** `docs/` holds the shared sources, `brochure/` this piece (HTML, assets, PDF), and `landing/` is reserved for the landing page project.
- **Quality loop:** every graphic element (each panel, each illustration, icons, the full spread) is reviewed with the `impeccable` skill (critique/audit) before it is accepted; findings are fixed or consciously waived.

## 4. Decided structure

Panel order follows a standard roll fold.

**Outside face** (left → right): `Flap` | `Back` | `Cover`

| Panel | Content |
|---|---|
| **Cover** (right) | Label "Iniciativa de innovación · Simian". Title "WoKiToKi" (with discreet "nombre provisional" note somewhere in the piece). Headline: "Su propia voz, sin pantallas." Hero: conceptual render of the box (two buttons + light). Simian imagotype. |
| **Flap** (left; seen on the right when the cover is opened, next to Inside 1) | **La idea.** Three-line pitch (box with a light and two buttons; voice goes to family WhatsApp; no screens, no text, no strangers, nothing to install). **Para quién:** Niño (3–7), Cuidador principal, Círculo cercano. |
| **Back** (center) | **Hecho a la medida** (custom in-house build: own server, box simulator, official WhatsApp connection, box hardware designed) + **Hoja de ruta** (Fase 0 Prueba de concepto — en curso → Fase 1 Piloto → Fase 2 Escala) + Simian signature "Technology for human beings" + small disclaimer. |

**Inside face** (left → right): `Inside 1` | `Inside 2` | `Inside 3`

| Panel | Content |
|---|---|
| **Inside 1** (behind the cover; first panel read on opening) | **El problema → Nuestra misión.** A 3–7 year old who can't read has no way to talk to their family alone; screens bring what parents want to avoid. Mission statement (draft below). |
| **Inside 2** (visual center, banana background) | **Cómo funciona.** Red = hablar (mantener), Green = escuchar (una pulsación). Numbered journey of one message, condensed to ~5 steps: niño aprieta rojo y habla → la familia recibe una nota de voz en WhatsApp → la abuela responde con su voz → la luz "respira" en su color → niño aprieta verde, suena su melodía y su voz. |
| **Inside 3** | **Beneficios y protección.** Icon list: Autonomía; Sin pantallas; Solo su familia (números autorizados); Sabe quién le habla sin leer (melodía + color); A prueba de errores; Micrófono solo con el botón apretado; Nada que instalar para la familia. Key-message strip: "Sin pantalla. Sin texto. Sin desconocidos." |

Elements adopted from the examples: hero cover with product, icon-led sections, numbered step flow, benefits grid, key-message strip, brand-signed closing panel. Excluded on purpose: price/subscription block, sales contact block.

## 5. Copy direction

- Tone: warm, simple, honest; short sentences; concrete scenes (the child presses red, grandma answers, her melody plays).
- Reuse the brief's key messages (§14) where they fit: "Dos botones. Toda la familia.", "Rojo para hablar. Verde para escuchar.", "La familia responde desde WhatsApp. Sin instalar nada.", "Solo escucha cuando el botón está apretado."
- Draft mission (to be refined in build): *"Darle a cada niño que todavía no lee una voz propia hacia su familia, sin ponerle una pantalla en las manos."*
- Status wording must be honest: say "validado de punta a punta con WhatsApp real" for the end-to-end flow; say "diseñada" (not built) for the box; roadmap shows Fase 0 as "en curso".
- Disclaimer line (back panel, small): name is provisional; illustrations are conceptual; project in proof-of-concept phase; not affiliated with WhatsApp or Meta.

## 6. Assets

**To be generated by the user with nanobanana (prompts delivered by the builder):**
1. Cover hero: conceptual product render of the box — rounded, friendly object, two large arcade buttons (red, green), one soft light, no screen, no text, no logos; warm neutral background compatible with Green forest.
2. "Cómo funciona" illustration: child (3–7) at home pressing the red button, conceptual box, no text.
3. Family side: grandparent listening to a voice note on a phone — generic chat UI with no WhatsApp branding.
4. Optional: alternative angle of the box for the back or Inside 2.

Prompts must enforce brand palette, "conceptual render" look, no text/logos/screens on the box, and output sizes suitable for 300 dpi print.

**Icons:** Streamline Core Line – Free, with credit line in the back panel.

**Logo:** Simian imagotype (horizontal) and the white-bordered monkey variant — vector files needed.

## 7. Calls made by Claude (check these)

- **Reading order:** on a roll fold, opening the cover shows Inside 1 (left) next to the Flap (right). So Inside 1 holds *Problem → Mission* and the Flap holds *La idea*. That keeps the problem → idea → how-it-works story; Inside 2 and 3 are revealed when the flap opens.
- **Images:** the nanobanana prompts are the first deliverable. The layout is built in parallel with sized placeholders, and the images go in when they arrive. Image 3 (grandparent with phone) goes in Inside 2, as the family side of the message journey.
- **Logo:** unless official SVG/AI files are supplied, the vectors are extracted from the manual PDF as is (no redrawing, proportions kept).

## 8. Left to the builder

- Exact grid, margins, bleed and fold guides (respect Simian's 12-column logic adapted to panels).
- Final copy within the constraints above.
- Icon selection per benefit.
- How the HTML is structured and how the PDF is exported.
- Visual details within the brand: shapes, use of the manual's circle motifs, spacing, hierarchy.
