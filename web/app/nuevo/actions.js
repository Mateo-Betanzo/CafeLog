"use server";

import { redirect } from "next/navigation";
import { apiFetch } from "../lib/api";

/**
 * Server Action: envía el café a la API y vuelve al inicio si se guardó.
 *
 * @param {{errores: string[]} | null} estado Estado anterior del formulario.
 * @param {FormData} formData Campos del formulario.
 * @returns {Promise<{errores: string[]}>} Mensajes de error si la API rechaza los datos.
 */
export async function crearCafe(estado, formData) {
  let res;
  try {
    res = await apiFetch("/cafes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo: formData.get("tipo"),
        cucharaditas: Number(formData.get("cucharaditas")),
        nota: formData.get("nota") || null,
      }),
    });
  } catch {
    return { errores: ["No se pudo conectar con la API"] };
  }

  if (res.status === 422) {
    const { errors } = await res.json();
    return { errores: Object.values(errors).flat() };
  }
  if (!res.ok) return { errores: ["No se pudo guardar el café"] };

  redirect("/");
}
