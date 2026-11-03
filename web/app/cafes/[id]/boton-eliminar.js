"use client";

import { useActionState, useState } from "react";
import { eliminarCafe } from "./actions";

/**
 * Botón "Eliminar" con confirmación en dos pasos: al tocarlo pide confirmar o cancelar.
 *
 * @param {{id: string}} props Id del café a borrar.
 * @returns {JSX.Element}
 */
export default function BotonEliminar({ id }) {
  const [confirmando, setConfirmando] = useState(false);
  const [estado, accion, pendiente] = useActionState(eliminarCafe.bind(null, id), null);

  if (!confirmando) {
    return (
      <button type="button" onClick={() => setConfirmando(true)} className="boton text-red-400">
        Eliminar
      </button>
    );
  }

  return (
    <form action={accion} className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-zinc-300">¿Eliminar este café?</span>
      <button disabled={pendiente} className="boton text-red-400">
        Confirmar
      </button>
      <button type="button" onClick={() => setConfirmando(false)} className="boton">
        Cancelar
      </button>
      {estado?.error && <p className="w-full text-sm text-red-400">{estado.error}</p>}
    </form>
  );
}
