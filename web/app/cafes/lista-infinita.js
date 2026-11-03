"use client";

import { agruparPorDia, tituloDia } from "../lib/fechas";
import { useScrollInfinito } from "../lib/use-scroll-infinito";
import { cargarMas } from "./actions";
import FilaCafe from "./fila-cafe";

/**
 * Pie de la lista: botón para reintentar si falló, "Cargando…" mientras pide
 * una tanda o "No hay más cafés" al llegar al final.
 *
 * @param {{error: boolean, cargando: boolean, hayMas: boolean, reintentar: () => void}} props
 * @returns {JSX.Element | string | null}
 */
function Pie({ error, cargando, hayMas, reintentar }) {
  if (error) {
    return (
      <>
        <p className="text-red-400">No se pudo cargar</p>
        <button onClick={reintentar} className="boton mt-2">
          Reintentar
        </button>
      </>
    );
  }
  if (cargando) return "Cargando…";
  return hayMas ? null : "No hay más cafés";
}

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
        <Pie error={error} cargando={cargando} hayMas={hayMas} reintentar={reintentar} />
      </div>
    </>
  );
}
