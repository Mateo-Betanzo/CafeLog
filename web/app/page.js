import Link from "next/link";
import { Suspense } from "react";

/**
 * Pide a la API el resumen de los cafés de hoy.
 *
 * @returns {Promise<{total: number, cafe_ml: number, leche_ml: number, azucar_g: number} | null>}
 *   El resumen, o `null` si la API no responde.
 */
async function obtenerHoy() {
  try {
    const res = await fetch(`${process.env.API_URL}/api/cafes/hoy`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}

/**
 * Tarjeta con los cafés de hoy (Server Component).
 *
 * @returns {Promise<JSX.Element>}
 */
async function ResumenHoy() {
  const hoy = await obtenerHoy();

  return (
    <section className="mt-6 rounded-2xl border border-borde bg-tarjeta p-6">
      <h2 className="text-sm text-zinc-400">Hoy</h2>
      {hoy ? (
        <>
          <p className="mt-2 text-7xl font-light">
            {hoy.total}
            <span className="ml-2 text-base text-zinc-400">
              {hoy.total === 1 ? "café" : "cafés"}
            </span>
          </p>
          <dl className="mt-6 grid grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-zinc-400">Café</dt>
              <dd className="text-xl">{hoy.cafe_ml} ml</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Leche</dt>
              <dd className="text-xl">{hoy.leche_ml} ml</dd>
            </div>
            <div>
              <dt className="text-zinc-400">Azúcar</dt>
              <dd className="text-xl">{hoy.azucar_g} g</dd>
            </div>
          </dl>
        </>
      ) : (
        <p className="mt-2 text-red-400">No se pudo cargar el resumen</p>
      )}
    </section>
  );
}

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
        <Link
          href="/dashboard"
          className="rounded-2xl border border-borde bg-tarjeta px-5 py-3 font-medium"
        >
          Dashboard
        </Link>
      </div>
    </main>
  );
}
