# Final Edge — Biblioteca de Assets y Reglas de Ejecución

> Fuente única de verdad para construir el sitio. Portado fielmente del Brand Book
> entregado (`CLAUDE.md` / `README.md` del handoff). **No inventar valores.**
> Los tokens viven en código en [`assets/css/tokens.css`](assets/css/tokens.css).

---

## 0 · Los cinco no-negociables

1. **El logo es fijo.** Dos líneas. `[ A I ]` en la línea 2, con sus bordes izquierdo y
   derecho alineados al ancho de la palabra **"final"** — nunca en línea, nunca centrado,
   nunca re-espaciado, nunca re-estilizado.
2. **Los logos monocromáticos conservan el relieve 3D** y comparten **un mismo plata** para
   `>_` y `[AI]`. Usar los PNG pre-horneados — nunca un `filter` CSS para recolorear partes.
3. **Nada por debajo de 14px.** Piso duro, en todas partes.
4. **Una tipografía** (Geist Mono), **un acento** (Edge Blue `#1E80F0`), **esquinas 0px**,
   **sin sombras**, contraste fuerte (WCAG AA).
5. **Copy bilingüe ES-MX (tú, informal) / EN.** Sin emoji, sin signos de exclamación.
   Motivos `>_`, `[AI]`, `final edge` (sin punto), `[ENGINE]` / `ENGINE™` son fijos.

---

## 1 · Biblioteca de assets (`assets/img/`)

### Logotipos — `assets/img/logos/`
| Archivo | Uso | Fondo |
|---|---|---|
| `logo-finaledge.png` | **Primario** · glossy 3D (master, transparente) | Void `#0B0B0E` |
| `logo-mono-white.png` | Monocromático · wordmark carbón + símbolo plata | `#F4F4F2` (claro) |
| `logo-mono-light.png` | Monocromático · wordmark claro + símbolo plata | Edge Blue `#1E80F0` o Void |
| `logo-{strategy,intelligence,flow,readiness,systems,creative}.png` | Sub-marcas glossy (marketing) | Void |

- Estructura **fija**: Línea 1 = `>_` (prompt azul) + `final edge` (wordmark). Línea 2 = `[ A I ]` azul
  abarcando el ancho de "final".
- **Tamaños mínimos:** digital ≥160px de ancho, impresión ≥28mm. Por debajo de ~40px usar lockup
  de **texto** (`>_` + nombre + `[AI]` compacto), nunca el raster glossy.
- En el sitio: header y footer usan `logo-mono-light.png` (plata sobre Void); el hero usa el master
  glossy como poster/favicon.

### Edge-icons — `assets/img/edge-icons/`
Line-art neón, fondo transparente, **coloreado en el color de su fase** (no blanco), ~66px:
`strategy` (compás) · `intelligence` (cabeza + red neuronal) · `readiness` (batería) ·
`flow` (ondas) · `systems` (engranes) · `creative` (paleta + pincel).

### Video — `assets/video/hero.mp4`
2544×1440 (16:9), ~18s. Hero de la página principal: `autoplay muted loop playsinline`,
con scrim de legibilidad y `poster`. Se pausa fuera de viewport (ahorro de batería).

---

## 2 · Tokens de diseño (ver `tokens.css`)

**Superficies** — Void `#0E0E12` (NO negro puro) · Panel `#0B0B0E` · Card `#0A0A0C` ·
Hairline `#1A1A1E` (nav `#16161A`) · Placeholder `#34343C`.

**Texto (todo ≥4.5:1 sobre Void)** — Signal `#F4F4F2` · Secundario `#C6C6CC` ·
Muted `#A0A0A8` · Faint `#7E7E88`.

**Acento (único de UI)** — Edge Blue `#1E80F0` · active `#1668C2`.

**Colores de fase (solo marcadores / rueda ENGINE / iconos, nunca rellenos grandes ni estado)** —
Evaluación amber `#F4920C` · Capacidades cyan `#15D9D9` · Ejecución magenta `#E15CDB`.

**Estado (independiente de fase)** — error `#FF5A5A` · success `#3DD68C` · warning `#F5C24B` ·
info `#1E80F0`.

**Tipografía** — `--font-ui` = Geist Mono (lidera TODO) · `--font-read` = Geist Sans
(solo párrafos largos densos). Nunca una tercera familia.

**Escala (Geist Mono)** — Display `clamp(56px,13vw,176px)`/600/-.06em/lh.82 ·
Opener `clamp(44px,9vw,104px)`/600 azul · H2 `clamp(30px,6vw,56px)`/500/-.035em ·
Manifiesto `clamp(22px,4.4vw,38px)`/400 · Plate `clamp(40px,11vw,108px)`/600/-.05em ·
Lead 18px/lh1.6 · Body 16px (mín 14) · Label 14px UPPERCASE tracking .14–.24em (**piso duro**).

**Movimiento** — una curva `cubic-bezier(.2,.8,.2,1)`; hover 160ms · UI 280ms · enter 600ms.
Animación obligatoria única: cursor parpadeante `1.2s steps(1)`. Sin rebotes/springs/spinners.

---

## 3 · Reglas de ejecución (layout)

