/**
 * Ruta de la API de un café.
 *
 * @param {string} id Id del café.
 * @returns {string} `/cafes/<id>`, con el id codificado para la URL.
 */
export const rutaCafe = (id) => `/cafes/${encodeURIComponent(id)}`;
