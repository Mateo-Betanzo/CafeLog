import { dia } from "../lib/fechas.js";

/** Inicial del día de la semana o del mes de una fecha `YYYY-MM-DD` o `YYYY-MM`. */
const inicial = (campo) => (fecha) =>
  new Date(fecha).toLocaleDateString("es-AR", { [campo]: "narrow", timeZone: "UTC" });

/**
 * Periodos del dashboard. La clave es el valor que entiende la API (`?periodo=`).
 *
 * - `nombre`: texto de la pestaña del filtro.
 * - `porCada`: cada cuánto se calcula el promedio ("día" o "mes").
 * - `gap`: separación entre barras.
 * - `etiqueta`: texto debajo de una barra a partir de su fecha.
 * - `limite`: a partir del día de hoy (`YYYY-MM-DD`), la última fecha que ya pasó.
 */
export const PERIODOS = {
  semana: { nombre: "Semana", porCada: "día", gap: "gap-2", etiqueta: inicial("weekday"), limite: (hoy) => hoy },
  mes: {
    nombre: "Mes",
    porCada: "día",
    gap: "gap-0.5",
    etiqueta: (fecha) => {
      const numero = Number(fecha.slice(8, 10));
      return numero === 1 || numero % 5 === 0 ? String(numero) : "";
    },
    limite: (hoy) => hoy,
  },
  anio: { nombre: "Año", porCada: "mes", gap: "gap-2", etiqueta: inicial("month"), limite: (hoy) => hoy.slice(0, 7) },
};

/**
 * Periodo que se usa para un valor pedido: el mismo si la API lo acepta, si no `semana`.
 *
 * @param {string | undefined} pedido
 * @returns {keyof typeof PERIODOS}
 */
export const periodoValido = (pedido) => (Object.hasOwn(PERIODOS, pedido) ? pedido : "semana");

/**
 * Promedio por día (por mes en el año) de las barras que ya pasaron,
 * con un decimal. Los días futuros no cuentan.
 *
 * @param {object[]} barras
 * @param {string} campo
 * @param {keyof typeof PERIODOS} periodo
 * @param {Date} [ahora] Momento de referencia (para probar).
 * @returns {number}
 */
export function promedio(barras, campo, periodo, ahora = new Date()) {
  const limite = PERIODOS[periodo].limite(dia(ahora));
  const pasadas = barras.filter((b) => b.fecha <= limite);
  const suma = pasadas.reduce((s, b) => s + b[campo], 0);
  return Math.round((suma / Math.max(pasadas.length, 1)) * 10) / 10;
}