- **90 / 8 / 2** — ~90% Void, ~8% blanco/signal, ~2% acento.
- **Esquinas 0. Sombras ninguna.** Bordes 1px `--hairline`.
- **Grids hairline:** `display:grid; gap:1px; background:var(--hairline)` sobre cards =
  separadores de 1px. Siempre `grid-template-columns: repeat(N, minmax(0,1fr))` — **nunca `1fr`**.
- **Acento único:** Edge Blue lleva prompt, números de sección, links y exactamente **una**
  placa full-bleed. Los colores de fase quedan pequeños.
- **Mobile-first.** Base en una columna; el desktop (≥880px) es mejora progresiva
  (nav inline, grids a 3/2 columnas). Velocidad y celular primero.
- **Bilingüe nativo** ES-MX / EN desde la base (ver §4). `lang` del `<html>` se actualiza.

---

## 4 · Bilingüe (i18n)

- Diccionario en [`assets/js/i18n.js`](assets/js/i18n.js): `es` (default) y `en`, en paridad total.
- En el HTML, cada nodo traducible lleva `data-i18n="clave"` (o `data-i18n-html` para HTML inline,
  `data-i18n-attr="attr:clave"` para atributos como `aria-label`).
- Resolución de idioma: `?lang=` en URL → `localStorage` → idioma del navegador → `es`.
- El toggle ES/EN persiste la elección y actualiza `<title>`, `meta description` y `<html lang>`.

---

## 5 · Estado de construcción

- [x] **Inicio** (`index.html`) — héroe con video, problema/costos, la ventaja, el ENGINE
      (3 fases · 6 edges), talento, nosotros, casos, placa de cierre, footer.
- [ ] El Engine · Evaluación · Capacidades · Ejecución (+ 6 servicios)
- [ ] Cómo Trabajamos · Clientes · Casos · Nosotros · Insights
- [ ] Valoración (cuestionario + reservación automática) · asistente de IA voz/texto

> Pendiente de fases siguientes según indicación: *"crea solo el diseño de la página principal
> antes de continuar con el resto"*. La rueda ENGINE™ en SVG se construirá en la página de El Engine.

---

## §MOTION v2 — Sistema ">_ OS" (transiciones + storytelling)

El símbolo `>_` deja de ser decoración: es el **sistema operativo de la página**.
Mezcla verificada de 5 referentes (código de producción extraído / frames de video):
Terminal Industries (Rejouice), Lazarev.agency, Subduxion, TRIONN, Microsoft AI.

### Gramática de movimiento (curvas medidas en los referentes)
| Uso | Curva | Duración |
|---|---|---|
| Movimiento (reveals) | `cubic-bezier(.19,1,.22,1)` expo-out | 600–700ms |
| Opacidad | `cubic-bezier(.39,.575,.565,1)` sine-out | 300–600ms |
| Hover | `ease` | 200ms |
| Ambiente (glow) | sine-out | 1100ms (Microsoft AI band-fade) |
| Stagger | 80ms por elemento · 60ms por log-line | tope 480ms |

### Piezas del sistema
1. **Boot** (`#boot`): 4 líneas tecleadas (~12ms/char), cursor bloque azul,
   1 vez por sesión, `< 1.7s`, clic/tecla lo salta, reduced-motion lo elimina.
   *(Terminal Ind. logo-boot + TRIONN preloader.)*
2. **Eyebrows comando** `>_ 01 · SECCIÓN`: prompt azul + índice + label tecleado
   con **hot edge** (último carácter en Edge Blue antes de asentarse).
   *(Terminal Ind. typed headlines + Subduxion `/ LABEL` indexado.)*
3. **Decode**: h1/h2 resuelven desde ruido `!<>-_\/[]{}` , ≤880ms, ease-out.
4. **Manifiesto** (`.manifesto`): `hero.lead` palabra por palabra gris→blanco
   scrubbed por scroll. *(Terminal Ind. dream sequence.)*
5. **Contadores**: stats cuentan 0→N en 1s al entrar. *(Lazarev/Terminal odometer.)*
6. **Casos como log-lines**: `> caso … `, stagger 60ms. *(Terminal OS-readouts.)*
7. **HUD** (`#hud`): índice 01–07 fijo a la derecha + barra de progreso 1px,
   activo en Edge Blue, desktop ≥880px. *(Subduxion.)*
8. **Glow ambiental** (`#glow`): 2 radiales Edge Blue α≤7.5%, fade 1.1s cuando
   una sección `data-glow` cruza el centro del viewport. *(Microsoft AI, port oscuro.)*
9. **Asistente `>_`** (`#term`, `terminal.js`): terminal interactiva real en el
   plate — comandos `fases/casos/ventaja/valoracion/ayuda` (ES/EN), señales
   `[ok]`, previsualización de intención en `valoracion`, legibilidad de fallos
   en comando desconocido. Todo el contenido sale de `FE_I18N` (nada inventado).
   Auto-demo al entrar en viewport. *(Lazarev "el sitio es la demo" + Agentic UX.)*

### Reglas duras
- Sin JS todo es visible (los estados ocultos los arma JS). `prefers-reduced-motion`
  desactiva boot/glow/scrub y muestra todo.
- Acento: Edge Blue marca SOLO cosas vivas (hot edge, HUD activo, prompt, tags);
  nunca >2% del viewport. *(Regla observada en Terminal Industries.)*
- Logos intocables, mínimos del brand book (≥160px). Paleta intocable.
- Contenido = las 80 llaves de `i18n.js`, ES/EN, sin inventar ni omitir.
