# Brief para brochure — Walkie

> Documento de insumo para quien redacte y diseñe un brochure explicativo y de presentación de **Walkie**.
> Es autocontenido: no hace falta acceso al repositorio del proyecto.
>
> **Fecha de corte:** 20 de octubre de 2026.
> **Nombre:** "Walkie" es un **nombre provisional** (decisión abierta D-01). Usarlo, pero sin presentarlo como marca registrada ni definitiva.
> **Idioma y mercado:** español neutro; mercado inicial **Colombia**.
>
> Las referencias entre paréntesis (RF-xx, RNF-xx, D-xx, DH-xx) son identificadores internos de requisitos y decisiones. Sirven para trazabilidad; **no deben aparecer en el brochure final**.

### Convención de estado usada en este documento

| Etiqueta | Significado |
|---|---|
| **Implementado** | Existe en el software y tiene pruebas automatizadas o funciona en el simulador. |
| **Validado** | Además, se probó de punta a punta con WhatsApp real. |
| **Diseñado** | Está especificado en la documentación, pero no construido. |
| **Pendiente** | Decisión abierta o trabajo no iniciado. |

---

## 1. Resumen

**En una frase:** Walkie es un walkie-talkie de voz para niños de 3 a 7 años que todavía no leen, conectado al WhatsApp de su familia.

**Pitch en tres líneas:**

1. Una caja sin pantalla, con una luz y dos botones: el rojo para hablar, el verde para escuchar.
2. Lo que el niño dice llega como nota de voz al WhatsApp de su familia; lo que la familia responde suena en la caja.
3. Sin pantallas, sin texto, sin desconocidos y sin instalar nada: la familia usa el WhatsApp que ya tiene.

---

## 2. El problema

- Un niño pequeño que quiere hablar con su mamá, su papá o sus abuelos **no tiene forma de hacerlo solo**. Depende de que un adulto le preste un teléfono, lo desbloquee, abra una aplicación y elija el contacto correcto.
- Las herramientas que existen (teléfonos, tabletas, aplicaciones de mensajería) **están hechas para quien sabe leer**: listas de contactos, menús, texto, notificaciones.
- Darle una pantalla a un niño de 3 a 7 años para que se comunique trae además lo que los padres justamente quieren evitar: exposición a pantallas, contenidos, *feeds* y contacto con desconocidos.
- El resultado es que el niño queda sin una voz propia hacia su familia extendida, y los abuelos o tíos que viven lejos dependen de que un adulto "haga de puente".

---

## 3. La idea / la solución

Walkie le da al niño **un canal de voz propio** hacia su familia, con una interfaz que puede usar sin saber leer:

- **Un aparato con dos botones** —uno para hablar, otro para escuchar— y una luz. Nada más (PRD §1).
- **Del otro lado, WhatsApp.** La familia recibe los mensajes del niño como notas de voz normales y responde con notas de voz normales. No instala nada, no crea cuentas (RF-21, RF-31).
- **Mensajes asíncronos, como un walkie-talkie con buzón:** no son llamadas en vivo; los mensajes quedan en espera hasta que el niño los escucha (PRD §3.1).
- **Grupal por diseño:** el niño le habla a toda la familia a la vez; cualquiera puede responderle (PRD §3.1, RF-34).

Por qué WhatsApp y no una aplicación propia: el valor del producto crece con la cantidad de familiares del otro lado. Los abuelos no van a instalar una aplicación para escuchar audios de un nieto, pero sí usan WhatsApp (PRD §2.2).

---

## 4. Para quién es

| Rol | Quién es | Qué necesita | Con qué lo usa |
|---|---|---|---|
| **Niño** | 3 a 7 años, pre-lector o lector inicial | Mandar y recibir voz sin ayuda de un adulto | La caja (hoy, un simulador web) |
| **Cuidador principal** | Mamá o papá. **Es quien compra** | Que funcione sin configurar nada | Su WhatsApp |
| **Círculo cercano** | Abuelos, tíos, padrinos | Sumarse en segundos, sin instalar nada | Su WhatsApp |

**Por qué el rango es de 3 a 7 años** (decisión cerrada, PRD §2.1): la premisa es que el niño no puede comunicarse solo porque no lee ni escribe. Alrededor de los 8 años esa premisa deja de cumplirse: el niño ya lee, maneja un teléfono y una caja de dos botones le resulta infantil.

**Dentro del rango hay dos perfiles** de ajuste, porque un niño de 3 años no sostiene un botón igual que uno de 7 (PRD §2.1):

- **Perfil "pequeño"** (3–4 años).
- **Perfil "niño"** (5–7 años).

Los valores de cada perfil están en la sección 5.

**Comprador:** padres en Colombia, mercado inicial. El modelo de negocio (precio de la caja, suscripción) **no está definido** (D-05).

---

## 5. Cómo funciona

### 5.1 La experiencia del niño

La caja tiene **tres elementos**: un botón rojo, un botón verde y una luz.

#### Hablar — botón rojo (mantener apretado)

