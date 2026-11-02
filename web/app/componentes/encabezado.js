import Link from "next/link";
import Icono from "./icono";

/**
 * Encabezado de página: flecha para volver al inicio y el título en la misma línea.
 *
 * @param {{titulo: string, className?: string}} props
 * @returns {JSX.Element}
 */
export default function Encabezado({ titulo, className = "mb-6" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Link href="/" aria-label="Volver" className="text-zinc-400 flex items-center justify-center">
        <Icono nombre="nav-arrow-left" className="h-6 w-6" />
      </Link>
      <h1 className="text-2xl font-semibold">{titulo}</h1>
    </div>
  );
}
