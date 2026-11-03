"use client";

import { useEffect, useRef } from "react";
import { avanzarResorte, enReposo, inclinacionObjetivo } from "./lib/resorte";

/** Imágenes del cursor (en `public/cursores/`) y su punto activo "x y", en píxeles de la imagen. */
const CURSORES = {
  flecha: { src: "/cursores/flecha.png", x: 0, y: 0 },
  mano: { src: "/cursores/mano.png", x: 14, y: 1 },
};

/** Segundos de retraso de la punta respecto del mouse (casi pegada). */
const RETRASO = 0.02;

/** Distancia (px) a la que la punta se considera ya sobre el mouse. */
const UMBRAL_DISTANCIA = 0.1;

const CLICKEABLE = "a, button, select, summary, [role='button']";

/**
 * Cursor propio con "vida": la punta sigue al mouse casi pegada y el cuerpo se balancea desde la
 * punta como un péndulo, en sentido contrario al movimiento, y rebota un poco al frenar.
 * Oculta el cursor del sistema (regla de `globals.css`), muestra la mano sobre lo que se
 * puede apretar y deja el cursor del sistema en los campos de texto. No hace nada con pantalla
 * táctil ni si el sistema pide menos movimiento.
 *
 * @returns {JSX.Element}
 */
export default function CursorSuave() {
  const imagen = useRef(null);

  useEffect(() => {
    const conMouse = matchMedia("(pointer: fine)").matches;
    const menosMovimiento = matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!conMouse || menosMovimiento) return;

    const img = imagen.current;
    const html = document.documentElement;
    const destino = { x: 0, y: 0 };
    const actual = { x: 0, y: 0 };
    let nombre = "flecha";
    let aparecio = false;
    let cuadro = 0;
    let anterior = 0;
    let velocidad = 0;
    let pendulo = { angulo: 0, velocidadAngular: 0 };

    Object.values(CURSORES).forEach(({ src }) => (new Image().src = src));

    const elegir = (siguiente) => {
      nombre = siguiente;
      img.src = CURSORES[nombre].src;
      img.style.transformOrigin = `${CURSORES[nombre].x}px ${CURSORES[nombre].y}px`;
    };

    const dibujar = () => {
      const { x, y } = CURSORES[nombre];
      img.style.transform = `translate3d(${actual.x - x}px, ${actual.y - y}px, 0) rotate(${pendulo.angulo}deg)`;
    };

    const avanzar = (ahora) => {
      const segundos = Math.min((ahora - anterior) / 1000, 0.05);
      anterior = ahora;

      const xPrevia = actual.x;
      const paso = 1 - Math.exp(-segundos / RETRASO);
      actual.x += (destino.x - actual.x) * paso;
      actual.y += (destino.y - actual.y) * paso;
      if (segundos > 0) velocidad = (actual.x - xPrevia) / segundos;

      const objetivo = inclinacionObjetivo(velocidad);
      pendulo = avanzarResorte(pendulo, objetivo, segundos);
      dibujar();

      const falta = Math.hypot(destino.x - actual.x, destino.y - actual.y);
      const sigue = falta > UMBRAL_DISTANCIA || !enReposo(pendulo, objetivo);
      cuadro = sigue ? requestAnimationFrame(avanzar) : 0;
    };

    const alMoverse = (evento) => {
      if (evento.pointerType !== "mouse") return;
      destino.x = evento.clientX;
      destino.y = evento.clientY;
      if (!aparecio) {
        actual.x = destino.x;
        actual.y = destino.y;
        elegir(nombre);
        aparecio = true;
      }

      const enTexto = evento.target.closest("input, textarea");
      const siguiente = evento.target.closest(CLICKEABLE) ? "mano" : "flecha";
      if (siguiente !== nombre) elegir(siguiente);
      img.style.opacity = enTexto ? "0" : "1";

      if (!cuadro) {
        anterior = performance.now();
        cuadro = requestAnimationFrame(avanzar);
      }
    };

    const alSalir = () => (img.style.opacity = "0");

    document.addEventListener("pointermove", alMoverse);
    html.addEventListener("pointerleave", alSalir);
    return () => {
      document.removeEventListener("pointermove", alMoverse);
      html.removeEventListener("pointerleave", alSalir);
      cancelAnimationFrame(cuadro);
    };
  }, []);

  return (
    <img
      ref={imagen}
      src={CURSORES.flecha.src}
      alt=""
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] opacity-0"
    />
  );
}
