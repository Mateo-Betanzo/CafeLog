"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

/** Periodos del filtro; `valor` es el que entiende la API. */
const PERIODOS = [
  { valor: "semana", nombre: "Semana" },
  { valor: "mes", nombre: "Mes" },
  { valor: "anio", nombre: "Año" },
];

/**
 * Pestañas para elegir el periodo del dashboard (Client Component).
 * Guarda la elección en `?periodo=` y marca la pestaña activa.
 *
 * @returns {JSX.Element}
 */
export default function Filtros() {
  const activo = useSearchParams().get("periodo") ?? "semana";

  return (
    <nav className="inline-flex gap-1 rounded-xl border border-borde bg-tarjeta p-1 text-sm">
      {PERIODOS.map(({ valor, nombre }) => (
        <Link
          key={valor}
          href={`/dashboard?periodo=${valor}`}
          className={`rounded-lg px-4 py-1.5 ${
            activo === valor ? "bg-acento text-black" : "text-zinc-400"
          }`}
        >
          {nombre}
        </Link>
      ))}
    </nav>
  );
}
