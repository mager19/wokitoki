# WoKiToKi — Canal familiar y monetización

Fecha: 2026-10-28
Estado: canal decidido; monetización abierta

## 1. Contexto

Hoy la prueba de concepto supone que los familiares reciben y responden las notas de voz de la caja por WhatsApp (WhatsApp Business API). Eso ata el producto a Meta: precios por mensaje, reglas de la plataforma que cambian con el tiempo y ningún control sobre la experiencia del lado de la familia.

El público también se amplió el 2026-10-28. El foco principal siguen siendo los niños de 3 a 7 años, y los adultos mayores son ahora un público secundario (ver la pestaña «Adultos mayores» de la landing).

## 2. Decisión: una app familiar propia reemplaza a WhatsApp

Los familiares instalan una app propia, deliberadamente mínima. Su pantalla principal es el grupo familiar con dos acciones: **grabar y enviar** una nota de voz, y **escuchar** los mensajes de la caja.

Por qué:
- Elimina la dependencia de los precios y los cambios de política de Meta.
- El costo marginal por usuario baja casi a cero: las notificaciones push son gratis y guardar audios cortos es barato.
- El equipo controla la experiencia completa; por ejemplo, la melodía y el color de cada familiar también pueden verse en la app.

### 2.1 Roles

- **Administrador del grupo**: el papá o la mamá que configura la caja. Las funciones de administración viven **dentro de la misma app**, no en un panel web aparte. El administrador puede:
  - invitar familiares (código QR o código corto),
  - quitar miembros,
  - asignar la melodía y el color de cada familiar.
- **Miembro**: cualquier familiar invitado. Los miembros pueden enviar y escuchar.

### 2.2 Flujo de invitación (v1)

1. El administrador genera un QR de invitación.
2. El QR abre la página de la app en la tienda.
3. Al abrir la app por primera vez, el familiar escanea el mismo QR o escribe un código corto, y queda dentro del grupo.

El *deferred deep linking* (que la invitación sobreviva a la instalación, para que un solo escaneo haga todo) es una mejora posterior, no un requisito de la v1.

### 2.3 Riesgos conocidos

- **El permiso de notificaciones es el principal punto de falla.** Si un familiar lo rechaza, los mensajes de la caja llegan pero nunca se ven. Mitigaciones: una pantalla de bienvenida que explique por qué se necesitan las notificaciones, y la recomendación de que alguien de la familia acompañe a los abuelos en la primera configuración.
- **Fricción de instalación para los abuelos.** El flujo con QR la reduce, pero no la elimina. Pesa más en el uso con niños, donde los abuelos son quienes responden.
- **Mantenimiento continuo de la app.** Requiere actualizaciones para cada versión nueva de iOS y Android, revisiones de las tiendas (Apple es estricta con las apps relacionadas con niños) y una cuenta de desarrollador (Apple: 99 USD al año).

### 2.4 Esfuerzo aproximado

Una primera versión (MVP) con una sola persona toma unas 6 a 10 semanas, con una única base de código para iOS y Android (React Native/Expo o Flutter). Alcance:
- registro con el número de teléfono (código por SMS),
- grupo familiar e invitaciones,
- grabación y reproducción,
- almacenamiento de audios (Supabase),
- notificaciones push,
- publicación en las tiendas.

### 2.5 Nota de arquitectura

En el servidor, el canal de mensajería queda detrás de una interfaz, para que la caja no sepa por dónde llegan sus mensajes a la familia. Si un mercado o un aliado lo exige, más adelante se puede agregar un adaptador de WhatsApp sin reescribir el núcleo.

## 3. Monetización (abierta)

### 3.1 Propuesta en discusión

Vender un pack inicial con la caja y **3 usuarios**, y cobrar una **mensualidad por cada usuario extra**.

### 3.2 Objeciones planteadas

- **Penaliza el valor central del producto.** WoKiToKi vale más mientras más familiares respondan. Cobrar por persona empuja a las familias a quedarse en tres.
- **No refleja los costos.** Sin Meta, un usuario extra cuesta casi nada. Los costos reales son el hardware, los servidores y el mantenimiento de la app.
- **Ingreso recurrente débil.** Si solo pagan mensualidad las familias con más de tres usuarios, la mayoría no paga nada después de la compra. Servidores, soporte y actualizaciones de la app quedan sin financiar.

### 3.3 Alternativa recomendada

- **Pack inicial**: la caja más **3 a 6 meses de servicio** incluidos.
- **Después, una suscripción familiar plana y baja**, con **muchos familiares incluidos** (por ejemplo, hasta 8).
- **Ventas adicionales por cajas o funciones, no por personas**, por ejemplo:
  - una segunda caja (un hermano, o la casa de los abuelos),
  - historial permanente de mensajes de voz.

### 3.4 Canal a explorar para adultos mayores (B2B2C)

Instituciones que compran o subsidian cajas en volumen, lo que puede dar más margen y menos cancelaciones que la venta directa a familias. Posibles compradores:
- hogares geriátricos y centros día,
- cajas de compensación familiar,
- aseguradoras y planes de medicina prepagada,
- programas municipales contra la soledad.

### 3.5 Siguiente paso

Antes de fijar precios, modelar el costo por familia al mes (amortización del hardware, servidores, almacenamiento, tiendas de aplicaciones). Después, hacer una prueba de precio con los leads que capta la landing.

## 4. Impacto en los materiales actuales

La landing es una demostración simple y puede cambiar en cualquier momento. Cuando la app sea el canal, habrá que actualizar:
- la respuesta de la pregunta frecuente «¿La familia necesita instalar algo?»,
- todos los mensajes de «responde desde su WhatsApp», en la portada, las tarjetas de familia y «Cómo funciona»,
- la política de privacidad (encargados del tratamiento, datos de la app),
- el folleto y el video demo, que muestran WhatsApp.
