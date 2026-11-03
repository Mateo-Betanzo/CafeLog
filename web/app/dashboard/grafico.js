import Tarjeta from "../componentes/tarjeta";
import { PERIODOS, promedio } from "./periodos";

/**
 * Tarjeta con el total, el promedio y las barras de una medida.
 * La altura de cada barra es proporcional a la más alta de la tarjeta;
 * al pasar el mouse por una barra se ve su fecha y su valor.
 *
 * @param {{titulo: string, unidad: string, campo: string, barras: object[], periodo: string}} props
 * @returns {JSX.Element}
 */
export default function Grafico({ titulo, unidad, campo, barras, periodo }) {
  const total = barras.reduce((suma, b) => suma + b[campo], 0);
  const maximo = Math.max(...barras.map((b) => b[campo]), 1);
  const { gap, porCada, etiqueta } = PERIODOS[periodo];

  return (
    <Tarjeta className="min-h-80">
      <h2 className="text-sm text-zinc-400">{titulo}</h2>
      <p className="mt-2 text-5xl font-light">
        {total}
        <span className="ml-2 text-base text-zinc-400">{unidad}</span>
      </p>
      <p className="mt-1 text-sm text-zinc-400">
        Promedio {promedio(barras, campo, periodo)} {unidad} por {porCada}
      </p>

      <div className="mt-6 flex gap-3">
        <div className="flex h-48 flex-col justify-between text-right text-[13px] leading-none text-zinc-400">
          <span>{maximo}</span>
          <span>{Math.round(maximo / 2)}</span>
          <span>0</span>
        </div>
        <div className="flex-1">
          <div className="relative h-48">
            {[0, 50, 100].map((pct) => (
              <div key={pct} className="absolute inset-x-0 border-t border-white/5" style={{ top: `${pct}%` }} />
            ))}
            <div className={`absolute inset-0 flex items-end ${gap}`}>
              {barras.map((d) => (
                <div key={d.fecha} className="group relative flex h-full flex-1 items-end">
                  <div
                    className={`w-full rounded-t ${d[campo] === maximo ? "bg-acento" : "bg-acento/50"}`}
                    style={{ height: `${Math.max((d[campo] / maximo) * 100, 1)}%` }}
                  />
                  <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded-md border border-white/20 bg-black px-2 py-1 text-xs group-hover:block">
                    {d.fecha}: {d[campo]} {unidad}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className={`mt-2 flex ${gap}`}>
            {barras.map((d) => (
              <span key={d.fecha} className="flex-1 text-center text-[13px] text-zinc-400">
                {etiqueta(d.fecha)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Tarjeta>
  );
}
