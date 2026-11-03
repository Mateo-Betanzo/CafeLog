import { apiFetch } from "./api";

/**
 * Manda a la API los datos del formulario de un café (para crear o para editar).
 *
 * @param {string} ruta Ruta dentro de `/api`, por ejemplo `/cafes` o `/cafes/3`.
 * @param {"POST" | "PUT"} metodo
 * @param {FormData} formData Campos del formulario.
 * @returns {Promise<{errores: string[]} | null>} Los mensajes de error, o `null` si se guardó.
 */
export async function enviarCafe(ruta, metodo, formData) {
  let res;
  try {
    res = await apiFetch(ruta, {
      method: metodo,
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
  return null;
}
