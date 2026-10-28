# Landing sin WhatsApp y página de precios — Plan de implementación

> **Para agentes:** SUB-SKILL REQUERIDA: usar superpowers:subagent-driven-development (recomendado) o superpowers:executing-plans para implementar este plan tarea por tarea. Los pasos usan casillas (`- [ ]`) para seguir el avance.

**Objetivo:** quitar WhatsApp como canal del producto en la landing y agregar una página `/pricing/` de demostración, enlazada con un botón pequeño en el pie de página.

**Arquitectura:**
- Sitio estático en GitHub Pages, sin herramienta de build.
- Los textos se cambian directamente en el HTML.
- La página de precios es un HTML nuevo que reutiliza los estilos y componentes de la landing, más una hoja propia.
- Los tests de Node leen el HTML como texto y verifican el contenido y las rutas.

**Stack:** HTML, CSS, JS (módulos ES), `node --test`.

**Spec:** `docs/superpowers/specs/2026-10-28-app-propia-y-pricing-design.md`

## Restricciones globales

- **Texto visible en español; código, clases y comentarios en inglés.**
- **Precios con punto de miles:** «$350.000» y «$30.000».
- **Sin build:** al tocar un CSS o JS ya enlazado, se sube su `?v=`. Hoy están en `main.css?v=20261028b` y `registro.css?v=20261028b`.
- **El campo «WhatsApp» del formulario de registro se mantiene**, porque es un dato de contacto de la persona. También se mantienen su validación y la línea de la política de privacidad sobre ese campo.
- **Tests:** `node --test landing/tests/*.test.mjs` debe pasar al final de cada tarea. Se corre desde la raíz del repositorio.
- **Commits:** convencionales, sin línea `Co-Authored-By`. Pasan por la revisión de gentle-ai del repositorio.

## Foco de revisión

- **Celular de 390 px en `/pricing/`:** la fila «Paso 1 + Paso 2» y la línea de tiempo deben apilarse sin scroll horizontal. Se verifica en la Tarea 2, Paso 6.
- **Dirección sin barra final** (`…/landing/pricing`): GitHub Pages redirige a `/pricing/`. Las rutas relativas `../` solo funcionan con la barra. Se verifica que el enlace del pie use `pricing/` con barra, en la Tarea 3.
- **WhatsApp escondido en atributos** (`alt`, `aria-label`, `content` de metas): el test de la Tarea 1 revisa el HTML completo, no solo el texto visible.
- **Caché del navegador en la feria:** si el presentador ya abrió la página antes, podría ver la versión vieja. Por eso se sube el `?v=` de `main.css` (Tarea 3), y `pricing.css` nace con su propio `?v=`.
- **Rutas rotas en `/pricing/`:** cada `href` y `src` local de la página nueva debe apuntar a un archivo que exista. Lo verifica un test de la Tarea 2.

---

### Tarea 1: Quitar WhatsApp como canal del producto

**Archivos:**
- Crear: `landing/tests/copy.test.mjs`
- Modificar: `landing/index.html`, `landing/privacidad.html`

**Interfaces:**
- Produce: `landing/tests/copy.test.mjs`, con un helper `read(path)` que devuelve el HTML como texto. Las Tareas 2 y 3 le agregan tests.

- [ ] **Paso 1: Escribir el test que falla**

En `landing/tests/copy.test.mjs`, `read` lee el archivo relativo a `landing/` con `readFileSync(new URL('../' + path, import.meta.url), 'utf8')`.

Test `'WhatsApp only appears as the contact field of the registration form'`:
- En `index.html`, quitar las líneas de los bloques permitidos: las que contienen `f-whatsapp`, `err-whatsapp` o `>WhatsApp</label>`.
- En lo que queda, `/whatsapp/i` no aparece.
- `/\bMeta\b/` no aparece (cuidado: no confundir con la etiqueta `<meta`).
- `/n[uú]meros? autorizados?/i` no aparece.

Test `'privacy page keeps the contact-field line but drops the WhatsApp/Meta disclaimer'`:
- `privacidad.html` contiene `'tu número de WhatsApp'`.
- `privacidad.html` no contiene `'Sin afiliación con WhatsApp ni Meta'`.

Test `'install promise is gone'`:
- `index.html` no contiene `'Nada que instalar'` ni `'Nadie instala nada'`.
- `index.html` contiene `'app de WoKiToKi'`.

- [ ] **Paso 2: Correr el test y confirmar que falla**

Correr `node --test landing/tests/copy.test.mjs`.
Resultado esperado: FAIL en los tres tests.

- [ ] **Paso 3: Reescribir los textos**

