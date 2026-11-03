/**
 * Tarjeta bento: fondo oscuro, borde sutil y esquinas redondeadas.
 *
 * @param {{as?: string, className?: string}} props `as` es la etiqueta HTML
 *   (`section` por defecto); el resto de las props pasan a esa etiqueta.
 * @returns {JSX.Element}
 */
export default function Tarjeta({ as: Etiqueta = "section", className = "", ...props }) {
  return (
    <Etiqueta
      className={`rounded border border-borde bg-tarjeta p-5 ${className}`}
      {...props}
    />
  );
}
