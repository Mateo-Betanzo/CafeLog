"use client";

import { useActionState } from "react";
import { crearCafe } from "./actions";
import Tarjeta from "../componentes/tarjeta";

const campo =
  "w-full rounded-lg border border-borde bg-fondo px-4 py-3 text-white";

/**
 * Formulario de carga de un café (Client Component).
 *
 * @param {{tipos: string[], maxCucharaditas: number}} props Lo que acepta la API.
 * @returns {JSX.Element}
 */
export default function Formulario({ tipos, maxCucharaditas }) {
  const [estado, accion, pendiente] = useActionState(crearCafe, null);

  return (
    <Tarjeta as="form" action={accion} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-zinc-400">
        Tipo
        <select name="tipo" required className={campo}>
          {tipos.map((t) => (
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
          max={maxCucharaditas}
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
        className="boton bg-white text-black hover:bg-zinc-200"
      >
        Guardar
      </button>
    </Tarjeta>
  );
}
