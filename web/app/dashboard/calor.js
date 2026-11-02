import { apiGet } from "../lib/api";

const DIAS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

/**
 * Mapa de calor del año: cafés por día de la semana (filas) y mes (columnas).
 * La intensidad de cada celda es proporcional a la más alta; las vacías quedan apagadas.
 *
 * @returns {Promise<JSX.Element>}
 */
export default async function Calor() {
  const datos = await apiGet("/cafes/calor");

  if (!datos) {
    return <p className="text-red-400">No se pudo cargar el mapa de calor</p>;
  }

  const { anio, filas } = datos;
  const maximo = Math.max(...filas.flat(), 1);

  return (
    <section className="mt-4 rounded-2xl border border-borde bg-tarjeta p-6">
      <h2 className="text-sm text-zinc-400">Cafés por día y mes · {anio}</h2>
      <div className="mt-6 grid grid-cols-[auto_repeat(12,minmax(0,1fr))] gap-1 text-xs text-zinc-400">
        <span />
        {MESES.map((mes) => (
          <span key={mes} className="text-center">
            {mes}
          </span>
        ))}
        {filas.map((fila, d) => [
          <span key={`d${d}`} className="pr-2 leading-8">
            {DIAS[d]}
          </span>,
          ...fila.map((total, m) => (
            <div
              key={`${d}-${m}`}
              title={`${DIAS[d]} de ${MESES[m]}: ${total} ${total === 1 ? "café" : "cafés"}`}
              className="h-8 rounded"
              style={{
                backgroundColor: `color-mix(in srgb, var(--color-acento) ${(total / maximo) * 100}%, var(--color-borde))`,
              }}
            />
          )),
        ])}
      </div>
    </section>
  );
}
