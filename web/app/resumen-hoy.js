import { apiGet } from "./lib/api";

/**
 * Tarjeta con los cafés de hoy (Server Component).
 *
 * @returns {Promise<JSX.Element>}
 */
export default async function ResumenHoy() {
  const hoy = await apiGet("/cafes/hoy");

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
