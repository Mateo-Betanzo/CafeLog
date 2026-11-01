/**
 * Etiqueta que va debajo de una barra: inicial del día (semana), número del
 * día cada 5 barras (mes) o inicial del mes (año).
 *
 * @param {string} fecha `YYYY-MM-DD` o `YYYY-MM` (año).
 * @param {string} periodo `semana`, `mes` o `anio`.
 * @returns {string}
 */
function etiqueta(fecha, periodo) {
  const dia = Number(fecha.slice(8, 10));
  if (periodo === "mes") return dia === 1 || dia % 5 === 0 ? String(dia) : "";
  return new Date(fecha).toLocaleDateString("es-AR", {
    [periodo === "anio" ? "month" : "weekday"]: "narrow",
    timeZone: "UTC",
  });
}

/**
 * Tarjeta con el total y las barras de una medida.
 * La altura de cada barra es proporcional a la más alta de la tarjeta.
 *
 * @param {{titulo: string, unidad: string, campo: string, barras: object[], periodo: string}} props
 * @returns {JSX.Element}
 */
export default function Grafico({ titulo, unidad, campo, barras, periodo }) {
  const total = barras.reduce((suma, b) => suma + b[campo], 0);
  const maximo = Math.max(...barras.map((b) => b[campo]), 1);

  return (
    <section className="rounded-2xl border border-borde bg-tarjeta p-6">
      <h2 className="text-sm text-zinc-400">{titulo}</h2>
      <p className="mt-2 text-5xl font-light">
        {total}
        <span className="ml-2 text-base text-zinc-400">{unidad}</span>
      </p>
      <div className={`mt-6 flex h-32 items-end ${periodo === "mes" ? "gap-0.5" : "gap-2"}`}>
        {barras.map((d) => (
          <div
            key={d.fecha}
            className="flex h-full flex-1 flex-col items-center justify-end gap-1"
          >
            <div
              title={`${d.fecha}: ${d[campo]} ${unidad}`}
              className="w-full rounded-t bg-acento"
              style={{ height: `${Math.max((d[campo] / maximo) * 100, 2)}%` }}
            />
            <span className="text-xs text-zinc-400">
              {etiqueta(d.fecha, periodo)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