1. El niño **aprieta y mantiene** el botón rojo. Suena un *squelch* (el "kssht" de apertura de una radio) y la luz se pone **roja fija**: está grabando (RF-01, RF-02).
2. Habla.
3. **Suelta** el botón. Suena el *roger beep* (el "bip" clásico de fin de transmisión de radio) y la luz pasa a **ámbar pulsante**: enviando (RF-02).
4. Si todo salió bien: **dos notas ascendentes suaves** y un **destello verde**. Si algo falló: un **zumbido grave descendente** y un **destello rojo** (RF-07).

Detalles de diseño que protegen al niño de la frustración:

- **Si se le resbala el dedo o suelta antes de tiempo, el mensaje se envía igual.** Perder un audio es peor que mandar uno cortado (RF-05).
- **Toques accidentales:** un toque demasiado breve no se envía; suena un "clic" seco y suave, sin el sonido de radio (RF-03).
- **Corte automático:** si mantiene el botón demasiado tiempo, la grabación se corta sola con el *roger beep* y se envía lo grabado (RF-04).
- **Solo graba mientras el botón está apretado.** No hay escucha pasiva ni palabra de activación (RNF-03).

Valores actuales por perfil (**sin calibrar con un niño real**, D-02):

| Perfil | Toque mínimo para que cuente | Duración máxima del mensaje | Repetir con doble toque |
|---|---|---|---|
| Pequeño (3–4 años) | 300 ms | 15 s | **Desactivado** |
| Niño (5–7 años) | 400 ms | 30 s | Activado |

#### Saber que llegó algo — la luz

- Cuando llega un mensaje nuevo, suena un *squelch* breve con un tono, y la luz **"respira"** (pulso lento) **en el color del familiar** cuyo mensaje espera (RF-14).
- Cada familiar tiene **su propio color** (RF-12).
- En la caja física está diseñado un **anillo de 8 luces**: un punto encendido por cada mensaje pendiente, cada uno en el color de quien lo mandó. Así el niño ve de un vistazo **cuántos** mensajes tiene y **de quién** son (RF-19, HARDWARE §9.1). *Estado: diseñado. En el simulador actual la luz muestra solo el color del mensaje más antiguo pendiente, no la cantidad.*

#### Escuchar — botón verde (una pulsación = un mensaje)

1. El niño aprieta el verde. Suena el **jingle** del familiar —una melodía de **tres notas** propia de cada persona— y la luz se pone **fija en su color** (RF-11, RF-12).
2. Se reproduce la **voz** del familiar.
3. Si quedan más mensajes, suena un **tono corto de "hay más"** (dos notas suaves ascendentes): una invitación a apretar de nuevo (RF-17).
4. Si no hay nada, suena un *squelch* corto, **y nada más** (RF-13).

Reglas de la cola de escucha:

- **Orden de llegada (FIFO):** cada pulsación reproduce el mensaje sin escuchar **más antiguo**. No se elige; sin pantalla no hay cómo elegir (RF-10). Se descartó repartir turnos por persona porque, si alguien contó algo en tres partes, escucharlas salteadas no se entiende.
- **Un mensaje cuenta como escuchado solo si se reprodujo completo** (RF-15). Si se interrumpe, vuelve a sonar la próxima vez.
- **Jingle agrupado:** si llegan varios mensajes seguidos de la misma persona, el jingle suena una sola vez; repetirlo tres veces en diez segundos deja de ser identidad y pasa a ser ruido (RF-18). Si pasa más de un minuto, el jingle vuelve a sonar.
- **Doble pulsación del verde: repite el último mensaje ya escuchado** (RF-16). Repetir no consume la cola ni hace perder mensajes nuevos.
- **No hay historial navegable, por diseño** (decisión D-06): recorrer mensajes viejos sin pantalla y con dos botones no se puede diseñar bien. **El historial completo vive del lado de los adultos, en WhatsApp.**

#### La identidad sonora de cada familiar

Se asignan automáticamente, en orden de llegada (RF-22, ARCHITECTURE §9):

| # | Jingle (tres notas) | Color |
|---|---|---|
| 1 | do-mi-sol (sube) | rosa |
| 2 | sol-mi-do (baja) | azul |
| 3 | do-do-sol | verde |
| 4 | mi-sol-mi | naranja |
| 5 | sol-do-mi | violeta |
| 6 | mi-do-sol | amarillo |

El **jingle es el canal principal** de identidad y el color es el refuerzo. Tres notas es lo más corto que sigue siendo distinguible para un niño pequeño. El tope de producto es de **8 familiares** por niño (RF-24); hoy hay 6 identidades definidas y se agregarían dos más si hace falta.

**Todos los sonidos se sintetizan** (se generan en el momento, sin archivos de audio grabados). Esto vale tanto para el simulador como para la caja física.

#### Resumen sensorial (tabla de referencia para diseño)

| Momento | Sonido | Luz |
|---|---|---|
| Nada pendiente | — | apagada |
| Hay mensajes sin escuchar | aviso breve al llegar | pulso lento en el color de quien espera |
| Aprieta rojo | *squelch* de apertura | roja fija |
| Suelta rojo | *roger beep* | ámbar pulsante |
| Enviado | dos notas ascendentes | destello verde |
| Falló | zumbido descendente | destello rojo |
| Toque demasiado corto | clic seco | — |
| Aprieta verde con mensajes | jingle del familiar → voz | fija en el color del familiar |
| Quedan más | tono corto "hay más" | — |
| Aprieta verde sin mensajes | *squelch* corto | — |

