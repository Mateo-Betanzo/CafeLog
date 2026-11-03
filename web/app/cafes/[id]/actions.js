"use server";

import { redirect } from "next/navigation";
import { apiFetch } from "../../lib/api";
import { enviarCafe } from "../../lib/enviar-cafe";
import { rutaCafe } from "../../lib/ruta-cafe";

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
  const resultado = await enviarCafe(rutaCafe(id), "PUT", formData);
  if (resultado) return resultado;

  redirect(rutaCafe(id));
}

/**
 * Server Action: borra un café y vuelve a la lista. Si ya no existía (404), también vuelve.
 * Se usa con `eliminarCafe.bind(null, id)`.
 *
 * @param {string} id Id del café.
 * @returns {Promise<{errores: string[]}>} El mensaje de error, si no se pudo borrar.
 */
export async function eliminarCafe(id) {
  let res;
  try {
    res = await apiFetch(rutaCafe(id), { method: "DELETE" });
  } catch {
    return { errores: ["No se pudo conectar con la API"] };
  }
  if (!res.ok && res.status !== 404) return { errores: ["No se pudo eliminar el café"] };

  redirect("/cafes");
}
