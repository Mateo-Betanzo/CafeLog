import { Suspense } from "react";
import Encabezado from "../componentes/encabezado";
import { apiGet } from "../lib/api";
import { crearCafe } from "./actions";
import Formulario from "../componentes/formulario-cafe";

/**
 * Trae de la API los tipos de café y arma el formulario (Server Component).
 *
 * @returns {Promise<JSX.Element>}
 */
async function FormularioConTipos() {
  const opciones = await apiGet("/cafes/tipos");

  if (!opciones) {
    return <p className="text-red-400">No se pudo cargar el formulario</p>;
  }

  return <Formulario tipos={opciones.tipos} maxCucharaditas={opciones.max_cucharaditas} accion={crearCafe} />;
}

/**
 * Página `/nuevo`: muestra el formulario para agregar un café.
 *
 * @returns {JSX.Element}
 */
export default function Nuevo() {
  return (
    <main className="mx-auto w-full max-w-md p-6">
      <Encabezado titulo="Nuevo café" />
      <Suspense fallback={<p className="text-zinc-400">Cargando…</p>}>
        <FormularioConTipos />
      </Suspense>
    </main>
  );
}