### 5.2 La experiencia de la familia (WhatsApp)

- Los mensajes del niño llegan como **notas de voz nativas de WhatsApp** —con su forma de onda y duración—, no como archivos adjuntos que haya que descargar (RF-06). *Validado.*
- Para responder, el familiar **graba una nota de voz normal**. Sin comandos ni sintaxis (RF-31). *Validado.*
- **Texto, stickers y fotos se ignoran** en silencio: al niño solo le llega voz (RF-33). *Implementado.*
- **El historial queda en WhatsApp**, del lado de los adultos.
- **Regla de las 24 horas de WhatsApp:** WhatsApp solo permite enviar audios libremente a quien escribió en las últimas 24 horas. Si un familiar no ha escrito en ese lapso, recibe primero un **aviso** ("tienes un mensaje"); **el audio le llega apenas responde**. El audio nunca se pierde: queda esperando. El aviso se envía como máximo una vez cada 4 horas por persona, para no saturar (RF-32, ARCHITECTURE §11.2). *Implementado.*
- **Cómo se suma un familiar hoy (prueba de concepto):** se registra manualmente su número en la lista autorizada y en el panel de Meta, y el familiar escribe cualquier mensaje al número de Walkie. Al hacerlo se le asignan jingle y color.
- **Cómo se sumará en el producto (diseñado, no implementado):** escaneando un **código QR impreso en la caja**, que abre WhatsApp con un mensaje ya escrito; máximo dos toques, sin aplicación, cuenta ni contraseña (RF-20, RF-21).

---

## 6. Recorrido de un mensaje de punta a punta

### 6.1 En lenguaje simple

1. **El niño aprieta el rojo y habla.** Oye el sonido de radio y ve la luz roja.
2. **Suelta.** Oye el *roger beep*. La caja manda su voz a un servidor de Walkie.
3. **El servidor convierte la grabación** al formato de nota de voz de WhatsApp y la envía a **cada familiar** de la lista.
4. **La familia ve en WhatsApp una nota de voz del niño** y la escucha como cualquier otra.
5. **La abuela responde** con una nota de voz.
6. **La caja se entera:** suena un aviso breve y la luz empieza a "respirar" en el color de la abuela.
7. **El niño aprieta el verde.** Suena el jingle de la abuela (sus tres notas) y luego su voz.
8. **Si hay más mensajes**, suena el tono de "hay más". Si no, silencio.

### 6.2 Versión técnica breve

```
Niño (caja / simulador)          Servidor Walkie                       WhatsApp (Meta)
───────────────────────          ───────────────                       ───────────────
mantiene rojo → graba
suelta → envía audio  ──HTTP──▶  guarda y responde enseguida
                                 cola de envíos (reintentos)
                                 convierte a ogg/opus (ffmpeg)
                                 sube el audio UNA vez ─────────────▶  Cloud API oficial
                                 lo reparte a cada familiar 1:1  ───▶  nota de voz a cada uno
                                   (si la ventana de 24 h está
                                    cerrada: aviso por plantilla y
                                    el audio sale al responder)

                                 webhook ◀────────────────────────────  familiar responde con voz
                                 filtra: ¿número autorizado? ¿es voz?
                                 descarta duplicados
                                 convierte a m4a/AAC
                                 cola de "no escuchados"
luz ◀──── aviso en tiempo real ─  (color de quien espera)
verde → pide el siguiente ─────▶  devuelve: color, jingle, audio,
                                  cuántos quedan, si suena jingle
reproduce completo → "escuchado"▶ marca como escuchado
```

Puntos clave:

- **La caja nunca habla con WhatsApp.** Solo conoce la API del servidor Walkie. Eso permite cambiar de proveedor de mensajería sin tocar la caja.
- **La caja es un "terminal tonto":** todas las decisiones (qué mensaje sigue, si suena el jingle, cuántos quedan) las toma el servidor.
- **El niño nunca espera a la red:** el servidor acepta el audio de inmediato y lo envía en segundo plano, con reintentos si no hay conexión (RF-08).

---

## 7. Cómo se protege al niño (seguridad y privacidad)

Esta sección debe comunicarse con precisión. Se indica el estado de cada medida.

