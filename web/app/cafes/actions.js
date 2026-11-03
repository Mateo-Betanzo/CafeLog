"use server";

import { apiGet } from "../lib/api";

/**
 * Server Action: pide la siguiente tanda de cafés para el scroll infinito. Se llama
 * desde el navegador porque solo el servidor de Next puede hablar con la API.
 *
 * @param {number} pagina Número de tanda que entiende la API (`?page=`), desde 1.
 * @returns {Promise<{items: object[]} | null>} Los cafés de la tanda, o `null` si falla.
 */
export async function cargarMas(pagina) {
  const respuesta = await apiGet(`/cafes?page=${pagina}`);
  return respuesta ? { items: respuesta.data } : null;
}
