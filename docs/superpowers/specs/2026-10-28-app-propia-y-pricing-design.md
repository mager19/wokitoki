# WoKiToKi — Landing sin WhatsApp y página de precios

Fecha: 2026-10-28
Estado: listo para aprobación

## 1. Intención

WoKiToKi deja de usar WhatsApp como canal de la familia: los familiares usarán una **app propia** de WoKiToKi (ver `docs/producto/2026-10-28-canal-familiar-y-monetizacion.md`). La landing tiene que contar el producto con ese canal nuevo.

Además, el producto se presentará en una **feria de emprendimientos**. Para esa demostración hace falta una **página de precios** con el modelo de negocio definido. Esa página es un ejercicio controlado: la abre quien hace la demostración, no forma parte del recorrido normal de la landing.

## 2. Objetivos, no-objetivos y anti-objetivos

**Objetivos**
- Ninguna mención a WhatsApp como canal del producto en la landing.
- Una página `/pricing` con la información completa del precio, con la misma guía de estilo de la landing.
- Un botón pequeño en la landing que lleve a `/pricing`, fácil de encontrar para quien presenta.

**No-objetivos**
- Construir la app, el cobro o un flujo de compra real. La página solo explica el modelo.
- Cambiar el folleto (`brochure/`) o el video demo (`video/`), que también muestran WhatsApp. Quedan para después.
- Mostrar pantallas de la app: todavía no existe. Se nombra, no se dibuja.
- Marcar de dónde viene cada registro (feria, página de precios): el formulario y la tabla de Supabase no cambian.

**Anti-objetivos** (cosas que harían fallar el trabajo aunque funcione)
- Que alguien entienda que paga 350.000 COP por algo que funciona para siempre: debe quedar claro que sin suscripción la caja no funciona.
- Que la página de precios parezca de otro sitio: tiene que verse como parte de la landing.
- Que el botón a `/pricing` compita con el llamado principal («Sé de las primeras familias»).

## 3. Parte A: quitar WhatsApp de la landing

### 3.1 Regla

Toda mención a WhatsApp **como canal del producto** pasa a ser **la app de WoKiToKi**. Se **mantiene** el campo «WhatsApp» del formulario de registro, porque ahí es un medio para contactar a la persona interesada, no el canal del producto (decisión del usuario). Por eso también se mantiene la mención de «tu número de WhatsApp» en la política de privacidad, que se refiere a ese campo.

### 3.2 Lugares a cambiar en `landing/index.html`

| Lugar | Hoy | Debe comunicar |
|---|---|---|
| `<meta name="description">` | «…que responde desde el WhatsApp que ya tiene…» | La familia responde desde la app de WoKiToKi |
| Portada, etiqueta flotante «Nada que instalar» (`.float-pill.fp-3`) | Promete que no hay nada que instalar | Ya no es cierto: reemplazar por otra ventaja verdadera (por ejemplo «Sin cuentas para el niño») |
| Portada (`.hero__lede`) | «Ellos responden desde el WhatsApp que ya tienen.» | Ellos responden desde la app de WoKiToKi |
| «Qué es» | «…como una nota de voz en WhatsApp.» | La voz llega como nota de voz a la app de la familia |
| «Cómo funciona», paso «Llega como nota de voz a WhatsApp» | Nota de voz en WhatsApp | Llega como nota de voz a la app |
| «Cómo funciona», paso «Nada que instalar» | «Los adultos usan el WhatsApp que ya tienen» | Una app simple: se instala escaneando un código QR. El título «Nada que instalar» deja de ser cierto y hay que cambiarlo |
| Tarjeta de familia «Abuelos y tíos» (pestaña Niños) | «Responden desde su WhatsApp» | Responden desde la app |
| Tarjeta «Nietos y familia» (pestaña Adultos mayores) | «Le contestan desde su WhatsApp» / «Nadie instala nada» | Le contestan desde la app; quitar «Nadie instala nada» |
| Tarjeta «Mamá y papá» | «Sin aplicaciones nuevas ni cuentas para el niño» | El niño no necesita cuenta ni pantalla; los papás administran el grupo desde la app e invitan a los familiares |
| Tarjeta «Hijos» (pestaña Adultos mayores) | Revisar | Coherente con que los hijos administran el grupo desde la app |
| Seguridad, «Solo voz» | «Textos, fotos y stickers que lleguen por WhatsApp se ignoran» | La caja solo maneja voz (sin textos, fotos ni stickers) |
| Pregunta frecuente «¿Qué es WoKiToKi?» | «…responde desde WhatsApp» | Responde desde la app de WoKiToKi |
| Pregunta frecuente «¿Sirve para un adulto mayor?» | «…le responde desde su WhatsApp» | Le responde desde la app |
| Pregunta frecuente «¿La familia necesita instalar algo?» | «No. Usa su WhatsApp normal…» | Sí: una app simple de WoKiToKi, que se instala con un código QR; quien administra el grupo invita a los demás |
| Pregunta frecuente «¿Puede un desconocido hablarle al niño?» | «…números autorizados…» | Solo los familiares invitados al grupo por quien lo administra |
| Pie de página | «Sin afiliación con WhatsApp ni Meta» | Quitar esa frase |

