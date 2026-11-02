import Link from "next/link";
import Icono from "./icono";

/**
 * Link "Volver" al inicio, con la flecha `nav-arrow-left`.
 *
 * @param {{className?: string}} props Clases extra, por ejemplo márgenes.
 * @returns {JSX.Element}
 */
export default function Volver({ className = "" }) {
  return (
    <Link href="/" className={`inline-flex items-center gap-1 text-sm text-zinc-400 ${className}`}>
      <Icono nombre="nav-arrow-left" className="h-5 w-5" />
    </Link>
  );
}
