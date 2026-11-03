import Link from "next/link";
import { Suspense } from "react";
import Icono from "../../componentes/icono";
import Tarjeta from "../../componentes/tarjeta";
import Encabezado from "../../componentes/encabezado";
import { fechaCorta } from "../../lib/fechas";
import { obtenerCafe } from "../obtener-cafe";
import BotonEliminar from "./boton-eliminar";

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
      <h2 className="text-3xl font-semibold capitalize">{cafe.tipo}</h2>
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
      <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-borde pt-4">
        <Link href={`/cafes/${id}/editar`} className="boton inline-flex items-center gap-2">
          <Icono nombre="edit-pencil" className="h-5 w-5" />
          Editar
        </Link>
        <BotonEliminar id={id} />
      </div>
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
      <Encabezado titulo="Detalle" className="mb-4" />
      <Suspense fallback={<p className="text-zinc-400">Cargando…</p>}>
        <Detalle params={params} />
      </Suspense>
    </main>
  );
}