Seguir la tabla de §3.2 del spec, fila por fila, con el tono cálido y simple de la landing. Puntos fijos:
- **Etiqueta flotante `.fp-3`:** pasa a decir «Sin cuentas para el niño».
- **Paso «Nada que instalar» de «Cómo funciona»:**
  - título: «Una app simple»,
  - texto: la familia la instala escaneando un código QR,
  - ícono: `#i-sin-instalar` se reemplaza por `#i-nota-voz` o `#i-volumen`, a criterio del implementador.
- **Pregunta frecuente «¿La familia necesita instalar algo?»:** empieza con «Sí, una app simple de WoKiToKi…» y explica el QR y que quien administra el grupo invita a los demás.
- **Pie de página:** se quita «· Sin afiliación con WhatsApp ni Meta» en `index.html` y en `privacidad.html`.

- [ ] **Paso 4: Correr los tests y confirmar que pasan**

Correr `node --test landing/tests/*.test.mjs`.
Resultado esperado: todos en PASS.

- [ ] **Paso 5: Revisar que el texto se lea natural**

Leer el HTML resultante en las secciones Portada, Qué es, Cómo funciona, Familia (las dos pestañas), Seguridad y Preguntas. Confirmar que ningún texto quedó cortado ni contradice a otro. Por ejemplo, nada puede seguir diciendo que no hay que instalar.

- [ ] **Paso 6: Commit**

```bash
git add landing/tests/copy.test.mjs landing/index.html landing/privacidad.html
git commit -m "feat(landing): replace WhatsApp with the WoKiToKi family app in the copy"
```

---

### Tarea 2: Página de precios `/pricing/`

**Archivos:**
- Crear: `landing/pricing/index.html`, `landing/styles/pricing.css`
- Modificar: `landing/tests/copy.test.mjs`

**Interfaces:**
- Consume: `read(path)` de la Tarea 1.
- Produce: la página en `landing/pricing/index.html`, que la Tarea 3 enlaza como `pricing/`.

- [ ] **Paso 1: Escribir los tests que fallan**

Agregar a `copy.test.mjs`:

Test `'pricing page states the approved price model'`. `read('pricing/index.html')` contiene:
- `'$350.000'`
- `'$30.000'`
- `'primer mes'`
- `'8 familiares'`
- `'30 días'`
- `'ilimitados'`
- `'Precios de referencia. WoKiToKi aún no está a la venta.'`
- `'cancela cuando quieras'` (sin distinguir mayúsculas)
- el aviso de que sin suscripción la caja no funciona: la expresión `/sin suscripci[oó]n/i`
- `'$1.000'`

Test `'pricing page is a demo page that links back to the landing'`:
- contiene `<meta name="robots" content="noindex">`,
- contiene `href="../#registro"`,
- contiene un enlace a `../` («Volver a la página»).

Test `'every local href/src on the pricing page resolves to a file'`:
- Extraer todos los `href="…"` y `src="…"` que no empiecen con `http`, `mailto:` o `#`.
- Quitarles la parte `?v=…` y el `#…`.
- Resolver cada uno desde `landing/pricing/`. Si termina en `/`, se resuelve como `index.html`.
- Comprobar con `existsSync` que el archivo existe.

- [ ] **Paso 2: Correr los tests y confirmar que fallan**

Correr `node --test landing/tests/copy.test.mjs`.
Resultado esperado: FAIL porque no existe `pricing/index.html`.

- [ ] **Paso 3: Construir `landing/pricing/index.html`**

El `<head>` copia el de `privacidad.html`, con rutas `../`:
- fuentes, favicon y `theme-color`,
- `noindex`,
- `tokens.css`, `main.css?v=20261028b` y `pricing.css?v=20261028a` (la Tarea 3 sube `main.css`),
- título «Precios · WoKiToKi».

La navegación tiene la marca WoKiToKi (enlace `../`) y un botón «Volver a la página» (`../`). El pie de página es el de la landing.

Las siete secciones van en el orden de §4.3 del spec, alternando franjas como en la landing:
1. `band--cream` · Precio
2. `band--dark` · Qué incluye el plan familiar
3. `band--cream` · Qué trae la caja
4. `band--forest` · Cómo funciona el pago
5. `band--dark` · En perspectiva
6. `band--cream` · Preguntas sobre el precio (con `<details>`, como en la landing)
7. `band--dark` · Cierre

Componentes:
- Reutilizar `h2 h2--center`, `hl hl--*`, `btn btn--dark` y los garabatos de `../assets/doodles/`.
- En «Qué trae la caja», usar la imagen `../assets/images/que-es-caja.png` con un `alt` descriptivo.
- La nota «Precios de referencia. WoKiToKi aún no está a la venta.» va justo debajo de las tarjetas de la sección 1.

- [ ] **Paso 4: Escribir `landing/styles/pricing.css`**

