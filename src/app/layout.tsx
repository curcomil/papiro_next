import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Colecciones Digitales UDLAP",
  description: "Colecciones Digitales de la Universidad de las Américas Puebla",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