| Medida | Qué significa | Estado |
|---|---|---|
| **Sin pantalla, sin navegador, sin *feed*** | El niño no tiene acceso a contenidos, publicidad, redes ni búsquedas. Solo voz de su familia. | Principio de diseño; el simulador lo cumple |
| **Lista blanca de familiares** | Solo los números autorizados pueden hablarle al niño. Los mensajes de cualquier otro número se ignoran. | **Implementado** en la conexión oficial (Cloud API). **Ojo:** si la lista se deja vacía, el sistema acepta a cualquiera que escriba; la documentación lo admite solo con el número de prueba de Meta, que nadie más conoce. |
| **Solo voz** | Texto, stickers, fotos y videos que lleguen por WhatsApp se ignoran (RF-33). | **Implementado** |
| **Micrófono solo con el botón apretado** | No hay escucha pasiva ni palabra de activación (RNF-03). No es un monitor de bebé ni un dispositivo de vigilancia. | **Implementado** en el simulador. En la caja: **diseñado** que el micrófono se apague al soltar; cortarle la alimentación físicamente con un componente dedicado (verificable con un multímetro) es una **decisión abierta** (DH-02). |
| **Nadie habla en privado con el niño (RF-34)** | Toda nota de voz que un adulto le envía al niño se **retransmite al resto de la familia**. El grupo es la salvaguarda, no una comodidad. | **Diseñado y documentado; implementación pendiente.** Hoy, con el reparto 1:1, la respuesta de un familiar le llega **solo al niño**. |
| **Los audios del niño no se registran** | La voz de un menor nunca se escribe en los registros del sistema; solo metadatos (duración, tamaño). | **Implementado** |
| **Números enmascarados** | En los registros, los números de teléfono descartados aparecen solo con sus **últimos 4 dígitos**. | **Implementado** |
| **Datos fuera del control de versiones** | La carpeta con audios y base de datos está excluida del repositorio de código. | **Implementado** |
| **Borrado automático de audios** | Los audios se borrarían del servidor tras un plazo (7 o 30 días) desde que se escuchan (RNF-04). | **Pendiente:** el plazo no está definido (D-04) y el borrado no está implementado. |
| **Cifrado en reposo y consentimiento explícito** | Mitigaciones previstas para datos de voz de menores. | **Pendiente** |
| **Revisión legal (Ley 1581 de 2012, habeas data, protección reforzada de menores)** | Requerida antes de cualquier uso fuera de la familia del propio equipo. | **Pendiente** |
| **Sacar a alguien del grupo** | El cuidador principal puede quitar a un familiar (RF-23). | **Diseñado (prioridad alta); no implementado** |
| **Volumen limitado por hardware** | Para no dañar la audición del niño (RNF-07). El amplificador elegido incluye limitador. | **Diseñado** |

**Sobre RF-34, dos límites que hay que respetar al comunicarlo** (PRD §4.4):

- **Da transparencia, no control.** Un adulto decidido podría contactar al niño por fuera de Walkie. Lo que se garantiza es que **dentro de Walkie** no hay canales privados.
- Las retransmisiones entre adultos **no** entran a la cola del niño.
- En la fase con **grupos reales de WhatsApp** (Fase 2) esta salvaguarda pasa a ser nativa: un grupo impide por diseño que alguien le hable al niño sin que los demás lo vean.

**Robustez y fallos:** los problemas de red nunca se le explican al niño; el mensaje queda en cola y se reenvía solo (RF-08, ARCHITECTURE §10). Los mensajes duplicados que pueda entregar WhatsApp se descartan para que el niño no escuche el mismo audio dos veces.

---

## 8. Beneficios

### Para el niño

- **Autonomía:** se comunica con su familia sin depender de que un adulto le preste un teléfono.
- **Sin pantallas:** sonido, luz y tacto. Nada que leer, nada que desplazar.
- **Sin desconocidos ni *feed*:** solo su familia puede hablarle.
- **Entiende quién le habla sin leer:** cada familiar tiene su melodía y su color.
- **A prueba de errores:** si suelta antes de tiempo, el mensaje se envía igual; los toques accidentales no cuentan; repetir es inofensivo.
- **Juego de radio:** los sonidos de walkie-talkie hacen de la comunicación algo lúdico.

### Para la familia

- **Nada que instalar:** usan el WhatsApp que ya tienen.
- **Los abuelos y tíos lejanos también participan,** con la herramienta que ya conocen.
- **Notas de voz normales** en ambas direcciones.
- **Transparencia:** el diseño apunta a que todos escuchen todo (RF-34, pendiente de implementar).
- **El historial queda en WhatsApp,** del lado de los adultos.
- **Tranquilidad sobre la privacidad:** el micrófono solo graba con el botón apretado.

---

## 9. Diseño y principios no negociables

Tres reglas salen de decisiones de producto ya cerradas:

1. **Sin pantalla — es una decisión, no un recorte de costos.** Es a la vez argumento de venta para los padres y restricción de diseño (PRD §1.1). El niño no lee, así que ninguna información puede ser textual; no navega, así que no hay listas, menús ni selección de destinatario.
2. **Sin texto en la interfaz del niño.** Toda la información es sonido, luz y tacto. Incluso el simulador web no tiene una sola palabra visible: si algo necesita explicarse con palabras, está mal diseñado para este producto.
3. **Dos botones, y nada más.** Rojo = hablar (mantener). Verde = escuchar (una pulsación por mensaje; doble pulsación para repetir).

Principios derivados:

- **Botones grandes** (tipo *arcade*, 30 mm) para manos de 3 a 7 años.
- **Errores perdonados:** se envía lo grabado aunque el niño suelte antes de tiempo.
- **El aparato le "dice" al niño qué hacer** mediante sonido (tono de "hay más") en lugar de que aprenda por frustración.
- **Sin elegir destinatario:** el niño le habla a toda la familia.
- **Funciona en casa:** la caja se conecta por WiFi; el aparato vive en un lugar conocido, no anda por la calle (HARDWARE §6).

