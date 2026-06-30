# Final Edge — Web

Sitio de **Final Edge**: consultoría de negocio premium potenciada por inteligencia artificial y
dirigida por talento humano. Bilingüe nativo (ES-MX / EN), **mobile-first**, estética terminal/mono.

> **La IA ejecuta. La experiencia decide.** · Haz más. Sin contratar más.

## Estado

Esta primera entrega contiene **únicamente la página principal (Inicio)**, construida estrictamente
sobre el design system entregado. Las demás páginas (El Engine, servicios, Valoración, etc.) llegan
en fases siguientes.

## Stack

Sitio **estático sin build** (HTML + CSS + JS vanilla) para máxima fiabilidad de despliegue.

```
index.html                 Página principal (Inicio)
assets/
  css/tokens.css           Tokens del design system (:root)
  css/styles.css           Estilos mobile-first de Inicio
  js/i18n.js               Diccionario bilingüe ES/EN
  js/main.js               Switch de idioma + manejo del video hero
  img/logos/               Logotipos (master glossy + monocromáticos + sub-marcas)
  img/edge-icons/          Iconos de los 6 edges (line-art por color de fase)
  video/hero.mp4           Video del héroe (16:9, ~18s)
DESIGN_SYSTEM.md           Biblioteca de assets + reglas de ejecución
```

## Ver en local

No requiere instalación. Cualquier servidor estático:

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Despliegue (URL en vivo, automático)

Cada push a la rama de trabajo dispara **GitHub Actions** y publica en **GitHub Pages**
(`.github/workflows/deploy.yml`). El workflow usa `actions/configure-pages@v5` con
`enablement: true`, así que **habilita Pages automáticamente en la primera corrida** — sin pasos
manuales. La URL pública aparece en la pestaña *Actions → Deploy → environment github-pages*
y en *Settings → Pages*, típicamente:

```
https://erictoled564.github.io/finaledge-web-final/
```

## Design system

Reglas, tokens y assets documentados en [`DESIGN_SYSTEM.md`](DESIGN_SYSTEM.md).
Los cinco no-negociables: logo fijo · monocromos con relieve 3D y plata único · nada < 14px ·
una tipografía + un acento + esquinas 0 + sin sombras · copy ES-MX/EN sin emoji.
