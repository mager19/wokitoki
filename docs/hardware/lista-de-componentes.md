# WoKiToKi — Lista de componentes (prototipo artesanal)

Fecha: 2026-10-28
Estado: estimación preliminar, sin cotizaciones

Lista de materiales para una caja WoKiToKi armada a mano: caja impresa en 3D, módulos electrónicos sueltos y botones pulsadores. Los componentes vienen de la tabla de hardware de `docs/BRIEF-BROCHURE.md`.

> **Importante:** los precios son **rangos típicos de mercado**, no cotizaciones. Antes de comprar o fijar precios, hay que cotizarlos y llenar la columna «Precio cotizado».

## 1. Componentes por unidad

| # | Componente | Referencia | Cant. | Función | Afuera (AliExpress), USD | Colombia, USD | Precio cotizado | Proveedor |
|---|---|---|---|---|---|---|---|---|
| 1 | Placa principal | ESP32-S3 DevKitC, 16 MB flash / 8 MB PSRAM (N16R8) | 1 | Cerebro, WiFi, audio digital | 6 – 10 | 12 – 18 | | |
| 2 | Micrófono | INMP441 (digital, I2S) | 1 | Grabar sin ruido analógico | 1,5 – 3 | 4 – 6 | | |
| 3 | Amplificador | MAX98357A (clase D, I2S) | 1 | Salida de audio con volumen limitado | 1,5 – 3 | 4 – 7 | | |
| 4 | Parlante | 3 W, 4 Ω, unos 40 mm | 1 | Reproducir los mensajes | 1 – 2 | 2 – 4 | | |
| 5 | Luz | Anillo de 8 LED WS2812B | 1 | Colores de los familiares y cola de mensajes | 1 – 2 | 3 – 5 | | |
| 6 | Botón rojo | Pulsador tipo arcade, 30 mm, rojo | 1 | Hablar (mantener apretado) | 0,5 – 1,5 | 1,5 – 3 | | |
| 7 | Botón verde | Pulsador tipo arcade, 30 mm, verde | 1 | Escuchar | 0,5 – 1,5 | 1,5 – 3 | | |
| 8 | Cableado y montaje | Cables, placa perforada, conectores, tornillos | 1 juego | Unir y fijar las piezas | 2 – 3 | 3 – 5 | | |
| 9 | Caja | Impresión 3D en PLA, unos 150 – 250 g, más energía | 1 | Carcasa superior y base | 4 – 6 | 4 – 6 | | |
| 10 | Alimentación | Cargador USB 5 V con cable | 1 | Energía (el prototipo funciona por USB) | 2 – 4 | 4 – 8 | | |
| | **Total sin batería** | | | | **≈ 20 – 35** | **≈ 40 – 65** | | |

### Opcional: batería

| # | Componente | Referencia | Cant. | Función | Afuera, USD | Colombia, USD | Precio cotizado | Proveedor |
|---|---|---|---|---|---|---|---|---|
| 11 | Batería | LiPo 2000 mAh | 1 | Autonomía (meta: al menos un día) | 3 – 5 | 5 – 9 | | |
| 12 | Carga | Módulo de carga LiPo (por ejemplo TP4056) más elevador a 5 V | 1 | Cargar la batería y alimentar la placa | 2 – 3 | 3 – 5 | | |
| | **Subtotal batería** | | | | **+5 – 8** | **+8 – 14** | | |

La batería sigue siendo una decisión abierta (DH-04 en el brief): el prototipo actual se alimenta por USB.

## 2. Equivalencia en pesos

A una tasa de referencia de **4.000 COP por USD** (hay que actualizarla al cotizar):

| Escenario | USD | COP aproximado |
|---|---|---|
| Piezas compradas afuera, sin batería | 20 – 35 | 80.000 – 140.000 |
| Piezas compradas en Colombia, sin batería | 40 – 65 | 160.000 – 260.000 |

Al comprar afuera hay que sumar el envío y, según el monto, los impuestos de importación.

## 3. Costos ocultos de la producción artesanal

| Concepto | Estimación por unidad | Nota |
|---|---|---|
| Tiempo de impresión 3D | 6 – 10 h de máquina | Con una sola impresora salen 2 o 3 cajas al día |
| Armado y soldadura | 1 – 2 h de trabajo | Incluye montar los botones, el anillo de LED y el parlante |
| Firmware y prueba final | 15 – 30 min | Cargar el programa, configurar el WiFi y probar los dos botones |
| Pérdidas | 10 – 15 % adicional | Impresiones o soldaduras fallidas |
| Empaque | Por definir | Caja, instrucciones y código QR de configuración |

Si se valora el tiempo de trabajo, el costo real por caja puede **duplicar** el costo de los materiales.

## 4. Implicaciones para el precio

- En la etapa artesanal, un precio de caja «casi al costo» (por ejemplo 150.000 – 200.000 COP) **no cubre** materiales más mano de obra si se compra en Colombia.
- Las primeras unidades conviene tratarlas como **piloto**: con un precio que cubra el costo real, o subsidiadas a propósito para aprender.
- Con volumen, el costo de materiales podría bajar a **unos 12 – 20 USD** por unidad. Para eso hace falta:
  - una placa electrónica propia (PCB) en lugar de módulos sueltos,
  - una caja inyectada o impresa en lote,
  - compras al por mayor.

## 5. Pendientes

- [ ] Cotizar cada componente en tiendas colombianas y en AliExpress, y llenar «Precio cotizado» y «Proveedor».
- [ ] Pesar una caja impresa real para ajustar el costo del PLA.
- [ ] Medir los tiempos reales de impresión y de armado del primer prototipo.
- [ ] Decidir la batería (DH-04) y el corte físico del micrófono (DH-02), que pueden sumar componentes.
- [ ] Definir el empaque.

Documentos relacionados: `docs/BRIEF-BROCHURE.md` (hardware y decisiones abiertas) y `docs/producto/2026-10-28-canal-familiar-y-monetizacion.md` (modelo de negocio).
