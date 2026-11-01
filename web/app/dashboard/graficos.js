import { apiGet } from "../lib/api";
import Grafico from "./grafico";

/** Periodos que acepta la API; cualquier otro valor usa la semana. */
const PERIODOS = ["semana", "mes", "anio"];

/**
 * Las tres tarjetas del dashboard: café, leche y azúcar (Server Component).
 * Trae de la API las barras del periodo pedido en `?periodo=`.
 *
 * @param {{searchParams: Promise<{periodo?: string}>}} props
 * @returns {Promise<JSX.Element>}
 */
export default async function Graficos({ searchParams }) {
  const { periodo: pedido } = await searchParams;
  const periodo = PERIODOS.includes(pedido) ? pedido : "semana";
  const barras = (await apiGet(`/cafes/resumen?periodo=${periodo}`))?.barras;

  if (!barras) {
    return <p className="text-red-400">No se pudo cargar el dashboard</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Grafico titulo="Café" unidad="ml" campo="cafe_ml" barras={barras} periodo={periodo} />
      <Grafico titulo="Leche" unidad="ml" campo="leche_ml" barras={barras} periodo={periodo} />
      <Grafico titulo="Azúcar" unidad="g" campo="azucar_g" barras={barras} periodo={periodo} />
    </div>
  );
}
