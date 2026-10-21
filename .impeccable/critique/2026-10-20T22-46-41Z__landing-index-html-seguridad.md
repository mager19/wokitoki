---
target: "landing #seguridad section"
total_score: 20
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:/Users/mager19/Documents/vibecoding/entregables_desde_code/wokitoki/landing/index.html#seguridad"
timestamp: 2026-10-20T22-46-41Z
slug: landing-index-html-seguridad
---
# Critique: landing #seguridad ("Pensado para protegerlo")

Method: dual-agent (A design · B detector+measurements)

Score 20/32 (n/a: 7, 9 partially scored 3, 10) — Acceptable
1:3 2:2 3:3 4:2 5:3 6:2 7:n/a 8:2 9:3 10:n/a

Detector: 12 gray-on-color (FP: 5.67 and 7.60), cramped-padding band (FP). Contrast all pass AA. Chip "Implementado en el prototipo" (196px, nowrap) eats the right padding (3.5px left at 1440, 0.2px at 1024). Page scrolls sideways by 4px at 1024 (cause outside the section).

P1 Inconsistent chip system: two labels for one state; the mic body says it works in the simulator, but the chip says only "Diseñado". Fix: one vocabulary, allow wrapping, and the mic gets two chips (Simulador: Implementado · Caja: Diseñado).
P1 Five equal tiles flatten the hierarchy and expose the uneven text. Fix: a 2+3 layout (feature row: whitelist + mic; compact row: no screen, voice only, volume) with tightened copy.
P2 The legend is a separate decoding step full of jargon. Fix: one coloured sentence; rename "Principio de diseño" to "Principio".
P2 Icons are small and generic, off-brand. Fix: family-colour filled circles, 64–72px, stroke 2px or more.
P2 The reassuring implemented facts are missing ("los audios del niño no se registran"), and "sin desconocidos" duplicates the whitelist as an unqualified principle. Fix: drop it; consider swapping volume for "Su voz no se guarda en los registros".
Mobile: 5 tall dark cards add up to about 1,300px; use compact rows for the minor items.
