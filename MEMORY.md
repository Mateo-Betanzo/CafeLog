# MEMORY.md

Bitácora del agente y único lugar con el estado del trabajo. **Máximo ~50 líneas.** Si se llena, resumir y borrar lo viejo.

## Estado actual
- Feature en curso: ninguna
- Última feature terminada: ninguna
- Próximo paso: (ver Pendientes/dudas) elegir una feature de "Features pendientes" y presentar el plan

## Features pendientes
Al terminar una, borrarla de acá. Si surge una idea nueva, agregarla (una línea).
- Agregar un café nuevo (formulario web + API, con conversión a ml y gramos)
- Ver cuántos cafés llevo hoy (pantalla de inicio, usa `/api/cafes/hoy`)
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
- Responder: equivalencias ml (chico/mediano/grande), g por cucharadita, tipos de café.
