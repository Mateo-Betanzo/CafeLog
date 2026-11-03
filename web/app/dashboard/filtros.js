"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PERIODOS } from "./periodos";

/**
 * Pestañas para elegir el periodo del dashboard (Client Component).
 * Guarda la elección en `?periodo=` y marca la pestaña activa.
 *
 * @returns {JSX.Element}
 */
export default function Filtros() {
  const activo = useSearchParams().get("periodo") ?? "semana";

  return (
    <nav className="inline-flex gap-1 rounded-full border border-borde bg-black p-1 text-sm">
      {Object.entries(PERIODOS).map(([valor, { nombre }]) => (
        <Link
          key={valor}
          href={`/dashboard?periodo=${valor}`}
          className={`rounded-full px-4 py-2 ${
            activo === valor ? "bg-white/10 text-white" : "text-zinc-400"
          }`}
        >
          {nombre}
        </Link>
      ))}
    </nav>
  );
}
