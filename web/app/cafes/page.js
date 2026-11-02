import Link from "next/link";
import { Suspense } from "react";
import Volver from "../componentes/volver";
import { apiGet } from "../lib/api";
import ListaInfinita from "./lista-infinita";

/**
 * Trae la primera tanda de cafés (Server Component).
 *
 * @returns {Promise<JSX.Element>}
 */
async function Lista() {
  const respuesta = await apiGet("/cafes?page=1");

  if (!respuesta) {
    return <p className="text-red-400">No se pudo cargar la lista</p>;
  }

  if (respuesta.data.length === 0) {
    return (
      <p className="text-zinc-400">
        Todavía no cargaste ningún café.{" "}
        <Link href="/nuevo" className="text-acento">
          Agregar uno
        </Link>
      </p>
    );
  }

  return <ListaInfinita inicial={respuesta.data} ultimaPagina={respuesta.last_page} />;
}

/**
 * Página `/cafes`: todos los cafés, del más nuevo al más viejo.
 *
 * @returns {JSX.Element}
 */
export default function Cafes() {
  return (
    <main className="mx-auto w-full max-w-2xl p-6">
      <Volver />
      <h1 className="mb-6 mt-2 text-2xl font-semibold">Mis cafés</h1>
      <Suspense fallback={<p className="text-zinc-400">Cargando…</p>}>
        <Lista />
      </Suspense>
    </main>
  );
}
