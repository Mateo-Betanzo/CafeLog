"use client";

import { useScrollInfinito } from "../lib/use-scroll-infinito";
import { cargarMas } from "./actions";
import FilaCafe from "./fila-cafe";

/**
 * Lista de cafés con scroll infinito (Client Component). Muestra la primera
 * tanda que trae el servidor y pide las siguientes con la Server Action
 * `cargarMas` cuando el final de la lista entra en pantalla.
 *
 * @param {{inicial: object[], ultimaPagina: number}} props Primera tanda y número de la última tanda.
 * @returns {JSX.Element}
 */
export default function ListaInfinita({ inicial, ultimaPagina }) {
  const { items, cargando, error, hayMas, centinela, reintentar } = useScrollInfinito({
    inicial,
    ultimaPagina,
    cargarMas,
  });

  return (
    <>
      <ul className="flex flex-col gap-3">
        {items.map((cafe) => (
          <li key={cafe.id}>
            <FilaCafe cafe={cafe} />
          </li>
        ))}
      </ul>
      <div ref={centinela} className="py-6 text-center text-sm text-zinc-400">
        {error ? (
          <>
            <p className="text-red-400">No se pudo cargar</p>
            <button onClick={reintentar} className="mt-2 rounded-xl bg-acento px-4 py-2 font-medium text-black">
              Reintentar
            </button>
          </>
        ) : cargando ? (
          "Cargando…"
        ) : (
          !hayMas && "No hay más cafés"
        )}
      </div>
    </>
  );
}
