/**
 * Service Worker de CafeLog.
 *
 * - Precachea la página "sin conexión" y los íconos al instalarse.
 * - Peticiones GET del mismo origen: network-first. Prueba la red y guarda una
 *   copia; si la red falla, responde con la copia. Las páginas ya traen los
 *   datos de la API, porque quien le pega a Laravel es el servidor de Next.
 * - Navegación sin red y sin copia: muestra `/offline.html`.
 * - Todo lo que no sea GET (por ejemplo guardar un café) va directo a la red.
 */
const VERSION = "cafelog-v1";
const OFFLINE = "/offline.html";
const PRECACHE = [OFFLINE, "/icons/icon-192.png", "/icons/icon-512.png"];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches
      .open(VERSION)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  );
});

// Borra las cachés de versiones anteriores y toma el control de las pestañas abiertas.
self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches
      .keys()
      .then((nombres) => Promise.all(nombres.filter((n) => n !== VERSION).map((n) => caches.delete(n))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (evento) => {
  const { request } = evento;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;

  evento.respondWith(
    fetch(request)
      .then((respuesta) => {
        if (respuesta.ok) {
          const copia = respuesta.clone();
          caches.open(VERSION).then((cache) => cache.put(request, copia));
        }
        return respuesta;
      })
      .catch(async () => {
        const guardada = await caches.match(request);
        if (guardada) return guardada;
        return request.mode === "navigate" ? caches.match(OFFLINE) : Response.error();
      }),
  );
});
