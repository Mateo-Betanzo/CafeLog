import Link from "next/link";

/**
 * Página de inicio: acceso al formulario de carga.
 *
 * @returns {JSX.Element}
 */
export default function Home() {
  return (
    <main className="mx-auto w-full max-w-5xl p-6">
      <h1 className="text-3xl font-semibold">CafeLog</h1>
      <Link
        href="/nuevo"
        className="mt-6 inline-block rounded-2xl bg-acento px-5 py-3 font-medium text-black"
      >
        Agregar café
      </Link>
    </main>
  );
}
