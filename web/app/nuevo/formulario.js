"use client";

import { useActionState } from "react";
import { crearCafe } from "./actions";
import Tarjeta from "../componentes/tarjeta";

/** Tipos de café disponibles; deben coincidir con los de la API. */
const TIPOS = ["espresso", "americano", "cortado", "latte", "capuchino"];
const campo =
  "w-full rounded-xl border border-borde bg-fondo px-3 py-2 text-white";

/**
 * Formulario de carga de un café (Client Component).
 *
 * @returns {JSX.Element}
 */
export default function Formulario() {
  const [estado, accion, pendiente] = useActionState(crearCafe, null);

  return (
    <Tarjeta as="form" action={accion} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-zinc-400">
        Tipo
        <select name="tipo" required className={campo}>
          {TIPOS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm text-zinc-400">
        Cucharaditas de azúcar
        <input
          name="cucharaditas"
          type="number"
          min="0"
          max="10"
          defaultValue="0"
          required
          className={campo}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-zinc-400">
        Nota (opcional)
        <textarea name="nota" rows="3" className={campo} />
      </label>
      {estado?.errores && (
        <ul className="text-sm text-red-400">
          {estado.errores.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      )}
      <button
        disabled={pendiente}
        className="rounded-xl bg-acento px-5 py-3 font-medium text-black disabled:opacity-50"
      >
        Guardar
      </button>
    </Tarjeta>
  );
}
