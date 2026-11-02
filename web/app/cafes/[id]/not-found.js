import Encabezado from "../../componentes/encabezado";

/**
 * Se muestra cuando el café pedido no existe.
 *
 * @returns {JSX.Element}
 */
export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-md p-6">
      <Encabezado titulo="Café no encontrado" />
    </main>
  );
}
