import Link from "next/link";
import Formulario from "./formulario";

export default function Nuevo() {
  return (
    <main className="mx-auto w-full max-w-md p-6">
      <Link href="/" className="text-sm text-zinc-400">
        ← Volver
      </Link>
      <h1 className="mb-6 mt-2 text-2xl font-semibold">Nuevo café</h1>
      <Formulario />
    </main>
  );
}
