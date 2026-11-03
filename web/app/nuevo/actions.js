"use server";

import { redirect } from "next/navigation";
import { enviarCafe } from "../lib/enviar-cafe";

/**
 * Server Action: envía el café a la API y vuelve al inicio si se guardó.
 *
 * @param {{errores: string[]} | null} estado Estado anterior del formulario.
 * @param {FormData} formData Campos del formulario.
 * @returns {Promise<{errores: string[]}>} Mensajes de error si la API rechaza los datos.
 */
export async function crearCafe(estado, formData) {
  const error = await enviarCafe("/cafes", "POST", formData);
  if (error) return error;

  redirect("/");
}
