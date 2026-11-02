import Link from "next/link";

/**
 * Link "← Volver" al inicio.
 *
 * @param {{className?: string}} props Clases extra, por ejemplo márgenes.
 * @returns {JSX.Element}
 */
export default function Volver({ className = "" }) {
  return (
    <Link href="/" className={`inline-block text-sm text-zinc-400 ${className}`}>
      ← Volver
    </Link>
  );
}
