# MEMORY.md

Bitácora del agente y único lugar con el estado del trabajo. **Máximo ~50 líneas.** Si se llena, resumir y borrar lo viejo.

## Estado actual
- Feature en curso: ninguna (revisión clean-code-guard hecha, **sin commitear: esperando el OK del usuario**)
- Última terminada: cursor con vida (`34567eb`, `073e1ff`). Antes: cursor personalizado (`f0f3fdc`), íconos y borrado manteniendo apretado (`ccfa79d`), limpieza del scaffold (`11d0e1d`), tipos desde la API (`d17113c`), refactor de mantenimiento (`bbf6b2e`), diseño (`c2fe3fd`)
- Próximo paso: revisar el Informe del `README.md` (borrador escrito el 2026-11-03, sin commitear) y decidir qué puntos del PDF de arriba se hacen

## Features pendientes
Al terminar una, borrarla de acá. Si surge una idea nueva, agregarla (una línea).
- Según el PDF del TP (entrega 13/11) falta: subir el repo a GitHub (sin `.env`, `vendor/`, `node_modules/`); opcional: repetir la tabla de pruebas con Thunder Client (hoy es con `curl`)

## Decisiones
- Planes y respuestas: breves (pedido del usuario 2026-11-03). Plan = qué se hace, archivos, dudas (máx. 4, con la recomendada) y qué se actualiza; sin repetir lo que ya se sabe ni explicar de más.
- Stack: Laravel en `api/` (SQLite), Next.js JS/App Router en `web/` con Tailwind (pedido del usuario). Rutas API a mano, sin Sanctum.
- UI: diseño bento oscuro de `web/public/Front CoffeeLog.jpg` (tarjetas redondeadas, acento naranja, colores en `globals.css`).
- Café sin tamaños: el tipo define los ml (`Cafe::TIPOS`: espresso 30/0, americano 30/0, cortado 30/30, latte 30/150, capuchino 30/120). Azúcar 4 g por cucharadita (máx. 10). Campos: tipo, cucharaditas, nota opcional (se quitó `lugar`).
- Zona horaria de la API: America/Argentina/Buenos_Aires (`config/app.php`).
- `/api/cafes/resumen?periodo=semana|mes|anio` (defecto semana, calendario, días futuros en 0). Devuelve `barras`; el año va por mes (`Y-m`).
- Mapa de calor: `GET /api/cafes/calor` → `{dias:[{fecha,total}]}` (365 días móviles, `Cafe::calor`). Grilla en CSS, un bloque por mes, 5 niveles de naranja, sin librerías de gráficos ni etiquetas de día (decisión del usuario).
- Refactor 2026-11-01: la lógica de datos vive en el modelo (`Cafe::totales/deHoy/porPeriodo`); el controlador solo valida y responde.
- Web: acceso a la API en `web/app/lib/api.js` (`apiFetch`, `apiGet`, sin caché); `lib/ruta-cafe.js` (`rutaCafe(id)`, id codificado) la usan las actions y `obtenerCafe`. Periodos del dashboard en `dashboard/periodos.js` (`PERIODOS`, `periodoValido`, `promedio`) con tests. Conversión tipo/cucharaditas en `Cafe::registrar`.
- Componentes compartidos: `componentes/` (`tarjeta`, `encabezado`, `icono`, `navegacion`, `formulario-cafe`), `lib/formato.js`, mapa de calor en `calor.js` + `bloque-mes.js` (`niveles.js` con tests).
- PWA: `public/manifest.json`, `sw.js` (network-first, caché `cafelog-v1`), `offline.html`, íconos de `public/icons/` (los dejó el usuario). Solo se registra en producción; el navegador no llama a la API, se cachean las páginas.
- Lista: `GET /api/cafes` pagina de a 10 (`Cafe::recientes`). `/cafes`: primera tanda del servidor y `lista-infinita.js` + Server Action `cargarMas`; hook `lib/use-scroll-infinito.js`. Sin conexión no carga más tandas.
- Navegación: `componentes/navegacion.js`, cápsula fija (abajo al centro en <768 px) en `layout.js` dentro de `<Suspense>`; íconos SVG de `public/svg/` dibujados por `Icono` como máscara CSS.
- Lista por día: títulos Hoy/Ayer/fecha larga y solo la hora en 24 h; todo en `lib/fechas.js` (Buenos Aires, 11 tests: `node --test app/lib/fechas.test.js`).
- Diseño: botón = `@utility boton` de `globals.css`; gráficos del dashboard solo CSS (sin Chart.js), barra más alta en naranja, tooltip, promedio sin días futuros.
- Tipos: `GET /api/cafes/tipos` → `{tipos, max_cucharaditas}`. `/nuevo` trae los tipos y se los pasa al formulario; sin API muestra error, sin lista de respaldo.
- Limpieza: `api/` es solo API (sin web.php, vistas, `User`, vite). La `database.sqlite` ya migrada conserva tablas viejas; una base nueva solo crea `cafes`.
- API completa: `apiResource` con 5 acciones; PUT/PATCH reemplazan el café entero (sin `nota` se borra); DELETE 200 `{mensaje}`. Mensajes en español (`lang/es`, `APP_LOCALE=es`). Seeder: 10 cafés de los últimos 14 días (correrlo dos veces duplica).
- Editar/eliminar: `/cafes/[id]/editar` reusa `formulario-cafe.js`; `boton-eliminar.js` borra manteniendo apretado (animación `llenando` de `globals.css`, 0,5 s solo en el CSS; soltar, salir o perder foco cancela; Enter/Espacio también). Actions en `cafes/[id]/actions.js`: ambas devuelven `{errores: [...]}`; 404 al borrar vuelve a `/cafes`.
- Cursor: `cursor-suave.js` dibuja `public/cursores/{flecha,mano}.png` (puntos activos en `CURSORES`); punta casi pegada (`RETRASO` 0,02 s) y cuerpo como péndulo. Física pura en `lib/resorte.js` (`INCLINACION`=20°, rigidez, amortiguación; 6 tests). El cursor del sistema se oculta con CSS en `globals.css` (`pointer: fine`, sin reduced-motion); mano sobre links/botones, en `input`/`textarea` queda la "I". Probar en Chrome headless con `--blink-settings=primaryPointerType=4,availablePointerTypes=4,primaryHoverType=2,availableHoverTypes=2`.
- La web usa `API_URL` (`web/.env.local`, no se commitea).

