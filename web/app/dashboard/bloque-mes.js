import { fechaLarga } from "../lib/fechas";
import { cafes } from "../lib/formato";
import { colorNivel, nivel } from "./niveles";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

/**
 * Bloque de un mes del mapa de calor: 7 filas (lunes a domingo), una celda por
 * día y el nombre del mes debajo.
 *
 * @param {{mes: string, dias: {fecha: string, total: number}[], maximo: number}} props
 *   `mes` es `YYYY-MM`.
 * @returns {JSX.Element}
 */
export default function BloqueMes({ mes, dias, maximo }) {
  // Celdas vacías antes del primer día para que caiga en su fila (lunes = 0).
  const relleno = (new Date(dias[0].fecha).getUTCDay() + 6) % 7;
  const semanas = Math.ceil((relleno + dias.length) / 7);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className="grid grid-flow-col grid-rows-7 gap-[2px]"
        style={{ gridTemplateColumns: `repeat(${semanas}, 10px)` }}
      >
        {Array.from({ length: relleno }, (_, i) => (
          <div key={`v${i}`} />
        ))}
        {dias.map((d) => (
          <div
            key={d.fecha}
            title={`${d.total} ${cafes(d.total)} el ${fechaLarga(d.fecha)}`}
            className="h-2.5 w-2.5 rounded-sm"
            style={{ backgroundColor: colorNivel(nivel(d.total, maximo)) }}
          />
        ))}
      </div>
      <span className="text-xs text-zinc-400">{MESES[Number(mes.slice(5)) - 1]}</span>
    </div>
  );
}
