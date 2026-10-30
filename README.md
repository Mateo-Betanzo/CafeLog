# CafeLog

App web para registrar cada café que tomo (tipo, tamaño de café y de leche, cucharaditas de azúcar) con un dashboard de consumo. TP Integrador de Programación Web Dinámica, EPET Nº 30.

## Propuesta

CafeLog es una app web para anotar cada café que tomo. En cada registro guardo el tipo de café, el tamaño del café y de la leche (chico, mediano o grande) y las cucharaditas de azúcar. El sistema convierte todo eso a mililitros y gramos de forma automática.

En la pantalla de inicio se ve cuántos cafés llevo en el día. El dashboard muestra barras con las cantidades de café, leche y azúcar, y un mapa de calor que indica en qué días y en qué meses tomo más. Todo se puede filtrar por semana, mes o año.

El diseño de la interfaz grafica y la experiencia de usuario debe estar casi calcada del diseño bento de la imagen `web/public/Front CoffeeLog.jpg`.

## Stack

**Backend (`api/`)**
- PHP con Laravel
- Eloquent, migraciones y seeders
- Base de datos SQLite (la que trae Laravel por defecto)
- API REST con `Route::apiResource`
- Validación con `$request->validate()`
- Pruebas manuales con Thunder Client

**Frontend (`web/`)**
- JavaScript con Next.js (App Router) y React
- Server Components para traer los datos de la API
- Client Components con `'use client'` para los filtros
- Server Actions para el formulario de carga
- Rutas dinámicas (`[id]`), `Link` y layout
- CSS propio, sin librerías de gráficos (barras y mapa de calor con CSS)

**PWA**
- `manifest.json`
- Service Worker
- Caché de la API (network-first) y página de "sin conexión"

**Herramientas**
- Git y GitHub
- Node.js y npm
- Composer

## Estructura

- `api/` proyecto Laravel
- `web/` proyecto Next.js
- `README.md` tema, cómo correrlo, tabla de pruebas e informe
- `AGENT.md` reglas de trabajo para el agente
- `MEMORY.md` estado del trabajo y features pendientes (máx. ~50 líneas)
- `.claude/skills/implementar-feature/` skill para implementar features

## Reglas

- No subir `.env`, `vendor/` ni `node_modules/`.
- Las conversiones (cucharaditas a gramos, tamaños a ml) se hacen en la API.
- Declarar `/api/cafes/hoy` y `/api/cafes/resumen` antes de `apiResource`.
- Respuestas HTTP: 200, 201, 404 (con `findOrFail`) y 422.

## Cómo correrlo

**API**
```bash
cd api
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve        # http://localhost:8000
```

**Web**
```bash
cd web
npm install
npm run dev              # http://localhost:3000
```

## Tabla de pruebas

Pruebas manuales de la API con Thunder Client. Se completa a medida que se implementa cada endpoint.

| Método | Ruta | Caso | Esperado | Resultado |
|--------|------|------|----------|-----------|
|        |      |      |          |           |

## Informe

_(Se completa al final del proyecto: decisiones tomadas, problemas encontrados, qué se aprendió.)_