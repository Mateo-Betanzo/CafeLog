import Volver from "../../componentes/volver";

/**
 * Se muestra cuando el café pedido no existe.
 *
 * @returns {JSX.Element}
 */
export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-md p-6">
      <h1 className="text-2xl font-semibold">Café no encontrado</h1>
      <Volver className="mt-4" />
    </main>
  );
}