El constructor debe hacer además una búsqueda final de «WhatsApp», «Meta» y «número(s) autorizado(s)» en `landing/` para confirmar que solo queda el campo del formulario, su validación y la línea de la política de privacidad sobre ese campo.

### 3.3 También

- `landing/privacidad.html`: quitar «Sin afiliación con WhatsApp ni Meta» del pie.
- Las ilustraciones que muestran un celular con una burbuja de nota de voz genérica se mantienen: no tienen marca y sirven para la app.

## 4. Parte B: página de precios

### 4.1 Ubicación y acceso

- Ruta: `landing/pricing/index.html`, para que la dirección pública termine en `/pricing/`. Las rutas a estilos, imágenes y favicon son relativas (`../styles/…`).
- `<meta name="robots" content="noindex">`: es una página de demostración (decisión del constructor/asistente; ver §6).
- **Botón de acceso**: un enlace pequeño tipo pastilla con el texto «Precios», en el **pie de página** de la landing. No va en la navegación principal ni compite con el llamado a la acción. Decisión del asistente; ver §6.
- La página tiene arriba la marca WoKiToKi (enlace a la landing) y un botón «Volver a la página».

### 4.2 Modelo de precio (decidido por el usuario)

- **Caja: 350.000 COP**, pago único, **incluye el primer mes** de servicio.
- **Plan familiar: 30.000 COP al mes** desde el segundo mes, cobro automático, **sin permanencia**, se cancela cuando se quiera.
- **Sin suscripción activa, la caja no envía ni recibe mensajes.** Esto tiene que verse claro.
- El plan incluye:
  - audios ilimitados,
  - cada audio queda guardado **30 días** y después se borra,
  - **hasta 8 familiares** en la app (por ejemplo: cuatro abuelos, dos papás, dos tíos),
  - un **color y una melodía** para cada familiar, para que el niño sepa quién le habla.
- Un solo plan cubre a toda la familia: no se cobra por persona.
- **IVA y envío no están definidos** (el usuario: todavía no se puede vender, no hay prototipo). La página no los menciona en el detalle, pero lleva una nota breve y visible en la sección de precio: «Precios de referencia. WoKiToKi aún no está a la venta.»

### 4.3 Secciones (aprobadas sobre el mockup)

En orden, alternando franjas crema y verde como la landing:

1. **Precio** — título «Así de simple». Dos tarjetas unidas por un «+»:
   - «Paso 1 · pago único»: $350.000, con el primer mes incluido.
   - «Paso 2 · desde el segundo mes»: $30.000 al mes, cancela cuando quieras.
   - Debajo, el aviso de que sin suscripción la caja no funciona.
