import Link from "next/link";
import Tarjeta from "../componentes/tarjeta";
import { hora } from "../lib/fechas";

/**
 * Fila de la lista de cafés: tipo y hora, con link al detalle.
 * El día va en el título del grupo (ver `ListaInfinita`).
 *
 * @param {{cafe: {id: number, tipo: string, created_at: string, cafe_ml: number,
 *   leche_ml: number, azucar_g: number}}} props
 * @returns {JSX.Element}
 */
export default function FilaCafe({ cafe }) {
  return (
    <Link href={`/cafes/${cafe.id}`} className="block">
      <Tarjeta className="flex items-center justify-between gap-4 !p-5">
        <div>
          <p className="font-medium capitalize">{cafe.tipo}</p>
          <p className="text-sm text-zinc-400">{hora(cafe.created_at)}</p>
        </div>
      </Tarjeta>
    </Link>
  );
}
