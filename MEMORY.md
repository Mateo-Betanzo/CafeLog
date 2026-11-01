# MEMORY.md

Bitácora del agente y único lugar con el estado del trabajo. **Máximo ~50 líneas.** Si se llena, resumir y borrar lo viejo.

## Estado actual
- Feature en curso: ninguna
- Última feature terminada: filtrar por semana, mes o año (`?periodo=` + pestañas en /dashboard), sin commitear
- Próximo paso: elegir una feature de "Features pendientes" y presentar el plan

## Features pendientes
Al terminar una, borrarla de acá. Si surge una idea nueva, agregarla (una línea).
- Mapa de calor de días y meses
- PWA: manifest, Service Worker, caché network-first y página "sin conexión"

## Decisiones
- 2026-10-30: scaffolding hecho (Laravel en `api/`, Next.js JS/App Router sin Tailwind en `web/`). Tests de Laravel pasan.
- UI: seguir el diseño bento oscuro de `web/public/Front CoffeeLog.jpg` (tarjetas redondeadas, acento naranja).

## Errores y soluciones
<!-- Ej: "Error: 404 en /api/cafes/hoy → estaba declarada después de apiResource. Solución: moverla antes." -->

## Pendientes / dudas

## Café nuevo (hecho)
- Sin tamaños: el tipo define ml. espresso 30/0, americano 30/0, cortado 30/30, latte 30/150, capuchino 30/120 (café/leche). Azúcar 4 g por cucharadita (máx. 10).
- Campos: tipo, cucharaditas, nota (opcional). Se quitó `lugar` (2026-10-31). Fecha = created_at.
- Estilos con Tailwind (pedido del usuario; antes decía CSS propio). Rutas API a mano, sin Sanctum. Conversiones en `Cafe::TIPOS`. Web llama a la API vía `API_URL` (`web/.env.local`, no se commitea).

## Café de hoy (hecho)
- 2026-10-31: zona horaria de la API = America/Argentina/Buenos_Aires (`config/app.php`) para que "hoy" no se corte en UTC.
- La web pide `/api/cafes/hoy` con `cache: "no-store"`.

## Errores y soluciones (café de hoy)
- Error: build de Next "uncached or runtime data during prerendering" en `/` (`cacheComponents: true` viene activo). Solución: el `fetch` va en un componente async dentro de `<Suspense>`.

## Detalle de un café (hecho)
- 2026-11-01: no hay link al detalle (se llega por URL) hasta que exista la lista; fecha en hora de Buenos Aires.
- Limitación: con `<Suspense>` la página de "no encontrado" sale con HTTP 200 (el streaming ya envió el status).

## Dashboard (hecho)
- 2026-11-01: `/api/cafes/resumen` devuelve los últimos 10 días (incluido hoy) con totales por día; 3 tarjetas separadas (café, leche, azúcar) con barras en CSS.
- Error: probar con `DB_DATABASE=otra.sqlite php artisan serve` NO cambia la base (serve no reenvía esa variable) y el POST de prueba cayó en la base de desarrollo. Solución: borrar solo esa fila; para probar de verdad, apuntar `DB_DATABASE` en un `.env` aparte o no escribir datos.

## Filtro por periodo (hecho)
- 2026-11-01: `/api/cafes/resumen?periodo=semana|mes|anio` (por defecto semana). Rangos calendario: lunes a domingo, mes del 1 al último día, año enero a diciembre (barra por mes, `Y-m`). Días futuros en cero. La lista se llama `barras`; se eliminó la vista de 10 días.
- Pestañas en `web/app/dashboard/filtros.js` (Client Component, `?periodo=` en la URL).
