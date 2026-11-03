# MEMORY.md

Bitácora del agente y único lugar con el estado del trabajo. **Máximo ~50 líneas.** Si se llena, resumir y borrar lo viejo.

## Estado actual
- Feature en curso: ninguna (tipos desde la API hecho y verificado, **sin commitear: esperando el OK del usuario**)
- Última terminada: tipos de café desde la API (pendiente de commit). Antes: refactor de mantenimiento (`bbf6b2e`), diseño (`c2fe3fd`), encabezado con flecha (`4ba9ed8`)
- Próximo paso: elegir una feature de "Features pendientes" y presentar el plan

## Features pendientes
Al terminar una, borrarla de acá. Si surge una idea nueva, agregarla (una línea).
- (nada pendiente por ahora)

## Decisiones
- Stack: Laravel en `api/` (SQLite), Next.js JS/App Router en `web/` con Tailwind (pedido del usuario). Rutas API a mano, sin Sanctum.
- UI: diseño bento oscuro de `web/public/Front CoffeeLog.jpg` (tarjetas redondeadas, acento naranja, colores en `globals.css`).
- Café sin tamaños: el tipo define los ml (`Cafe::TIPOS`: espresso 30/0, americano 30/0, cortado 30/30, latte 30/150, capuchino 30/120). Azúcar 4 g por cucharadita (máx. 10). Campos: tipo, cucharaditas, nota opcional (se quitó `lugar`).
- Zona horaria de la API: America/Argentina/Buenos_Aires (`config/app.php`).
- `/api/cafes/resumen?periodo=semana|mes|anio` (defecto semana, calendario, días futuros en 0). Devuelve `barras`; el año va por mes (`Y-m`).
- Mapa de calor (estilo GitHub, 2026-11-02): `GET /api/cafes/calor` → `{dias:[{fecha,total}]}` de los últimos 365 días móviles (`Cafe::calor`). Grilla en CSS con un bloque por mes (estilo LeetCode: 7 filas lunes a domingo, espacio entre meses, nombre del mes debajo), 5 niveles de naranja y día exacto en el `title`. Sin etiquetas de día ni encabezado de rachas (decisión del usuario). Sin librerías de gráficos (decisión del usuario). No depende de las pestañas.
- Refactor 2026-11-01: la lógica de datos vive en el modelo (`Cafe::totales/deHoy/porPeriodo`); el controlador solo valida y responde.
- Web: acceso a la API en `web/app/lib/api.js` (`apiFetch`, `apiGet`, sin caché). Dashboard dividido en `page.js`, `graficos.js`, `grafico.js`, `filtros.js`; inicio en `page.js` + `resumen-hoy.js`. Periodos del dashboard en una sola tabla `dashboard/periodos.js` (`PERIODOS`, `periodoValido`, `promedio`; la usan `grafico`, `filtros` y `graficos`), con tests en `periodos.test.js` (8). `cafes/[id]/page.js` ya usa `apiFetch`. La conversión tipo/cucharaditas a ml/gramos vive en `Cafe::registrar` (el controlador solo valida y responde).
- Componentes compartidos (2026-11-02): `app/componentes/tarjeta.js` (`Tarjeta`, prop `as`) y `encabezado.js` (`Encabezado`: flecha a `/` + `<h1>` en la misma línea, solo ícono; reemplazó a `Volver`); `app/lib/formato.js` (solo `cafes(n)` → "café"/"cafés"). Mapa de calor dividido en `calor.js` + `bloque-mes.js` (`BloqueMes`, `nivel`, `colorNivel`). Verificado con capturas antes/después: idénticas.
- PWA (2026-11-02): `web/public/manifest.json`, `sw.js` (network-first para todo GET del mismo origen, POST directo a la red, caché `cafelog-v1`), `offline.html` e íconos generados con Python en `public/icons/` (provisorios; el usuario los cambiará). El navegador no llama a la API (lo hace el servidor de Next), así que se cachean las páginas que ya traen los datos. Se registra solo en producción (`registrar-sw.js`). Sin librerías ni tests; verificado en el navegador con red Offline.
- Lista (2026-11-02): `GET /api/cafes` pagina de a 10 (más nuevo primero). Web `/cafes`: la primera tanda la trae el servidor y `lista-infinita.js` (Client Component, IntersectionObserver) pide las siguientes con la Server Action `cafes/actions.js` (`cargarMas`), porque el navegador no llama a la API. Sin repetidos por id. Refactor: hook genérico `lib/use-scroll-infinito.js`, `cafes/fila-cafe.js` y `fechaCorta` en `lib/fechas.js` (también la usa `cafes/[id]/page.js`); capturas antes/después idénticas. Sin conexión no carga más tandas (las actions no se cachean).
- Navegación (2026-11-02): `componentes/navegacion.js`, cápsula fija abajo a la izquierda (en <768 px, horizontal abajo al centro) con Inicio, Mis cafés, Dashboard y Nuevo café; activo en blanco, resto apagado, `aria-current`. Va en `layout.js` dentro de `<Suspense>` (por `usePathname` con `cacheComponents`). Íconos: SVG de `web/public/svg/` (home-simple, coffee-cup, view-grid, plus) en la lista `ENLACES`; el componente `componentes/icono.js` los dibuja como máscara CSS con `currentColor` (un `<img>` no hereda el color). `Encabezado` usa `nav-arrow-left`. Se quitaron los botones "Mis cafés" y "Dashboard" del inicio.
- Lista por día (2026-11-02): `/cafes` muestra un título por día (Hoy, Ayer, "Lunes 26 de octubre", con año si no es el actual) y debajo sus tarjetas con solo la hora en 24 h (todo lo de fechas vive en `lib/fechas.js`: `fechaCorta`, `fechaLarga`, `hora`, `dia`, `tituloDia`, `agruparPorDia`; 24 h). Días en horario de Buenos Aires. Tests con `node --test app/lib/fechas.test.js` (11) (runner de Node, sin librerías; avisa por el tipo de módulo, es inofensivo).
- Diseño (2026-11-02): botón = clase `boton` en `globals.css` (`@utility`, pastilla negra, borde `white/25`); `Tarjeta` `rounded-lg p-7`, campos `rounded-lg`, filtros en pastilla (activa gris claro). Gráficos del dashboard (`grafico.js`, solo CSS, sin Chart.js aunque el usuario lo permitió): barras `rounded-t` sobre 3 guías tenues con escala 0/mitad/máx, la más alta en naranja pleno y el resto al 50 %, tooltip con fecha y valor al pasar el mouse, promedio por día (por mes en el año) sin contar días futuros.
- Tipos (2026-11-03): `GET /api/cafes/tipos` → `{tipos, max_cucharaditas}` (`Cafe::TIPOS`, `Cafe::MAX_CUCHARADITAS`, también usada en la validación de `store`). `/nuevo` es Server Component con `<Suspense>`: trae los tipos y se los pasa a `Formulario` por props; sin API muestra error, sin lista de respaldo (decisión del usuario).
- La web usa `API_URL` (`web/.env.local`, no se commitea).

