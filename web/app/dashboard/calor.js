import Tarjeta from "../componentes/tarjeta";
import { apiGet } from "../lib/api";
import { cafes } from "../lib/formato";
import BloqueMes, { NIVELES, colorNivel } from "./bloque-mes";

/**
 * Mapa de calor estilo LeetCode: una celda por día de los últimos 365 días,
 * agrupadas en un bloque por mes.
 *
 * @returns {Promise<JSX.Element>}
 */
export default async function Calor() {
  const dias = (await apiGet("/cafes/calor"))?.dias;

  if (!dias) {
    return <p className="text-red-400">No se pudo cargar el mapa de calor</p>;
  }

  const maximo = Math.max(...dias.map((d) => d.total), 1);
  const total = dias.reduce((suma, d) => suma + d.total, 0);

  // Un bloque por mes, del más viejo al más nuevo.
  const meses = Object.entries(Object.groupBy(dias, (d) => d.fecha.slice(0, 7)));

  return (
    <Tarjeta className="mt-4">
      <h2 className="text-sm text-zinc-400">
        {total} {cafes(total)} en el último año
      </h2>
      <div className="mt-6 overflow-x-auto pb-2">
        <div className="flex w-max gap-2.5">
          {meses.map(([mes, delMes]) => (
            <BloqueMes key={mes} mes={mes} dias={delMes} maximo={maximo} />
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-end gap-1 text-xs text-zinc-400">
        Menos
        {NIVELES.map((_, n) => (
          <div key={n} className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: colorNivel(n) }} />
        ))}
        Más
      </div>
    </Tarjeta>
  );
}