---

## 10. Tecnología por detrás

### 10.1 Servidor (*backend*)

- **Node.js + TypeScript**, base de datos SQLite, conversión de audio con **ffmpeg** (incluido como dependencia, no requiere instalación aparte).
- **Una sola interfaz para WhatsApp (`MessageTransport`).** Ningún otro componente sabe qué tecnología de WhatsApp se está usando. Cada fase del proyecto es **un adaptador nuevo, no una reescritura**. Cuando se implementó la conexión oficial con Meta, el simulador, los sonidos, la luz, la API y la cola **no cambiaron**.
- **Cola de envíos con reintentos:** si no hay red, el mensaje espera y se reenvía solo.
- **Cola de escucha:** orden de llegada, marcado de "escuchado" solo al terminar, agrupación de jingles, cuenta de pendientes.
- **Avisos en tiempo real** a la caja/simulador cuando llega un mensaje.

### 10.2 Conexión con WhatsApp

- **WhatsApp Cloud API oficial de Meta.** Es el camino de producción. Hoy funciona con el **número de prueba gratuito** que Meta ofrece a desarrolladores: sin riesgo de bloqueo del número.
- **Reparto 1:1 (*fan-out*):** sin acceso a grupos reales, el servidor sube el audio **una sola vez** y lo envía a cada familiar en su chat individual.
- **Ventana de 24 horas** gestionada por familiar: si está cerrada, se envía un aviso y el audio espera.
- **Baileys** (cliente no oficial de WhatsApp) existe en el código **solo para pruebas internas** del equipo con su propia familia. **Nunca formará parte de un producto vendido**: hacerlo convertiría a la empresa en distribuidora de un cliente no oficial (PRD §6.3).

### 10.3 Por qué funciona el audio (la parte con más trampas)

- **Hacia WhatsApp:** los navegadores graban en formatos que WhatsApp no acepta como nota de voz. El servidor convierte a **ogg/opus mono**, el único formato que WhatsApp muestra como **nota de voz nativa** (con onda y duración) y no como archivo adjunto.
- **Hacia el niño:** WhatsApp entrega ogg/opus, que algunos dispositivos (por ejemplo iPhone/Safari) no reproducen. El servidor convierte a **m4a/AAC**, que reproduce cualquier navegador.
- **Se corrigió un error real:** las notas de voz llegaban a WhatsApp pero no se podían reproducir ("este audio ya no está disponible"); la causa era un desfase de tiempo en la grabación del navegador, ya resuelto.

### 10.4 Simulador y página de demostración

- **Simulador web de la caja:** dos botones y una luz en pantalla, mismos estados, mismos sonidos y misma API que la caja física. Lo que se valida ahí vale para la caja.
- **Página de demostración** para grabar videos: el simulador con un pie explicativo **fuera** de la caja (el simulador en sí sigue sin texto).

### 10.5 La caja física — *diseñada, no construida*

| Componente | Modelo | Para qué |
|---|---|---|
| Placa | ESP32-S3 (variante con 16 MB de memoria flash y 8 MB de PSRAM) | Cerebro, WiFi, dos canales de audio digital |
| Micrófono | INMP441 (digital I2S) | Grabar sin ruido analógico |
| Amplificador | MAX98357A (clase D, con limitador) | Salida de audio con volumen limitado |
| Parlante | 4 Ω, 3 W, 40–50 mm | Que se oiga sin audífonos |
| Luz | Anillo de 8 LED de color (WS2812B) | Colores de los familiares y cola visible |
| Botones | 2 *arcade* de 30 mm, rojo y verde | Tamaño para manos pequeñas |
| Energía (prototipo) | USB | La batería (LiPo 2000 mAh) se evaluará al medir autonomía |

**Por qué ESP32-S3** (y no una mini computadora tipo Raspberry Pi):

- **Despierta en menos de 100 ms:** el niño aprieta y ya está grabando. Una mini computadora tarda 20–30 segundos en arrancar.
- **Consumo dormido de microamperios:** necesario para la meta de al menos un día de autonomía (RNF-02).
- **Resiste desconexiones bruscas:** un niño lo va a desenchufar de un tirón; los sistemas con tarjeta SD se corrompen, este no.
- **Memoria suficiente** para guardar 30 segundos de audio.

**Cómo se configura el WiFi sin pantalla (diseñado):** la caja crea su propia red; un adulto se conecta desde el teléfono y aparece una página para elegir la red de la casa y su contraseña (como el WiFi de un hotel). Para reconfigurar: los dos botones apretados 5 segundos, algo que un niño no hace por accidente.

**Por qué WiFi y no SIM celular:** el celular costaría entre 2 y 6 veces el techo de costo operativo por familia. Se acepta que **el walkie funciona en casa**.

**Plan de construcción por etapas** (cada una verificable sola): 0) servidor entrega audio sin comprimir para la caja → 1) WiFi y configuración → 2) botones y luz → 3) grabar y enviar → 4) recibir y reproducir → 5) sueño y batería → 6) calibración con el niño.