## Errores y soluciones
- Pruebas manuales de la API: todas las filas del README dan OK (Thunder Client). Para repetirlas: `cd api/public && DB_DATABASE=<tmp> php -S localhost:8100 ../vendor/laravel/framework/src/Illuminate/Foundation/resources/server.php` (`artisan serve` ignora `DB_DATABASE`).
- Revisión clean-code-guard (2026-11-03): física del cursor a `lib/resorte.js`, `rutaCafe`, `Cafe::recientes`, `Formulario` a `componentes/`; sin cambio de comportamiento.
- Build de Next "uncached or runtime data during prerendering" (`cacheComponents: true` viene activo): el `fetch` va en un componente async dentro de `<Suspense>`.
- Con `<Suspense>` la página de "no encontrado" sale con HTTP 200 (el streaming ya envió el status).
- Si el formulario da "fetch failed": la API no está corriendo (`php artisan serve` en `api/`).
- Capturas: el MCP a veces tarda >2 min; alternativa headless propia (`chrome --headless=new --user-data-dir=<tmp> --screenshot=...`) o comparar el HTML del servidor con curl.
- El Service Worker solo corre con `npm run build` + `npm start`; con `next dev` no se registra. Si el puerto 3000 ya tiene un `next dev`, probar la PWA en otro puerto (`npx next start -p 3100`).
- chrome-devtools MCP: si dice "browser is already running", hay dos servidores peleando por el perfil; no matar procesos sin preguntar.
- `pkill -f "next start..."` desde Bash mata el propio shell (el patrón coincide con el comando): usar `ss -ltnp` + `kill <pid>`.
- Capturas sin el MCP: `chrome --headless=new --user-data-dir=<tmp> --virtual-time-budget=6000 --screenshot=...` con perfil propio.
- Un `grid` suelto se coló en `lib/formato.js` (editor) y entró al commit 7fced6a por `git add -A`; borrado. Revisar `git diff` antes de commitear.