Solo lo que no existe en `main.css`:
- `.price-steps`: grid con tres columnas (tarjeta, «+», tarjeta) en escritorio y una sola columna en anchos de 720 px o menos.
- `.price-card`: tarjeta clara y su variante `--dark`.
- `.price-amount`: Fredoka, tamaño grande.
- `.price-tag`: etiqueta en pastilla.
- `.plan-grid`: 4 columnas, que bajan a 2 y luego a 1.
- `.pay-timeline`: 4 pasos con una línea que los une; en celular se apilan en vertical.
- `.per-day`: la cifra grande en `--fam-yellow`.

Todos los colores salen de los tokens de `tokens.css`, sin hex nuevos. Comentario de cabecera en el estilo de `legal.css`.

- [ ] **Paso 5: Correr los tests y confirmar que pasan**

Correr `node --test landing/tests/*.test.mjs`.
Resultado esperado: todos en PASS.

- [ ] **Paso 6: Revisión visual**

Servir la raíz del repositorio con `python3 -m http.server 8765` y abrir `http://localhost:8765/landing/pricing/` con Chrome sin interfaz (puppeteer-core, como en la sesión).

Comprobar:
- **Escritorio (1280 px) y celular (390 px):** `document.documentElement.scrollWidth <= innerWidth`.
- **Sin errores:** ningún `pageerror` en consola.
- **Captura de pantalla:** las siete secciones se ven en orden y con el estilo de la landing.

- [ ] **Paso 7: Commit**

```bash
git add landing/pricing/index.html landing/styles/pricing.css landing/tests/copy.test.mjs
git commit -m "feat(landing): add /pricing demo page with the subscription model"
```

---

### Tarea 3: Botón «Precios» en el pie de página

**Archivos:**
- Modificar: `landing/index.html`, `landing/styles/main.css`, `landing/tests/copy.test.mjs`

**Interfaces:**
- Consume: la página `pricing/` de la Tarea 2.

- [ ] **Paso 1: Escribir el test que falla**

Test `'landing footer links to the pricing page with a trailing slash'`:
- El bloque `<footer …>…</footer>` de `index.html` contiene `href="pricing/"`.
- La navegación (`<header class="nav">…</header>`) **no** contiene `pricing`.

- [ ] **Paso 2: Correr el test y confirmar que falla**

Correr `node --test landing/tests/copy.test.mjs`.
Resultado esperado: FAIL.

- [ ] **Paso 3: Agregar el enlace y su estilo**

En el pie de `index.html`, agregar una pastilla pequeña: `<a class="footer__pill" href="pricing/">Precios</a>`.

En `main.css`, sección Footer, agregar `.footer__pill`:
- borde de 1,5 px en `--green-forest`,
- fuente `--step--1`,
- color `--ink-soft`,
- radio `--pill`,
- y un estado `:hover`/`:focus-visible` visible.

Tiene que ser discreta: no debe competir con el botón principal. Subir `main.css?v=20261028b` a `?v=20261028c` en `index.html`, `privacidad.html` y `pricing/index.html`.

- [ ] **Paso 4: Correr los tests y confirmar que pasan**

Correr `node --test landing/tests/*.test.mjs`.
Resultado esperado: todos en PASS.

- [ ] **Paso 5: Commit**

```bash
git add landing/index.html landing/privacidad.html landing/pricing/index.html landing/styles/main.css landing/tests/copy.test.mjs
git commit -m "feat(landing): add discreet footer link to the pricing page"
```

---

### Tarea 4: Dejar la monetización como decidida

**Archivos:**
- Modificar: `docs/producto/2026-10-28-canal-familiar-y-monetizacion.md`

- [ ] **Paso 1: Actualizar el documento**

- **Encabezado:** cambiar «Estado» a «canal y monetización decididos».
- **§3:** pasa a llamarse «Monetización (decidida)». Arriba va el modelo:
  - caja de 350.000 COP con el primer mes incluido,
  - 30.000 COP al mes desde el segundo mes, sin permanencia,
  - sin suscripción la caja no funciona,
  - audios ilimitados guardados 30 días,
  - hasta 8 familiares con color y melodía,
  - IVA y envío sin definir: los precios son de referencia.
- **Historia:** conservar la propuesta original y las objeciones como «historia de la decisión».
- **§4:** marcar como hecho lo que ya cambió en la landing, y enlazar la página `/pricing/` y el spec.

- [ ] **Paso 2: Releer la estructura**

Releer el documento y confirmar que los encabezados y las listas quedan bien formados.

- [ ] **Paso 3: Commit**

```bash
git add docs/producto/2026-10-28-canal-familiar-y-monetizacion.md
git commit -m "docs(producto): record the decided pricing model"
```