**Decisiones de hardware abiertas:** SIM celular en alguna versión (DH-01); corte físico del micrófono (DH-02); cada cuánto consulta mensajes nuevos (DH-03); batería o USB permanente (DH-04); material y forma de la caja (DH-05); anillo de 8 LED o una sola luz (DH-06).

### 10.6 Economía de la mensajería

- Todo lo que ocurre dentro de la ventana de 24 h de WhatsApp es **gratis**. Solo se paga el aviso que reabre una ventana cerrada.
- Colombia tiene la **tarifa de plantillas de utilidad más baja del mundo** según el PRD (US$0.0008 por mensaje). Peor caso estimado: ~US$0.07 por familia al mes. Meta: menos de US$0.50 por familia al mes (RNF-05).
- **Riesgo de costo abierto (D-09):** la retransmisión de RF-34 multiplica los mensajes salientes (con 8 familiares, cada respuesta genera 7 envíos). No está medido.

---

## 11. Hoja de ruta y estado actual

### Fases

| Fase | Objetivo | Conexión WhatsApp | Estado |
|---|---|---|---|
| **0 — Prueba de concepto** | Responder si la idea sirve, antes de invertir en trámites o hardware | Cloud API oficial con número de prueba de Meta (Baileys solo para pruebas internas) | **En curso** |
| **1 — Piloto** | 10–50 familias reales | Cloud API con número propio y reparto 1:1; verificación de empresa ante Meta; alta por QR; plantillas aprobadas; primeros prototipos de hardware | Pendiente |
| **2 — Escala** | Producción | **Groups API** de WhatsApp (grupos reales; requiere la acreditación OBA de Meta); producción de hardware | Pendiente |

La Groups API es además **la solución nativa a RF-34**: con un grupo real, todos escuchan todo sin retransmisiones, y desaparecen el costo por mensaje y la fricción de la ventana de 24 horas.

### Qué está hecho (al 20 de octubre de 2026)

- **Validado de punta a punta con WhatsApp real:** el niño habla en el simulador → la familia recibe una nota de voz reproducible → la familia responde → el niño la escucha con jingle y color.
- Simulador web de la caja, sin texto, con todos los sonidos y estados de luz.
- Cola de escucha completa: orden de llegada, jingle agrupado, tono de "hay más", repetición con doble toque, marcado de escuchado solo al terminar.
- Conexión oficial Cloud API con reparto 1:1, ventana de 24 horas, avisos y lista blanca.
- Conversión de audio en ambos sentidos, incluida compatibilidad con iPhone.
- **48 pruebas automatizadas** pasando.
- Página de demostración para grabar videos.
- Diseño completo del hardware (componentes, pines, energía, conectividad, plan por etapas).

### Qué falta

- **Probar con un niño real** y calibrar tiempos, umbrales y tamaño de botones (D-02). Ninguna métrica de éxito con niños se ha medido aún.
- **Implementar RF-34** (retransmisión a toda la familia).
- Alta por **QR** (RF-20), **sacar a un familiar** (RF-23), **borrado automático** de audios (RNF-04).
- Plantilla de aviso propia en español (hoy se usa una plantilla genérica de prueba).
- Verificación de empresa ante Meta, número propio.
- **Construir la caja** (firmware y prototipo); batería y autonomía.
- **Revisión legal** de tratamiento de datos de menores.
- Nombre definitivo (D-01) y modelo de negocio (D-05).

### Cómo se medirá el éxito de la Fase 0 (PRD §10)

- El niño manda un mensaje **sin ayuda** después de, como mucho, 3 demostraciones.
- Usa el aparato **por iniciativa propia** al menos una vez al día.
- Los familiares responden **más del 50 %** de los mensajes.
- El niño **reconoce quién le habló** por el jingle (reacciona distinto según la persona).

---

## 12. Diferenciadores frente a alternativas

> **Nota:** la documentación del proyecto **no incluye un análisis de competencia**. Lo siguiente es **razonamiento derivado de los principios documentados**, no un estudio de mercado. Conviene validarlo antes de usarlo como afirmación comparativa, y **no nombrar marcas ni productos concretos**.

| Alternativa | Limitación frente al objetivo | Qué hace distinto Walkie |
|---|---|---|
| **Reloj inteligente infantil** | Suele tener pantalla, menús y requiere aplicación propia para los padres | Sin pantalla; la familia usa WhatsApp; sin aplicación nueva |
| **Tableta o teléfono del adulto** | Pantalla, acceso a contenidos, requiere leer y navegar; depende de que un adulto lo preste | Dos botones, sin contenidos, uso autónomo |
| **WhatsApp directo** | Exige leer, desbloquear, elegir contactos; expone al niño a todo el teléfono | El niño nunca toca WhatsApp; la caja es solo voz con su familia |
| **Walkie-talkie tradicional** | Alcance corto; los dos equipos deben estar cerca y encendidos; no llega a los abuelos que viven lejos | Llega a cualquier familiar con WhatsApp, en cualquier lugar; los mensajes esperan si nadie está escuchando |

Diferenciadores sí respaldados por la documentación: **sin pantalla por decisión**, **identidad sonora por familiar**, **cero instalación para la familia**, **solo familiares autorizados**, **micrófono solo con botón apretado**, **diseño de transparencia grupal (RF-34)**.

