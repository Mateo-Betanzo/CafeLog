"use client";

import { agruparPorDia, tituloDia } from "../lib/fechas";
import { useScrollInfinito } from "../lib/use-scroll-infinito";
import { cargarMas } from "./actions";
import FilaCafe from "./fila-cafe";

/**
 * Lista de cafés con scroll infinito (Client Component), agrupada por día: cada
 * día es un título con sus tarjetas debajo. Muestra la primera
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
      {agruparPorDia(items).map((grupo) => (
        <section key={grupo.dia} className="mb-6">
          <h2 className="mb-3 text-sm text-zinc-400">{tituloDia(grupo.dia)}</h2>
          <ul className="flex flex-col gap-3">
            {grupo.cafes.map((cafe) => (
              <li key={cafe.id}>
                <FilaCafe cafe={cafe} />
              </li>
            ))}
          </ul>
        </section>
      ))}
      <div ref={centinela} className="py-6 text-center text-sm text-zinc-400">
        {error ? (
          <>
            <p className="text-red-400">No se pudo cargar</p>
            <button onClick={reintentar} className="boton mt-2">
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
