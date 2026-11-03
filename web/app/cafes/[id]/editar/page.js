import { Suspense } from "react";
import Encabezado from "../../../componentes/encabezado";
import { apiGet } from "../../../lib/api";
import Formulario from "../../../componentes/formulario-cafe";
import { obtenerCafe } from "../../obtener-cafe";
import { editarCafe } from "../actions";

/**
 * Trae el café y los tipos de la API y arma el formulario con los datos cargados (Server Component).
 *
 * @param {{params: Promise<{id: string}>}} props
 * @returns {Promise<JSX.Element>}
 */
async function FormularioDeEdicion({ params }) {
  const { id } = await params;
  const [cafe, opciones] = await Promise.all([obtenerCafe(id), apiGet("/cafes/tipos")]);

  if (!cafe || !opciones) {
    return <p className="text-red-400">No se pudo cargar el formulario</p>;
  }

  return (
    <Formulario
      cafe={cafe}
      tipos={opciones.tipos}
      maxCucharaditas={opciones.max_cucharaditas}
      accion={editarCafe.bind(null, id)}
    />
  );
}

/**
 * Página `/cafes/[id]/editar`: formulario para cambiar un café.
 *
 * @param {{params: Promise<{id: string}>}} props
 * @returns {JSX.Element}
 */
export default function Editar({ params }) {
  return (
    <main className="mx-auto w-full max-w-md p-6">
      <Encabezado titulo="Editar café" />
      <Suspense fallback={<p className="text-zinc-400">Cargando…</p>}>
        <FormularioDeEdicion params={params} />
      </Suspense>
    </main>
  );
}
