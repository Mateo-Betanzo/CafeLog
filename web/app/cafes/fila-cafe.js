import Link from "next/link";
import Tarjeta from "../componentes/tarjeta";
import { fechaCorta } from "../lib/formato";

/**
 * Fila de la lista de cafés: tipo, fecha y cantidades, con link al detalle.
 *
 * @param {{cafe: {id: number, tipo: string, created_at: string, cafe_ml: number,
 *   leche_ml: number, azucar_g: number}}} props
 * @returns {JSX.Element}
 */
export default function FilaCafe({ cafe }) {
  return (
    <Link href={`/cafes/${cafe.id}`} className="block">
      <Tarjeta className="flex items-center justify-between gap-4 !p-4">
        <div>
          <p className="font-medium capitalize">{cafe.tipo}</p>
          <p className="text-sm text-zinc-400">{fechaCorta(cafe.created_at)}</p>
        </div>
        <p className="text-right text-sm text-zinc-400">
          {cafe.cafe_ml} ml café · {cafe.leche_ml} ml leche · {cafe.azucar_g} g azúcar
        </p>
      </Tarjeta>
    </Link>
  );
}
