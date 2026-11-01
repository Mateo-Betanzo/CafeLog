import Link from "next/link";
import { Suspense } from "react";

/**
 * Pide a la API los totales de los últimos 10 días.
 *
 * @returns {Promise<{fecha: string, cafe_ml: number, leche_ml: number, azucar_g: number}[] | null>}
 *   Los días, o `null` si la API no responde.
 */
async function obtenerDias() {
  try {
    const res = await fetch(`${process.env.API_URL}/api/cafes/resumen`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    return res.ok ? (await res.json()).dias : null;
  } catch {
    return null;
  }
}

/**
 * Tarjeta con el total y las barras de una medida, una barra por día.
 * La altura de cada barra es proporcional al día más alto de la tarjeta.
 *
 * @param {{titulo: string, unidad: string, campo: string, dias: object[]}} props
 * @returns {JSX.Element}
 */
function Grafico({ titulo, unidad, campo, dias }) {
  const total = dias.reduce((suma, d) => suma + d[campo], 0);
  const maximo = Math.max(...dias.map((d) => d[campo]), 1);

  return (
    <section className="rounded-2xl border border-borde bg-tarjeta p-6">
      <h2 className="text-sm text-zinc-400">{titulo}</h2>
      <p className="mt-2 text-5xl font-light">
        {total}
        <span className="ml-2 text-base text-zinc-400">{unidad}</span>
      </p>
      <div className="mt-6 flex h-32 items-end gap-2">
        {dias.map((d) => (
          <div
            key={d.fecha}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1"
          >
            <div
              title={`${d.fecha}: ${d[campo]} ${unidad}`}
              className="w-full rounded-t bg-acento"
              style={{ height: `${Math.max((d[campo] / maximo) * 100, 2)}%` }}
            />
            <span className="text-xs text-zinc-400">
              {new Date(d.fecha).toLocaleDateString("es-AR", {
                weekday: "narrow",
                timeZone: "UTC",
              })}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/**
 * Las tres tarjetas del dashboard: café, leche y azúcar (Server Component).
 *
 * @returns {Promise<JSX.Element>}
 */
async function Graficos() {
  const dias = await obtenerDias();

  if (!dias) {
    return <p className="text-red-400">No se pudo cargar el dashboard</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Grafico titulo="Café" unidad="ml" campo="cafe_ml" dias={dias} />
      <Grafico titulo="Leche" unidad="ml" campo="leche_ml" dias={dias} />
      <Grafico titulo="Azúcar" unidad="g" campo="azucar_g" dias={dias} />
    </div>
  );
}

/**
 * Página `/dashboard`: consumo de los últimos 10 días.
 *
 * @returns {JSX.Element}
 */
export default function Dashboard() {
  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <Link href="/" className="text-sm text-zinc-400">
        ← Volver
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold">
        Últimos 10 días
      </h1>
      <Suspense fallback={<p className="text-zinc-400">Cargando…</p>}>
        <Graficos />
      </Suspense>
    </main>
  );
}
