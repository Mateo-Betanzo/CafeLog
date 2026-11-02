/**
 * Palabra "café" o "cafés" según la cantidad.
 *
 * @param {number} cantidad
 * @returns {string}
 */
export const cafes = (cantidad) => (cantidad === 1 ? "café" : "cafés");

/**
 * Fecha y hora cortas en horario de Buenos Aires, por ejemplo "2/11/26, 2:34 p. m.".
 *
 * @param {string} iso Fecha ISO de la API.
 * @returns {string}
 */
export const fechaCorta = (iso) =>
  new Date(iso).toLocaleString("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    dateStyle: "short",
    timeStyle: "short",
  });
