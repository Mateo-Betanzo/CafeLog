"use client";

import { useEffect, useRef } from "react";

/** Imágenes del cursor (en `public/cursores/`) y su punto activo "x y", en píxeles de la imagen. */
const CURSORES = {
  flecha: { src: "/cursores/flecha.png", x: 1, y: 0 },
  mano: { src: "/cursores/mano.png", x: 9, y: 0 },
};

/** Segundos de retraso de la punta respecto del mouse (casi pegada). */
const RETRASO = 0.02;

/** Inclinación máxima aproximada del cuerpo, en grados, y velocidad (px/s) con la que casi se alcanza. */
const INCLINACION = 20;
const VELOCIDAD_TOPE = 800;

/** Resorte del péndulo: frecuencia de ~3,5 oscilaciones por segundo y rebote suave al frenar. */
const RIGIDEZ = 484;
const AMORTIGUACION = 15;

const CLICKEABLE = "a, button, select, summary, [role='button']";

/**
 * Cursor propio con "vida": la punta sigue al mouse casi pegada y el cuerpo se balancea desde la
 * punta como un péndulo, en sentido contrario al movimiento, y rebota un poco al frenar.
 * Oculta el cursor del sistema (clase `cursor-suave` en `html`), muestra la mano sobre lo que se
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
    let angulo = 0;
    let velocidadAngular = 0;

    Object.values(CURSORES).forEach(({ src }) => (new Image().src = src));
    html.classList.add("cursor-suave");

    const elegir = (siguiente) => {
      nombre = siguiente;
      img.src = CURSORES[nombre].src;
      img.style.transformOrigin = `${CURSORES[nombre].x}px ${CURSORES[nombre].y}px`;
    };

    const dibujar = () => {
      const { x, y } = CURSORES[nombre];
      img.style.transform = `translate3d(${actual.x - x}px, ${actual.y - y}px, 0) rotate(${angulo}deg)`;
    };

    const avanzar = (ahora) => {
      const segundos = Math.min((ahora - anterior) / 1000, 0.05);
      anterior = ahora;

      const xPrevia = actual.x;
      const paso = 1 - Math.exp(-segundos / RETRASO);
      actual.x += (destino.x - actual.x) * paso;
      actual.y += (destino.y - actual.y) * paso;
      if (segundos > 0) velocidad = (actual.x - xPrevia) / segundos;

      // Moverse a la derecha deja el cuerpo atrás: inclina en el sentido de las agujas del reloj.
      const objetivo = INCLINACION * Math.tanh(velocidad / VELOCIDAD_TOPE);
      const pasos = Math.max(1, Math.ceil(segundos / 0.008));
      const h = segundos / pasos;
      for (let i = 0; i < pasos; i++) {
        velocidadAngular += (RIGIDEZ * (objetivo - angulo) - AMORTIGUACION * velocidadAngular) * h;
        angulo += velocidadAngular * h;
      }
      dibujar();

      const falta = Math.hypot(destino.x - actual.x, destino.y - actual.y);
      const sigue = falta > 0.1 || Math.abs(objetivo) > 0.05 || Math.abs(angulo) > 0.05 || Math.abs(velocidadAngular) > 0.5;
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
      html.classList.remove("cursor-suave");
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
