import Formulario from "./formulario";
import Volver from "../componentes/volver";

/**
 * Página `/nuevo`: muestra el formulario para agregar un café.
 *
 * @returns {JSX.Element}
 */
export default function Nuevo() {
  return (
    <main className="mx-auto w-full max-w-md p-6">
      <Volver />
      <h1 className="mb-6 mt-2 text-2xl font-semibold">Nuevo café</h1>
      <Formulario />
    </main>
  );
}
