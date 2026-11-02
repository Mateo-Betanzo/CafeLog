import Formulario from "./formulario";
import Encabezado from "../componentes/encabezado";

/**
 * Página `/nuevo`: muestra el formulario para agregar un café.
 *
 * @returns {JSX.Element}
 */
export default function Nuevo() {
  return (
    <main className="mx-auto w-full max-w-md p-6">
      <Encabezado titulo="Nuevo café" />
      <Formulario />
    </main>
  );
}
