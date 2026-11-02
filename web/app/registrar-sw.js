"use client";

import { useEffect } from "react";

/**
 * Registra el Service Worker (`/sw.js`). Solo en producción, para que no
 * interfiera con `next dev`. No dibuja nada.
 *
 * @returns {null}
 */
export default function RegistrarSW() {
  useEffect(() => {
    if (process.env.NODE_ENV === "production" && "serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js");
    }
  }, []);

  return null;
}
