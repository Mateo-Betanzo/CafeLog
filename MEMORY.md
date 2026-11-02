# MEMORY.md

Bitácora del agente y único lugar con el estado del trabajo. **Máximo ~50 líneas.** Si se llena, resumir y borrar lo viejo.

## Estado actual
- Feature en curso: ninguna
- Última terminada: mapa de calor estilo GitHub + separado por meses estilo LeetCode, sin commitear. Antes: mapa semana × mes (`74ee3e3`)
- Próximo paso: elegir una feature de "Features pendientes" y presentar el plan

## Features pendientes
Al terminar una, borrarla de acá. Si surge una idea nueva, agregarla (una línea).
- PWA: manifest, Service Worker, caché network-first y página "sin conexión"
- (idea) Lista de cafés con link al detalle; hoy `/cafes/[id]` solo se abre por URL

## Decisiones
- Stack: Laravel en `api/` (SQLite), Next.js JS/App Router en `web/` con Tailwind (pedido del usuario). Rutas API a mano, sin Sanctum.
- UI: diseño bento oscuro de `web/public/Front CoffeeLog.jpg` (tarjetas redondeadas, acento naranja, colores en `globals.css`).
- Café sin tamaños: el tipo define los ml (`Cafe::TIPOS`: espresso 30/0, americano 30/0, cortado 30/30, latte 30/150, capuchino 30/120). Azúcar 4 g por cucharadita (máx. 10). Campos: tipo, cucharaditas, nota opcional (se quitó `lugar`).
- Zona horaria de la API: America/Argentina/Buenos_Aires (`config/app.php`).
- `/api/cafes/resumen?periodo=semana|mes|anio` (defecto semana, calendario, días futuros en 0). Devuelve `barras`; el año va por mes (`Y-m`).
- Mapa de calor (estilo GitHub, 2026-11-02): `GET /api/cafes/calor` → `{dias:[{fecha,total}]}` de los últimos 365 días móviles (`Cafe::calor`). Grilla en CSS con un bloque por mes (estilo LeetCode: 7 filas lunes a domingo, espacio entre meses, nombre del mes debajo), 5 niveles de naranja y día exacto en el `title`. Sin etiquetas de día ni encabezado de rachas (decisión del usuario). Sin librerías de gráficos (decisión del usuario). No depende de las pestañas.
- Refactor 2026-11-01: la lógica de datos vive en el modelo (`Cafe::totales/deHoy/porPeriodo`); el controlador solo valida y responde.
- Web: acceso a la API en `web/app/lib/api.js` (`apiFetch`, `apiGet`, sin caché). Dashboard dividido en `page.js`, `graficos.js`, `grafico.js`, `filtros.js`; inicio en `page.js` + `resumen-hoy.js`. `cafes/[id]/page.js` todavía usa su propio `fetch`.
- La web usa `API_URL` (`web/.env.local`, no se commitea).

## Errores y soluciones
- Probar con `DB_DATABASE=otra.sqlite php artisan serve` NO cambia la base (serve no reenvía esa variable) y un POST de prueba cae en la base de desarrollo. Solución: no escribir datos al probar (solo GET) o borrar solo la fila propia.
- Build de Next "uncached or runtime data during prerendering" (`cacheComponents: true` viene activo): el `fetch` va en un componente async dentro de `<Suspense>`.
- Con `<Suspense>` la página de "no encontrado" sale con HTTP 200 (el streaming ya envió el status).
- Si el formulario da "fetch failed": la API no está corriendo (`php artisan serve` en `api/`).
