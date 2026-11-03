"use client";

import { useActionState } from "react";
import Tarjeta from "../componentes/tarjeta";

const campo =
  "w-full rounded-lg border border-borde bg-fondo px-4 py-3 text-white";

/**
 * Formulario de un café (Client Component), para crear uno o para editar uno existente.
 *
 * @param {{tipos: string[], maxCucharaditas: number, accion: (estado: object | null, formData: FormData) => Promise<object>,
 *   cafe?: {tipo: string, cucharaditas: number, nota: string | null}}} props
 *   `tipos` y `maxCucharaditas` son lo que acepta la API; `accion` es la Server Action que guarda;
 *   `cafe` (opcional) son los valores con los que arranca el formulario al editar.
 * @returns {JSX.Element}
 */
export default function Formulario({ tipos, maxCucharaditas, accion: guardar, cafe }) {
  const [estado, accion, pendiente] = useActionState(guardar, null);

  return (
    <Tarjeta as="form" action={accion} className="flex flex-col gap-4">
      <label className="flex flex-col gap-1 text-sm text-zinc-400">
        Tipo
        <select name="tipo" required defaultValue={cafe?.tipo} className={campo}>
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
          defaultValue={cafe?.cucharaditas ?? 0}
          required
          className={campo}
        />
      </label>
      <label className="flex flex-col gap-1 text-sm text-zinc-400">
        Nota (opcional)
        <textarea name="nota" rows="3" defaultValue={cafe?.nota ?? ""} className={campo} />
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
