import { fechaLarga } from "../lib/fechas";
import { cafes } from "../lib/formato";

const MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

/** Porcentaje de naranja de cada nivel (0 = sin cafés), mezclado con el color del borde. */
export const NIVELES = [0, 30, 55, 80, 100];

/**
 * Nivel de intensidad de un día, de 0 (sin cafés) a 4 (el día con más cafés).
 *
 * @param {number} total Cafés del día.
 * @param {number} maximo Cafés del día más alto.
 * @returns {number}
 */
export const nivel = (total, maximo) => (total === 0 ? 0 : Math.ceil((total / maximo) * 4));

/**
 * Color de una celda según su nivel.
 *
 * @param {number} n Nivel de 0 a 4.
 * @returns {string} Valor CSS para `backgroundColor`.
 */
export const colorNivel = (n) =>
  `color-mix(in srgb, var(--color-acento) ${NIVELES[n]}%, var(--color-borde))`;

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
