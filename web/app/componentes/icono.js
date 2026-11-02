/**
 * Ícono SVG de `public/svg/`. Se dibuja como máscara con `currentColor`, así toma
 * el color del texto que lo rodea (los SVG usan `stroke="currentColor"`, que un
 * `<img>` no hereda).
 *
 * @param {{nombre: string, className?: string}} props `nombre` es el archivo sin
 *   la extensión, por ejemplo `home-simple`. `className` ajusta el tamaño (24 px por defecto).
 * @returns {JSX.Element}
 */
export default function Icono({ nombre, className = "h-6 w-6" }) {
  const mascara = `url(/svg/${nombre}.svg)`;

  return (
    <span
      aria-hidden="true"
      className={`inline-block bg-current ${className}`}
      style={{
        maskImage: mascara,
        WebkitMaskImage: mascara,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}