2. **Qué incluye el plan familiar** — cuatro tarjetas: audios ilimitados, guardados 30 días, hasta 8 familiares, color y melodía.
3. **Qué trae la caja** — ilustración de la caja de la landing y una lista:
   - la caja con el botón rojo y el verde,
   - la luz de colores y el parlante con volumen limitado,
   - el cable USB,
   - el código QR para instalar la app,
   - una guía rápida de configuración.
4. **Cómo funciona el pago** — línea de tiempo en cuatro pasos: compras la caja → mes 1 incluido → desde el mes 2, $30.000 automático → cancelas cuando quieras.
5. **En perspectiva** — «$1.000 al día para toda la familia» (30.000 / 30).
6. **Preguntas sobre el precio**:
   - ¿Qué pasa si cancelo? (la caja deja de enviar y recibir mensajes),
   - ¿Puedo cambiar a los familiares? (quien administra el grupo los agrega o quita desde la app, hasta 8 a la vez),
   - ¿Qué pasa con los audios después de 30 días? (se borran),
   - ¿Cada familiar paga aparte? (no),
   - ¿Necesita internet? (sí, el WiFi de la casa).
7. **Cierre** — «¿Lo quieres para tu familia?», con «Aún no está a la venta» y un botón «Sé de las primeras familias» que lleva al registro de la landing (`../#registro`).

Referencia visual: el mockup aprobado está en `.superpowers/brainstorm/19833-1793222768/content/pricing-full.html`, que no está versionado. La página real usa los componentes y tokens existentes, no el CSS del mockup.

### 4.4 Estilo

- Reutilizar `styles/tokens.css` y `styles/main.css`: franjas (`band--cream`, `band--dark`, `band--forest`), títulos con resaltado en pastilla (`hl hl--*`), tarjetas, botones (`btn btn--dark`, etc.), garabatos (`assets/doodles/`) y la misma navegación y pie.
- Los estilos nuevos van en un archivo propio (`styles/pricing.css`), siguiendo el patrón de `styles/legal.css`.
- Debe verse bien en un celular (390 px) y en escritorio, sin scroll horizontal. Contrastes accesibles.
- Favicon y `theme-color` iguales a las demás páginas.
- Los precios se escriben con punto de miles: «$350.000», «$30.000».

## 5. Restricciones

- Es un sitio estático en GitHub Pages: HTML, CSS y JS sin herramienta de build.
- Al tocar archivos CSS o JS ya enlazados, se sube su `?v=` para que no queden en caché.
- Los tests existentes (`node --test landing/tests/*.test.mjs`) deben seguir pasando.
- El texto visible va en español; código, nombres de clases y comentarios en inglés, como el resto del proyecto.

## 6. Decisiones tomadas por el asistente (revisar)

- El botón a `/pricing` va en el **pie de página** como pastilla pequeña «Precios».
- `/pricing` lleva `noindex`.
- La ruta es `landing/pricing/index.html` (dirección `/pricing/`) y no `pricing.html`.
- El botón de cierre de `/pricing` lleva al registro de la landing.
- La nota «Precios de referencia. WoKiToKi aún no está a la venta.» bajo las tarjetas de precio, para no presentar en público un precio final que todavía no existe.
- La demostración en la feria se hace **con conexión a internet**, sobre el sitio publicado en GitHub Pages. No se preparan versiones sin conexión; si las fuentes web no cargan, el navegador usa las fuentes de respaldo que ya definen los tokens.
- Además del código, se actualiza `docs/producto/2026-10-28-canal-familiar-y-monetizacion.md` para dejar la monetización como **decidida** con este modelo: primer mes incluido, 30.000 COP al mes y hasta 8 familiares.

## 7. Queda a criterio del constructor

- La redacción exacta de cada texto reemplazado, siguiendo el tono cálido y simple de la landing.
- El ícono del paso de «Cómo funciona» que reemplaza a «Nada que instalar».
- La distribución exacta de la página de precios dentro de cada sección, respetando el orden y el contenido de §4.3.
