import { notFound } from "next/navigation";
import { apiFetch } from "../lib/api";

/**
 * Pide a la API el detalle de un café.
 *
 * @param {string} id Id del café.
 * @returns {Promise<object | null>} El café, o `null` si la API no responde.
 *   Si el café no existe, dispara `notFound()`.
 */
export async function obtenerCafe(id) {
  let res;
  try {
    res = await apiFetch(`/cafes/${id}`);
  } catch {
    return null;
  }
  if (res.status === 404) notFound();
  return res.ok ? await res.json() : null;
}
