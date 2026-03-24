// src/app/xmlibris/layout.tsx
import type { Metadata } from "next";
import "./styles.css";
import { ThemeProvider } from "./components/ThemeProvider";
export const metadata: Metadata = {
  title: "xmlibris",
  description:
    "Sistema de gestión de archivos para la biblioteca digital de la UDLAP",
};

export default function XmlibrisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
