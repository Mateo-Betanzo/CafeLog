"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import Tarjeta from "../componentes/tarjeta";
import { cargarMas } from "./actions";

/**
 * Fecha y hora cortas en horario de Buenos Aires, por ejemplo "2/11/26, 2:34 p. m.".
 *
 * @param {string} iso Fecha ISO de la API.
 * @returns {string}
 */
const fechaCorta = (iso) =>
  new Date(iso).toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    dateStyle: "short",
    timeStyle: "short",
  });

/**
 * Lista de cafés con scroll infinito (Client Component). Muestra la primera
 * tanda que trae el servidor y pide las siguientes con la Server Action
 * `cargarMas` cuando el final de la lista entra en pantalla.
 *
 * @param {{inicial: object[], ultimaPagina: number}} props Primera tanda y número de la última tanda.
 * @returns {JSX.Element}
 */
export default function ListaInfinita({ inicial, ultimaPagina }) {
  const [cafes, setCafes] = useState(inicial);
  const [pagina, setPagina] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);
  const centinela = useRef(null);
  const hayMas = pagina < ultimaPagina;

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(false);
    const respuesta = await cargarMas(pagina + 1);
    if (respuesta) {
      // Sin repetidos, por si se cargó un café nuevo mientras se hacía scroll.
      setCafes((actuales) => {
        const ids = new Set(actuales.map((c) => c.id));
        return [...actuales, ...respuesta.cafes.filter((c) => !ids.has(c.id))];
      });
      setPagina((p) => p + 1);
    } else {
      setError(true);
    }
    setCargando(false);
  }, [pagina]);

  useEffect(() => {
    if (!hayMas || cargando || error) return;
    const observador = new IntersectionObserver(
      ([entrada]) => entrada.isIntersecting && cargar(),
      { rootMargin: "200px" },
    );
    observador.observe(centinela.current);
    return () => observador.disconnect();
  }, [hayMas, cargando, error, cargar]);

  return (
    <>
      <ul className="flex flex-col gap-3">
        {cafes.map((c) => (
          <li key={c.id}>
            <Link href={`/cafes/${c.id}`} className="block">
              <Tarjeta className="flex items-center justify-between gap-4 !p-4">
                <div>
                  <p className="font-medium capitalize">{c.tipo}</p>
                  <p className="text-sm text-zinc-400">{fechaCorta(c.created_at)}</p>
                </div>
                <p className="text-right text-sm text-zinc-400">
                  {c.cafe_ml} ml café · {c.leche_ml} ml leche · {c.azucar_g} g azúcar
                </p>
              </Tarjeta>
            </Link>
          </li>
        ))}
      </ul>
      <div ref={centinela} className="py-6 text-center text-sm text-zinc-400">
        {error ? (
          <>
            <p className="text-red-400">No se pudo cargar</p>
            <button onClick={cargar} className="mt-2 rounded-xl bg-acento px-4 py-2 font-medium text-black">
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
