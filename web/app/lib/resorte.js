/** Inclinación máxima aproximada del cuerpo del cursor, en grados. */
export const INCLINACION = 20;

/** Velocidad horizontal (px/s) con la que la inclinación casi llega al máximo. */
const VELOCIDAD_TOPE = 800;

/** Resorte del péndulo: frecuencia de ~3,5 oscilaciones por segundo y rebote suave al frenar. */
const RIGIDEZ = 484;
const AMORTIGUACION = 15;

/** Segundos de cada paso de la simulación (pasos chicos mantienen estable el resorte). */
const PASO_FISICA = 0.008;

/** Por debajo de estos valores el péndulo se considera quieto (grados, grados/s). */
const UMBRAL_ANGULO = 0.05;
const UMBRAL_VELOCIDAD = 0.5;

/**
 * Ángulo al que tiende el cuerpo según la velocidad horizontal del cursor: moverse a la
 * derecha lo inclina en sentido horario, a la izquierda al revés, sin pasar de `INCLINACION`.
 *
 * @param {number} velocidad Píxeles por segundo (negativa hacia la izquierda).
 * @returns {number} Grados.
 */
export const inclinacionObjetivo = (velocidad) => INCLINACION * Math.tanh(velocidad / VELOCIDAD_TOPE);

/**
 * Avanza el resorte angular `segundos` hacia el ángulo `objetivo`.
 *
 * @param {{angulo: number, velocidadAngular: number}} estado Grados y grados/s.
 * @param {number} objetivo Grados hacia los que tira el resorte.
 * @param {number} segundos Tiempo a avanzar.
 * @returns {{angulo: number, velocidadAngular: number}} El estado nuevo (no modifica el recibido).
 */
export function avanzarResorte({ angulo, velocidadAngular }, objetivo, segundos) {
  const pasos = Math.max(1, Math.ceil(segundos / PASO_FISICA));
  const h = segundos / pasos;
  for (let i = 0; i < pasos; i++) {
    velocidadAngular += (RIGIDEZ * (objetivo - angulo) - AMORTIGUACION * velocidadAngular) * h;
    angulo += velocidadAngular * h;
  }
  return { angulo, velocidadAngular };
}

/**
 * Si el péndulo ya no se mueve ni tiene hacia dónde: el cursor puede dejar de animar.
 *
 * @param {{angulo: number, velocidadAngular: number}} estado
 * @param {number} objetivo Grados hacia los que tira el resorte.
 * @returns {boolean}
 */
export const enReposo = ({ angulo, velocidadAngular }, objetivo) =>
  Math.abs(objetivo) <= UMBRAL_ANGULO &&
  Math.abs(angulo) <= UMBRAL_ANGULO &&
  Math.abs(velocidadAngular) <= UMBRAL_VELOCIDAD;
