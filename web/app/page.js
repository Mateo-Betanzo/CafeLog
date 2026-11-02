import Link from "next/link";
import { Suspense } from "react";
import ResumenHoy from "./resumen-hoy";

/**
 * Página de inicio: cafés de hoy y acceso al formulario de carga.
 *
 * @returns {JSX.Element}
 */
export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <h1 className="text-3xl font-semibold">CafeLog</h1>

      <Suspense
        fallback={<p className="mt-6 text-zinc-400">Cargando…</p>}
      >
        <ResumenHoy />
      </Suspense>

      <div className="mt-6 flex gap-3">
        <Link
          href="/nuevo"
          className="rounded-2xl bg-acento px-5 py-3 font-medium text-black"
        >
          Agregar café
        </Link>
      </div>
    </main>
  );
}
