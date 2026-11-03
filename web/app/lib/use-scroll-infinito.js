import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook de scroll infinito. Parte de una primera tanda de elementos y pide las
 * siguientes cuando el elemento `centinela`, puesto al final de la lista, entra
 * en pantalla. Evita repetidos por `id`, por si la lista cambia mientras se hace scroll.
 *
 * @param {object} opciones
 * @param {{id: number}[]} opciones.inicial Primera tanda, que ya trae el servidor.
 * @param {number} opciones.ultimaPagina Número de la última tanda.
 * @param {(pagina: number) => Promise<{items: object[]} | null>} opciones.cargarMas
 *   Pide una tanda (empieza en 2). Devuelve `null` si falla.
 * @returns {{items: object[], cargando: boolean, error: boolean, hayMas: boolean,
 *   centinela: import("react").RefObject<HTMLElement>, reintentar: () => Promise<void>}}
 */
export function useScrollInfinito({ inicial, ultimaPagina, cargarMas }) {
  const [items, setItems] = useState(inicial);
  const [pagina, setPagina] = useState(1);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(false);
  const centinela = useRef(null);
  const hayMas = pagina < ultimaPagina;

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(false);
    const respuesta = await cargarMas(pagina + 1);
    if (respuesta) {
      setItems((actuales) => {
        const ids = new Set(actuales.map((i) => i.id));
        return [...actuales, ...respuesta.items.filter((i) => !ids.has(i.id))];
      });
      setPagina((p) => p + 1);
    } else {
      setError(true);
    }
    setCargando(false);
  }, [pagina, cargarMas]);

  useEffect(() => {
    if (!hayMas || cargando || error) return;
    const observador = new IntersectionObserver(
      ([entrada]) => entrada.isIntersecting && cargar(),
      { rootMargin: "200px" },
    );
    observador.observe(centinela.current);
    return () => observador.disconnect();
  }, [hayMas, cargando, error, cargar]);

  return { items, cargando, error, hayMas, centinela, reintentar: cargar };
}
