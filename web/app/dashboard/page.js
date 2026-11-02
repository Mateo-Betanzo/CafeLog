import { Suspense } from "react";
import Filtros from "./filtros";
import Calor from "./calor";
import Graficos from "./graficos";
import Encabezado from "../componentes/encabezado";

/**
 * Página `/dashboard`: consumo de la semana, el mes o el año actual.
 *
 * @param {{searchParams: Promise<{periodo?: string}>}} props
 * @returns {JSX.Element}
 */
export default function Dashboard({ searchParams }) {
  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <Encabezado titulo="Dashboard" className="mb-4" />
      <div className="mb-6">
        <Suspense>
          <Filtros />
        </Suspense>
      </div>
      <Suspense fallback={<p className="text-zinc-400">Cargando…</p>}>
        <Graficos searchParams={searchParams} />
      </Suspense>
      <Suspense>
        <Calor />
      </Suspense>
    </main>
  );
}
