"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/**
 * Botones de la barra. `icono` es provisorio (una letra): reemplazarlo por el
 * ícono definitivo, por ejemplo un `<svg>`, sin tocar nada más.
 */
const ENLACES = [
  { href: "/", nombre: "Inicio", icono: "I" },
  { href: "/cafes", nombre: "Mis cafés", icono: "C" },
  { href: "/dashboard", nombre: "Dashboard", icono: "D" },
  { href: "/nuevo", nombre: "Nuevo café", icono: "+" },
];

/**
 * Barra de navegación en forma de cápsula, como la de `Front CoffeeLog.jpg`:
 * vertical abajo a la izquierda y, en pantallas angostas, horizontal abajo al
 * centro. El botón de la página actual se ve blanco y los demás apagados.
 *
 * @returns {JSX.Element}
 */
export default function Navegacion() {
  const ruta = usePathname();

  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 md:bottom-6 md:left-6 md:translate-x-0"
    >
      <ul className="flex items-center gap-3 rounded-full border border-white/10 bg-black p-2 md:flex-col md:gap-5 md:px-2 md:py-5">
        {ENLACES.map(({ href, nombre, icono }) => {
          const activo = href === "/" ? ruta === "/" : ruta.startsWith(href);
          return (
            <li key={href}>
              <Link
                href={href}
                title={nombre}
                aria-label={nombre}
                aria-current={activo ? "page" : undefined}
                className={`grid h-10 w-10 place-items-center rounded-full text-lg ${
                  activo ? "text-white" : "text-zinc-600 hover:text-zinc-300"
                }`}
              >
                {icono}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
