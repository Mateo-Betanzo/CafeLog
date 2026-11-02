# MEMORY.md

Bitácora del agente y único lugar con el estado del trabajo. **Máximo ~50 líneas.** Si se llena, resumir y borrar lo viejo.

## Estado actual
- Feature en curso: ninguna
- Última terminada: mapa de calor días de la semana × meses (`/api/cafes/calor` + `dashboard/calor.js`), sin commitear. Antes: refactor (`47f6a68`)
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
- Mapa de calor 2026-11-01: filas = lunes a domingo, columnas = ene a dic, celda = cantidad de cafés del año actual (fijo, no depende de las pestañas). `GET /api/cafes/calor` → `{anio, filas}` (`Cafe::calor`). Hecho en CSS, sin librerías de gráficos (decisión del usuario).
- Refactor 2026-11-01: la lógica de datos vive en el modelo (`Cafe::totales/deHoy/porPeriodo`); el controlador solo valida y responde.
- Web: acceso a la API en `web/app/lib/api.js` (`apiFetch`, `apiGet`, sin caché). Dashboard dividido en `page.js`, `graficos.js`, `grafico.js`, `filtros.js`; inicio en `page.js` + `resumen-hoy.js`. `cafes/[id]/page.js` todavía usa su propio `fetch`.
- La web usa `API_URL` (`web/.env.local`, no se commitea).

## Errores y soluciones
- Probar con `DB_DATABASE=otra.sqlite php artisan serve` NO cambia la base (serve no reenvía esa variable) y un POST de prueba cae en la base de desarrollo. Solución: no escribir datos al probar (solo GET) o borrar solo la fila propia.
- Build de Next "uncached or runtime data during prerendering" (`cacheComponents: true` viene activo): el `fetch` va en un componente async dentro de `<Suspense>`.
- Con `<Suspense>` la página de "no encontrado" sale con HTTP 200 (el streaming ya envió el status).
- Si el formulario da "fetch failed": la API no está corriendo (`php artisan serve` en `api/`).
