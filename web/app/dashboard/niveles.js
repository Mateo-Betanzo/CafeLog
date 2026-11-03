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