## Errores y soluciones
- Probar con `DB_DATABASE=otra.sqlite php artisan serve` NO cambia la base (serve no reenvía esa variable) y un POST de prueba cae en la base de desarrollo. Solución: no escribir datos al probar (solo GET) o borrar solo la fila propia.
- Build de Next "uncached or runtime data during prerendering" (`cacheComponents: true` viene activo): el `fetch` va en un componente async dentro de `<Suspense>`.
- Con `<Suspense>` la página de "no encontrado" sale con HTTP 200 (el streaming ya envió el status).
- Si el formulario da "fetch failed": la API no está corriendo (`php artisan serve` en `api/`).
- Capturas con chrome-devtools: el `take_screenshot` a veces tarda >2 min y pasa a segundo plano; esperar la notificación o repetirlo. El ícono "N" de Next aparece en algunas capturas: ignorarlo al comparar.
- El Service Worker solo corre con `npm run build` + `npm start`; con `next dev` no se registra. Si el puerto 3000 ya tiene un `next dev`, probar la PWA en otro puerto (`npx next start -p 3100`).
- chrome-devtools MCP: si dice "browser is already running for ...chrome-profile", hay dos servidores MCP peleando por el perfil; no matar procesos sin preguntar. Alternativa sin navegador: comparar el HTML del servidor (curl, sin `<script>`/`<link>`) antes y después.
- Capturas sin el MCP: `chrome --headless=new --user-data-dir=<tmp> --virtual-time-budget=6000 --screenshot=...` con perfil propio.
- Un `grid` suelto se coló en `lib/formato.js` (editor) y entró al commit 7fced6a por `git add -A`; borrado. Revisar `git diff` antes de commitear.