---

## 13. Preguntas frecuentes

1. **¿Qué es Walkie?**
   Una caja con dos botones y una luz que permite a un niño de 3 a 7 años enviar y recibir mensajes de voz con su familia, que los recibe y responde desde WhatsApp.

2. **¿Tiene pantalla?**
   No, y es deliberado. Toda la interacción es sonido, luz y tacto.

3. **¿La familia necesita instalar algo?**
   No. Usa su WhatsApp normal: recibe notas de voz y responde con notas de voz.

4. **¿El niño necesita un número o una cuenta de WhatsApp?**
   No. El niño habla a través de la caja; el número pertenece al servicio Walkie.

5. **¿Cómo sabe el niño quién le habla si no lee?**
   Cada familiar tiene una melodía de tres notas y un color propios, que suenan y se encienden antes de su voz.

6. **¿Puede un desconocido hablarle al niño?**
   El sistema solo acepta mensajes de números autorizados por la familia; los demás se ignoran.

7. **¿Algún adulto puede hablar en privado con el niño?**
   El diseño establece que no: toda respuesta se retransmite al resto de la familia. Esta función **está documentada pero aún no implementada**; en grupos reales de WhatsApp (fase futura) será nativa.

8. **¿La caja escucha todo el tiempo?**
   No. Solo graba mientras el botón rojo está apretado. No hay escucha pasiva ni palabra de activación.

9. **¿Puede el niño escuchar mensajes viejos?**
   Puede repetir el último mensaje con una doble pulsación del botón verde (en el perfil de 5–7 años). No hay historial navegable, por diseño: el historial completo queda en el WhatsApp de los adultos.

10. **¿Qué pasa si el niño suelta el botón antes de terminar?**
    El mensaje se envía igual con lo que alcanzó a grabar.

11. **¿Y si llegan muchos mensajes a la vez?**
    Se escuchan en orden de llegada, uno por pulsación. Un tono corto le indica al niño que quedan más.

12. **¿Qué pasa si un familiar no ha usado WhatsApp en 24 horas?**
    Por reglas de WhatsApp, primero recibe un aviso; el audio del niño le llega en cuanto responde. Nada se pierde.

13. **¿Pueden llegarle fotos, stickers o textos al niño?**
    No. Solo se aceptan notas de voz; lo demás se ignora.

14. **¿Funciona fuera de casa?**
    La caja está diseñada para funcionar con el WiFi de la casa.

15. **¿Ya se puede comprar?**
    No. El proyecto está en fase de prueba de concepto; la caja física está diseñada pero no construida.

---

## 14. Mensajes clave y tono

### Mensajes clave

- **"Su propia voz, sin pantallas."**
- **"Dos botones. Toda la familia."**
- **"Rojo para hablar. Verde para escuchar."**
- **"La familia responde desde WhatsApp. Sin instalar nada."**
- **"Sabe quién le habla sin saber leer: cada abuelo, cada tía, su melodía y su color."**
- **"Solo su familia. Nadie más."**
- **"Solo escucha cuando el botón está apretado."**
- **"Del jardín a la casa de los abuelos, en una nota de voz."**

### Frases cortas reutilizables

- Sin pantalla. Sin texto. Sin desconocidos.
- Un walkie-talkie que llega a WhatsApp.
- Hecho para quienes todavía no leen.
- La abuela suena distinto que el tío.
- Si suelta antes, el mensaje sale igual.
- El historial, para los adultos; la voz, para el niño.

### Tono sugerido

- **Cálido, simple y honesto.** Escrito para padres; frases cortas.
- **Concreto antes que abstracto:** mostrar escenas (el niño aprieta el rojo, la abuela responde, suena su melodía).
- **Sin alarmismo** sobre pantallas o peligros: presentar la ausencia de pantalla como una elección positiva, no como miedo.
- **Sin promesas absolutas de seguridad:** hablar de "diseñado para", "solo números autorizados", y respetar los estados de la sección 7.
- **Visualmente:** colores de familiares (rosa, azul, verde, naranja, violeta, amarillo), botones grandes rojo y verde, luz suave que "respira", estética de radio/walkie-talkie lúdica. Recordar que el producto en sí no tiene texto: las ilustraciones de la caja no deben mostrar pantallas, palabras ni íconos de interfaz.

---

## 15. Glosario

