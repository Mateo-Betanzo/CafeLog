"use server";

import { redirect } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { enviarCafe } from "../../lib/enviar-cafe";

/**
 * Server Action: guarda los cambios de un café y vuelve a su detalle.
 * Se usa con `editarCafe.bind(null, id)`.
 *
 * @param {string} id Id del café.
 * @param {{errores: string[]} | null} estado Estado anterior del formulario.
 * @param {FormData} formData Campos del formulario.
 * @returns {Promise<{errores: string[]}>} Mensajes de error si la API rechaza los datos.
 */
export async function editarCafe(id, estado, formData) {
  const error = await enviarCafe(`/cafes/${encodeURIComponent(id)}`, "PUT", formData);
  if (error) return error;

  redirect(`/cafes/${encodeURIComponent(id)}`);
}

/**
 * Server Action: borra un café y vuelve a la lista. Si ya no existía (404), también vuelve.
 * Se usa con `eliminarCafe.bind(null, id)`.
 *
 * @param {string} id Id del café.
 * @returns {Promise<{error: string}>} El mensaje, si no se pudo borrar.
 */
export async function eliminarCafe(id) {
  let res;
  try {
    res = await apiFetch(`/cafes/${encodeURIComponent(id)}`, { method: "DELETE" });
  } catch {
    return { error: "No se pudo conectar con la API" };
  }
  if (!res.ok && res.status !== 404) return { error: "No se pudo eliminar el café" };

  redirect("/cafes");
}
