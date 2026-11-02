/**
 * Palabra "café" o "cafés" según la cantidad.
 *
 * @param {number} cantidad
 * @returns {string}
 */
export const cafes = (cantidad) => (cantidad === 1 ? "café" : "cafés");

/** Zona horaria en la que se muestran todas las fechas. */
const ZONA = "America/Argentina/Buenos_Aires";

/**
 * Fecha y hora cortas en horario de Buenos Aires, por ejemplo "2/11/26, 14:56".
 *
 * @param {string} iso Fecha ISO de la API.
 * @returns {string}
 */
export const fechaCorta = (iso) =>
  new Date(iso).toLocaleString("es-AR", {
    timeZone: ZONA,
    dateStyle: "short",
    timeStyle: "short",
    hourCycle: "h23",
  });

/**
 * Hora de 24 horas en horario de Buenos Aires, por ejemplo "14:56".
 *
 * @param {string} iso Fecha ISO de la API.
 * @returns {string}
 */
export const hora = (iso) =>
  new Date(iso).toLocaleTimeString("es-AR", {
    timeZone: ZONA,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

/**
 * Día calendario de Buenos Aires de una fecha, como `YYYY-MM-DD`.
 *
 * @param {string} iso Fecha ISO de la API.
 * @returns {string}
 */
export const dia = (iso) => new Date(iso).toLocaleDateString("en-CA", { timeZone: ZONA });

/**
 * Título de un día: "Hoy", "Ayer" o, por ejemplo, "Lunes 26 de octubre"
 * (con el año si no es el actual).
 *
 * @param {string} claveDia Día como `YYYY-MM-DD`.
 * @param {Date} [ahora] Momento de referencia (para probar).
 * @returns {string}
 */
export function tituloDia(claveDia, ahora = new Date()) {
  const hoy = dia(ahora.toISOString());
  if (claveDia === hoy) return "Hoy";
  if (claveDia === dia(new Date(ahora.getTime() - 24 * 60 * 60 * 1000).toISOString())) return "Ayer";

  const opciones = { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" };
  if (claveDia.slice(0, 4) !== hoy.slice(0, 4)) opciones.year = "numeric";
  const texto = new Date(`${claveDia}T12:00:00Z`)
    .toLocaleDateString("es-AR", opciones)
    .replace(",", "");
  return texto[0].toUpperCase() + texto.slice(1);
}

/**
 * Agrupa cafés por día. Espera la lista ordenada (del más nuevo al más viejo),
 * así que agrupa los consecutivos y conserva el orden.
 *
 * @template {{created_at: string}} T
 * @param {T[]} cafes
 * @returns {{dia: string, cafes: T[]}[]}
 */
export function agruparPorDia(cafes) {
  const grupos = [];
  for (const cafe of cafes) {
    const claveDia = dia(cafe.created_at);
    const ultimo = grupos.at(-1);
    if (ultimo?.dia === claveDia) ultimo.cafes.push(cafe);
    else grupos.push({ dia: claveDia, cafes: [cafe] });
  }
  return grupos;
}
