/**
 * Hace una petición a la API de Laravel. Por defecto no cachea y pide JSON.
 *
 * @param {string} ruta Ruta dentro de `/api`, por ejemplo `/cafes/hoy`.
 * @param {RequestInit} [opciones] Opciones de `fetch` (método, body, headers).
 * @returns {Promise<Response>} La respuesta. Lanza si la API no responde.
 */
export function apiFetch(ruta, { headers, ...opciones } = {}) {
  return fetch(`${process.env.API_URL}/api${ruta}`, {
    cache: "no-store",
    ...opciones,
    headers: { Accept: "application/json", ...headers },
  });
}

/**
 * GET a la API que devuelve el JSON, o `null` si falla (sin conexión o error HTTP).
 *
 * @param {string} ruta Ruta dentro de `/api`.
 * @returns {Promise<any | null>}
 */
export async function apiGet(ruta) {
  try {
    const res = await apiFetch(ruta);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
