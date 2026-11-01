import Link from "next/link";
import { Suspense } from "react";
import Filtros from "./filtros";

/** Periodos que acepta la API; cualquier otro valor usa la semana. */
const PERIODOS = ["semana", "mes", "anio"];

/**
 * Pide a la API los totales por barra del periodo elegido.
 *
 * @param {string} periodo `semana`, `mes` o `anio`.
 * @returns {Promise<{fecha: string, cafe_ml: number, leche_ml: number, azucar_g: number}[] | null>}
 *   Las barras, o `null` si la API no responde.
 */
async function obtenerBarras(periodo) {
  try {
    const res = await fetch(`${process.env.API_URL}/api/cafes/resumen?periodo=${periodo}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    return res.ok ? (await res.json()).barras : null;
  } catch {
    return null;
  }
}

/**
 * Etiqueta que va debajo de una barra: inicial del día (semana), número del
 * día cada 5 barras (mes) o inicial del mes (año).
 *
 * @param {string} fecha `YYYY-MM-DD` o `YYYY-MM` (año).
 * @param {string} periodo `semana`, `mes` o `anio`.
 * @returns {string}
 */
function etiqueta(fecha, periodo) {
  const dia = Number(fecha.slice(8, 10));
  if (periodo === "mes") return dia === 1 || dia % 5 === 0 ? String(dia) : "";
  return new Date(fecha).toLocaleDateString("es-AR", {
    [periodo === "anio" ? "month" : "weekday"]: "narrow",
    timeZone: "UTC",
  });
}

/**
 * Tarjeta con el total y las barras de una medida.
 * La altura de cada barra es proporcional a la más alta de la tarjeta.
 *
 * @param {{titulo: string, unidad: string, campo: string, barras: object[], periodo: string}} props
 * @returns {JSX.Element}
 */
function Grafico({ titulo, unidad, campo, barras, periodo }) {
  const total = barras.reduce((suma, b) => suma + b[campo], 0);
  const maximo = Math.max(...barras.map((b) => b[campo]), 1);

  return (
    <section className="rounded-2xl border border-borde bg-tarjeta p-6">
      <h2 className="text-sm text-zinc-400">{titulo}</h2>
      <p className="mt-2 text-5xl font-light">
        {total}
        <span className="ml-2 text-base text-zinc-400">{unidad}</span>
      </p>
      <div className={`mt-6 flex h-32 items-end ${periodo === "mes" ? "gap-0.5" : "gap-2"}`}>
        {barras.map((d) => (
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
              {etiqueta(d.fecha, periodo)}
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
 * @param {{searchParams: Promise<{periodo?: string}>}} props
 * @returns {Promise<JSX.Element>}
 */
async function Graficos({ searchParams }) {
  const { periodo: pedido } = await searchParams;
  const periodo = PERIODOS.includes(pedido) ? pedido : "semana";
  const barras = await obtenerBarras(periodo);

  if (!barras) {
    return <p className="text-red-400">No se pudo cargar el dashboard</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Grafico titulo="Café" unidad="ml" campo="cafe_ml" barras={barras} periodo={periodo} />
      <Grafico titulo="Leche" unidad="ml" campo="leche_ml" barras={barras} periodo={periodo} />
      <Grafico titulo="Azúcar" unidad="g" campo="azucar_g" barras={barras} periodo={periodo} />
    </div>
  );
}

/**
 * Página `/dashboard`: consumo de la semana, el mes o el año actual.
 *
 * @param {{searchParams: Promise<{periodo?: string}>}} props
 * @returns {JSX.Element}
 */
export default function Dashboard({ searchParams }) {
  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <Link href="/" className="text-sm text-zinc-400">
        ← Volver
      </Link>
      <h1 className="mb-4 mt-2 text-2xl font-semibold">Dashboard</h1>
      <div className="mb-6">
        <Suspense>
          <Filtros />
        </Suspense>
      </div>
      <Suspense fallback={<p className="text-zinc-400">Cargando…</p>}>
        <Graficos searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
