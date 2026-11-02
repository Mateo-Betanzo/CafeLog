import { apiGet } from "../lib/api";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

/** Porcentaje de naranja de cada nivel (0 = sin cafés), mezclado con el color del borde. */
const NIVELES = [0, 30, 55, 80, 100];

/**
 * Color de una celda según su nivel.
 *
 * @param {number} nivel De 0 a 4.
 * @returns {string} Valor CSS para `backgroundColor`.
 */
const color = (nivel) =>
  `color-mix(in srgb, var(--color-acento) ${NIVELES[nivel]}%, var(--color-borde))`;

/**
 * Mapa de calor estilo LeetCode: una celda por día de los últimos 365 días,
 * agrupadas en un bloque por mes (7 filas, lunes a domingo) con el nombre del
 * mes debajo. Cada celda dice su día exacto al pasar el mouse.
 *
 * @returns {Promise<JSX.Element>}
 */
export default async function Calor() {
  const dias = (await apiGet("/cafes/calor"))?.dias;

  if (!dias) {
    return <p className="text-red-400">No se pudo cargar el mapa de calor</p>;
  }

  const maximo = Math.max(...dias.map((d) => d.total), 1);
  const nivel = (total) => (total === 0 ? 0 : Math.ceil((total / maximo) * 4));

  // Un bloque por mes, del más viejo al más nuevo.
  const meses = Object.entries(Object.groupBy(dias, (d) => d.fecha.slice(0, 7)));
  const total = dias.reduce((suma, d) => suma + d.total, 0);

  return (
    <section className="mt-4 rounded-2xl border border-borde bg-tarjeta p-6">
      <h2 className="text-sm text-zinc-400">
        {total} {total === 1 ? "café" : "cafés"} en el último año
      </h2>
      <div className="mt-6 overflow-x-auto pb-2">
        <div className="flex w-max gap-2.5">
          {meses.map(([mes, delMes]) => {
            // Celdas vacías antes del primer día para que caiga en su fila (lunes = 0).
            const relleno = (new Date(delMes[0].fecha).getUTCDay() + 6) % 7;
            const semanas = Math.ceil((relleno + delMes.length) / 7);

            return (
              <div key={mes} className="flex flex-col items-center gap-2">
                <div
                  className="grid grid-flow-col grid-rows-7 gap-[2px]"
                  style={{ gridTemplateColumns: `repeat(${semanas}, 10px)` }}
                >
                  {Array.from({ length: relleno }, (_, i) => (
                    <div key={`v${i}`} />
                  ))}
                  {delMes.map((d) => (
                    <div
                      key={d.fecha}
                      title={`${d.total} ${d.total === 1 ? "café" : "cafés"} el ${new Date(d.fecha).toLocaleDateString("es-AR", { weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}`}
                      className="h-2.5 w-2.5 rounded-sm"
                      style={{ backgroundColor: color(nivel(d.total)) }}
                    />
                  ))}
                </div>
                <span className="text-xs text-zinc-400">{MESES[Number(mes.slice(5)) - 1]}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-end gap-1 text-xs text-zinc-400">
        Menos
        {NIVELES.map((_, n) => (
          <div key={n} className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color(n) }} />
        ))}
        Más
      </div>
    </section>
  );
}
