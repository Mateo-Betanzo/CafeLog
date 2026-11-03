import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navegacion from "./componentes/navegacion";
import CursorSuave from "./cursor-suave";
import RegistrarSW from "./registrar-sw";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Metadatos de la app. */
export const metadata = {
  title: "CafeLog",
  description: "Registro de cafés",
  manifest: "/manifest.json",
};

/** Color de la barra del navegador en el celular. */
export const viewport = { themeColor: "#d9772b" };

/**
 * Layout raíz: fuentes y estructura HTML común.
 *
 * @param {{children: React.ReactNode}} props
 * @returns {JSX.Element}
 */
export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="pb-24 md:pb-0">
        {children}
        <Suspense>
          <Navegacion />
        </Suspense>
        <RegistrarSW />
        <CursorSuave />
      </body>
    </html>
  );
}
