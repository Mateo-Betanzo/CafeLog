"use client";

import { useActionState, useRef, useState } from "react";
import Icono from "../../componentes/icono";
import { eliminarCafe } from "./actions";

/**
 * Botón "Eliminar" que se acciona manteniéndolo apretado: mientras se aprieta se va
 * llenando de izquierda a derecha (animación `llenando`, 0,5 s) y al completarse borra el café.
 * Soltarlo antes, sacar el puntero o perder el foco cancela. También funciona con Enter o Espacio.
 *
 * @param {{id: string}} props Id del café a borrar.
 * @returns {JSX.Element}
 */
export default function BotonEliminar({ id }) {
  const [apretando, setApretando] = useState(false);
  const [estado, accion, pendiente] = useActionState(eliminarCafe.bind(null, id), null);
  const formulario = useRef(null);

  const empezar = () => !pendiente && setApretando(true);
  const cancelar = () => setApretando(false);
  const alTeclear = (apretar) => (evento) => {
    if (evento.key !== "Enter" && evento.key !== " ") return;
    evento.preventDefault();
    if (!evento.repeat) apretar ? empezar() : cancelar();
  };

  return (
    <form ref={formulario} action={accion} className="flex flex-col gap-2">
      <button
        type="button"
        aria-label="Eliminar (mantené apretado)"
        onPointerDown={empezar}
        onPointerUp={cancelar}
        onPointerLeave={cancelar}
        onPointerCancel={cancelar}
        onKeyDown={alTeclear(true)}
        onKeyUp={alTeclear(false)}
        onBlur={cancelar}
        onContextMenu={(evento) => evento.preventDefault()}
        className="boton relative inline-flex touch-none select-none items-center gap-2 overflow-hidden text-red-400"
      >
        {(apretando || pendiente) && (
          <span
            aria-hidden="true"
            onAnimationEnd={() => formulario.current.requestSubmit()}
            className="llenando absolute inset-y-0 left-0 bg-red-500/30"
          />
        )}
        <span className="relative inline-flex items-center gap-2">
          <Icono nombre="trash" className="h-5 w-5" />
          Eliminar
        </span>
      </button>
      {estado?.error && <p className="text-sm text-red-400">{estado.error}</p>}
    </form>
  );
}
