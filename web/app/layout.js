import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
      <body>
        {children}
        <RegistrarSW />
      </body>
    </html>
  );
}
