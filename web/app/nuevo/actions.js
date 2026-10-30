"use server";

import { redirect } from "next/navigation";

export async function crearCafe(estado, formData) {
  const res = await fetch(`${process.env.API_URL}/api/cafes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      tipo: formData.get("tipo"),
      cucharaditas: Number(formData.get("cucharaditas")),
      lugar: formData.get("lugar"),
      nota: formData.get("nota") || null,
    }),
  });

  if (res.status === 422) {
    const { errors } = await res.json();
    return { errores: Object.values(errors).flat() };
  }
  if (!res.ok) return { errores: ["No se pudo guardar el café"] };

  redirect("/");
}
