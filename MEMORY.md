# MEMORY.md

Bitácora del agente y único lugar con el estado del trabajo. **Máximo ~50 líneas.** Si se llena, resumir y borrar lo viejo.

## Estado actual
- Feature en curso: ninguna
- Última feature terminada: ver cuántos cafés llevo hoy (GET /api/cafes/hoy + tarjeta en /)
- Próximo paso: elegir una feature de "Features pendientes" y presentar el plan

## Features pendientes
Al terminar una, borrarla de acá. Si surge una idea nueva, agregarla (una línea).
- Ver el detalle de un café (ruta `[id]`, 404 si no existe)
- Dashboard con barras de café, leche y azúcar (usa `/api/cafes/resumen`)
- Filtrar por semana, mes o año
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