| Término | Definición |
|---|---|
| **Jingle** | Melodía de tres notas que identifica a cada familiar. |
| ***Squelch*** | Sonido corto de ruido filtrado ("kssht") típico de las radios al abrir el canal. |
| ***Roger beep*** | Bip breve al final de una transmisión de radio; indica "terminé". |
| **Pulsar para hablar (*push-to-talk*)** | Se habla solo mientras se mantiene apretado el botón. |
| **Cola FIFO** | Primero en llegar, primero en escucharse. |
| **Nota de voz nativa** | Mensaje de voz que WhatsApp muestra con forma de onda y botón de reproducción, no como archivo adjunto. |
| **WhatsApp Cloud API** | Plataforma oficial de Meta para que empresas envíen y reciban mensajes de WhatsApp. |
| **Groups API** | Función de la plataforma oficial que permite grupos reales; requiere acreditación OBA. |
| **OBA** | *Official Business Account*: cuenta empresarial verificada por Meta. |
| **Fan-out (reparto 1:1)** | Enviar el mismo mensaje a cada familiar en su chat individual, simulando un grupo. |
| **Ventana de 24 horas** | Regla de WhatsApp: una empresa puede enviar mensajes libres solo a quien le escribió en las últimas 24 h; fuera de ese plazo, solo plantillas. |
| **Plantilla** | Mensaje preaprobado por Meta que se puede enviar fuera de la ventana de 24 h; no admite audio. |
| **Lista blanca** | Lista de números autorizados para hablar con el niño. |
| **Baileys** | Cliente no oficial de WhatsApp; usado solo en pruebas internas, nunca en el producto. |
| **ESP32-S3** | Microcontrolador de bajo consumo con WiFi; el "cerebro" de la caja. |
| **Simulador** | Versión web de la caja (dos botones y una luz en pantalla) usada para probar el producto antes del hardware. |
| **Ley 1581 de 2012** | Ley colombiana de protección de datos personales (habeas data). |
| **Prueba de concepto (PoC)** | Versión mínima para comprobar si la idea funciona. |

---

## 16. Lo que NO se debe afirmar

- **Que está a la venta** o que se puede reservar/comprar. No lo está; no hay precio ni modelo de negocio (D-05).
- **Que la caja existe físicamente** o mostrar fotos como "producto real". Está **diseñada, no construida**; no hay firmware. Usar ilustraciones o renders identificados como conceptuales.
- **Que ningún adulto puede hablar en privado con el niño** como hecho cumplido. RF-34 está **documentado pero pendiente**. Y aun implementado, garantiza transparencia **dentro de Walkie**, no control absoluto.
- **Que está probado con niños** o que "los niños lo aman". **No se ha calibrado ni probado con un niño real** (D-02); las métricas de éxito no se han medido.
- **Que tiene un día (o más) de batería.** Es un requisito, no medido; el prototipo se alimenta por USB.
- **Que cumple la Ley 1581 / habeas data** o que está "certificado". La revisión legal está **pendiente**.
- **Que los audios se borran automáticamente** a los X días. El plazo no está definido ni implementado.
- **Que los datos están cifrados.** El cifrado en reposo es una mitigación prevista, no implementada.
- **Que se suma un familiar escaneando un QR.** Diseñado, no implementado.
- **Que el micrófono está "físicamente desconectado".** El corte físico es una decisión abierta (DH-02).
- **Que funciona en cualquier lugar.** La caja está pensada para el WiFi de casa.
- **Que es un producto o asociación oficial de WhatsApp o Meta.** Usa la plataforma oficial de Meta, pero no está avalado ni asociado; no usar logotipos de WhatsApp/Meta sin revisar sus lineamientos de marca.
- **Que es un monitor de bebé, rastreador o dispositivo de localización.** Explícitamente no lo es.
- **Que permite llamadas en vivo, texto, fotos o video.** Solo voz asíncrona.
- **Que "Walkie" es el nombre definitivo.** Es provisional (D-01).
- **Cifras de costo como precio al cliente.** Las cifras de mensajería son costos operativos internos estimados, no tarifas.
- **Comparaciones nombrando marcas competidoras.** No hay análisis de competencia documentado.

---

## Notas para el autor

Discrepancias encontradas entre la documentación, el código y la información aportada por el fundador. Donde hubo conflicto, este brief siguió a la documentación o al código.

1. **Número de pruebas:** se indicó "44 pruebas automatizadas"; al 20 de octubre de 2026 el proyecto ejecuta **48 pruebas, todas aprobadas**. Se usó 48.
2. **Repetición con doble toque:** en el perfil de 3–4 años está **desactivada** en la configuración actual; solo funciona en el perfil de 5–7 años. Se reflejó así.
3. **Luz que muestra cuántos mensajes quedan (RF-19):** el simulador actual solo muestra el color del mensaje más antiguo; la cantidad por puntos está diseñada para el anillo de 8 LED de la caja física.
4. **Fase 0 y Cloud API:** el PRD describe la Fase 0 con Baileys y ubica la Cloud API 1:1 en la Fase 1; en la práctica, la prueba de concepto ya corre sobre Cloud API con el número de prueba de Meta (según el archivo de instrucciones del proyecto). La documentación de arquitectura todavía indica en su encabezado "transporte activo: Baileys", lo que está desactualizado.
5. **Lista blanca:** está implementada solo en la conexión Cloud API, y si se deja vacía acepta a cualquiera que escriba. No presentar la lista blanca como una garantía incondicional.
6. **"Enviado" no significa "escuchado":** el sonido de éxito indica que el servidor recibió el audio; la entrega a WhatsApp ocurre en segundo plano (y puede esperar por la ventana de 24 h).
7. **Número de prueba de Meta:** admite como máximo 5 destinatarios verificados, cargados a mano; suficiente para la prueba, no para el piloto.
8. **Plantilla de aviso:** la configuración por defecto usa una plantilla genérica de prueba en inglés; la plantilla propia en español está pendiente.
