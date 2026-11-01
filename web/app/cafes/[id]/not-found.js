import Link from "next/link";

/**
 * Se muestra cuando el café pedido no existe.
 *
 * @returns {JSX.Element}
 */
export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-md p-6">
      <h1 className="text-2xl font-semibold">Café no encontrado</h1>
      <Link href="/" className="mt-4 inline-block text-sm text-zinc-400">
        ← Volver
      </Link>
    </main>
  );
}
