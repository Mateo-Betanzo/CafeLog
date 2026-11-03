# CafeLog

App web para registrar cada café que tomo (tipo, cucharaditas de azúcar y nota) con un dashboard de consumo. TP Integrador de Programación Web Dinámica, EPET Nº 30.

## Propuesta

CafeLog es una app web para anotar cada café que tomo. En cada registro guardo el tipo de café, las cucharaditas de azúcar y una nota opcional. El sistema convierte el tipo a mililitros de café y leche, y el azúcar a gramos, de forma automática.

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
- Tailwind CSS para los estilos, sin librerías de gráficos (barras y mapa de calor con CSS)

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
- `web/app/componentes/` piezas de interfaz compartidas (`Tarjeta`, `Encabezado`, `Navegacion`, `Icono`)
- `web/public/svg/` íconos SVG (barra de navegación y flecha del encabezado)
- `README.md` tema, cómo correrlo, tabla de pruebas e informe
- `AGENT.md` reglas de trabajo para el agente
- `MEMORY.md` estado del trabajo y features pendientes (máx. ~50 líneas)
- `.claude/skills/implementar-feature/` skill para implementar features

## Reglas

- No subir `.env`, `vendor/` ni `node_modules/`.
- Las conversiones (cucharaditas a gramos, tipo de café a ml) se hacen en la API.
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
echo "API_URL=http://localhost:8000" > .env.local
npm run dev              # http://localhost:3000
node --test app/lib/fechas.test.js app/dashboard/periodos.test.js app/dashboard/niveles.test.js   # tests de fechas, periodos y niveles (runner de Node)
```

**PWA** (el Service Worker solo se registra en producción)

```bash
cd web
npm run build
npm start                # http://localhost:3000 → instalable desde el navegador
```

Prueba: abrir `/dashboard`, recargar, poner la red en Offline (DevTools) y recargar: se ve la última copia. Una ruta no visitada muestra `/offline.html`.

## Tabla de pruebas

Pruebas manuales de la API, hechas con Thunder Client.

| Método | Ruta | Caso | Esperado | Resultado |
|--------|------|------|----------|-----------|
| POST | /api/cafes | latte, 2 cucharaditas | 201, café 30 ml / leche 150 ml / azúcar 8 g | OK |
| POST | /api/cafes | espresso sin nota | 201, leche 0 ml | OK |
| POST | /api/cafes | tipo inexistente o cucharaditas > 10 | 422 | OK |
| GET | /api/cafes | sin cafés | 200, `data` vacío | OK |
| GET | /api/cafes | 3 cafés con distinta fecha | 200, del más nuevo al más viejo | OK |
| GET | /api/cafes?page=2 | 12 cafés | 200, 10 en la primera página y 2 en la segunda | OK |
| GET | /api/cafes/1 | café existente | 200, con tipo, ml, gramos, nota y fecha | OK |
| GET | /api/cafes/999 | id inexistente | 404 | OK |
| GET | /api/cafes/resumen | sin `periodo` | 200, `barras` de la semana lunes a domingo | OK |
| GET | /api/cafes/resumen?periodo=mes | mes actual | 200, una barra por día del mes | OK |
| GET | /api/cafes/resumen?periodo=anio | año actual | 200, 12 barras (`YYYY-MM`) | OK |
| GET | /api/cafes/resumen?periodo=siglo | periodo inválido | 422 | OK |
| GET | /api/cafes/calor | sin cafés | 200, `dias` con 365 días en 0 (del más viejo a hoy) | OK |
| GET | /api/cafes/calor | 2 cafés hoy y 1 de hace más de 365 días | 200, hoy con total 2; el viejo no aparece | OK |
| GET | /api/cafes/tipos | — | 200, `tipos` (espresso, americano, cortado, latte, capuchino) y `max_cucharaditas` 10 | OK |
| GET | /api/cafes/hoy | sin cafés cargados | 200, todo en 0 | OK |
| GET | /api/cafes/hoy | 2 cafés de hoy y 1 de ayer | 200, total 2 y sumas solo de hoy | OK |

## Informe

**1. Códigos de estado.**
`GET /api/cafes/999` devuelve **404**: la ruta existe, pero no hay un café con ese id, y `findOrFail` lo avisa con ese código.
`POST /api/cafes` con `{"tipo":"mate","cucharaditas":2}` devuelve **422**: el pedido está bien armado y el servidor lo entiende, pero los datos no pasan la validación (el tipo no está entre los de `Cafe::TIPOS`).
Con 404 el problema es el recurso que pido; con 422 el problema es lo que mando en el cuerpo, y la respuesta trae el detalle de cada campo.

**2. HTTPS.**
En HTTP, alguien que esté en la misma red (por ejemplo, el wifi de un bar) podría leer todo lo que viaja: los cafés que registro, sus notas y las páginas que veo, y hasta modificarlos en el camino. HTTPS cifra el tráfico y comprueba que el servidor es el verdadero.
El Service Worker lo exige porque intercepta todos los pedidos de la app y puede responder lo que quiera, también sin conexión. Si se pudiera instalar por HTTP, un atacante en la red podría meter su propio Service Worker y quedarse controlando la app. Solo se permite sin HTTPS en `localhost`, para poder probar.

**3. CORS.**
CORS es una regla del **navegador**: no deja que el JavaScript de una página (por ejemplo `localhost:3000`) lea la respuesta de otro origen (`localhost:8000`) si ese servidor no lo permite. El `fetch` de un Server Component corre en el servidor de Next.js, no en el navegador, así que no hay chequeo de CORS. En CafeLog es así incluso con la Server Action `cargarMas` del scroll infinito: el navegador nunca habla con Laravel.
Aparecería si un Client Component hiciera `fetch("http://localhost:8000/api/cafes")` desde el navegador: entonces Laravel tendría que responder con los encabezados de CORS.

**4. PWA y TWA.**
No, CafeLog no necesita estar en Google Play. Como PWA ya se puede instalar desde el navegador (tiene `manifest.json`, íconos, `display: standalone` y Service Worker) y abre sin conexión, que es lo que necesito.
Una TWA solo sirve para empaquetar esa misma PWA y publicarla en la tienda; pediría una cuenta de desarrollador, la revisión de Google y mantener otro paquete, y para una app de uso personal no suma nada.

**5. Decisiones.**
Lo que más me costó fue entender que el navegador no le pega a la API, lo hace el servidor de Next.js. Eso cambió tres cosas: el scroll infinito de `/cafes` lo resolví con una Server Action (`cargarMas`); el caché del Service Worker guarda las páginas ya armadas (network-first), no las respuestas de la API; y tuve que poner cada `fetch` dentro de un `<Suspense>`, porque con `cacheComponents` Next rechazaba datos dinámicos durante el prerenderizado.
También decidí que la API haga todas las conversiones (tipo a ml, cucharaditas a gramos) y que sea la única fuente de los tipos de café (`GET /api/cafes/tipos`), para no tener la lista repetida en la web.