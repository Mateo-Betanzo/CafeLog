import { notFound } from "next/navigation";
import { Suspense } from "react";
import Tarjeta from "../../componentes/tarjeta";
import Volver from "../../componentes/volver";
import { fechaCorta } from "../../lib/fechas";

/**
 * Pide a la API el detalle de un café.
 *
 * @param {string} id Id del café.
 * @returns {Promise<object | null>} El café, o `null` si la API no responde.
 *   Si el café no existe, dispara `notFound()`.
 */
async function obtenerCafe(id) {
  let res;
  try {
    res = await fetch(`${process.env.API_URL}/api/cafes/${id}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
  } catch {
    return null;
  }
  if (res.status === 404) notFound();
  return res.ok ? await res.json() : null;
}

/**
 * Tarjeta con el detalle de un café (Server Component).
 *
 * @param {{params: Promise<{id: string}>}} props
 * @returns {Promise<JSX.Element>}
 */
async function Detalle({ params }) {
  const { id } = await params;
  const cafe = await obtenerCafe(id);

  if (!cafe) {
    return <p className="text-red-400">No se pudo cargar el café</p>;
  }

  return (
    <Tarjeta>
      <h1 className="text-3xl font-semibold capitalize">{cafe.tipo}</h1>
      <p className="mt-1 text-sm text-zinc-400">{fechaCorta(cafe.created_at)}</p>
      <dl className="mt-6 grid grid-cols-3 gap-4 text-sm">
        <div>
          <dt className="text-zinc-400">Café</dt>
          <dd className="text-xl">{cafe.cafe_ml} ml</dd>
        </div>
        <div>
          <dt className="text-zinc-400">Leche</dt>
          <dd className="text-xl">{cafe.leche_ml} ml</dd>
        </div>
        <div>
          <dt className="text-zinc-400">Azúcar</dt>
          <dd className="text-xl">
            {cafe.azucar_g} g
            <span className="ml-1 text-sm text-zinc-400">
              ({cafe.cucharaditas} cdta.)
            </span>
          </dd>
        </div>
      </dl>
      {cafe.nota && (
        <p className="mt-6 border-t border-borde pt-4 text-zinc-300">
          {cafe.nota}
        </p>
      )}
    </Tarjeta>
  );
}

/**
 * Página `/cafes/[id]`: detalle de un café.
 *
 * @param {{params: Promise<{id: string}>}} props
 * @returns {JSX.Element}
 */
export default function Page({ params }) {
  return (
    <main className="mx-auto w-full max-w-md p-6">
      <Volver className="mb-4" />
      <Suspense fallback={<p className="text-zinc-400">Cargando…</p>}>
        <Detalle params={params} />
      </Suspense>
    </main>
  );
}
