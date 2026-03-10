import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "xmlibris",
  description:
    "Sistema de gestión de archivos para la biblioteca digital de la UDLAP",
};

export default function xmlibrisLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen" data-theme="xmlibris">
      {children}
    </div>
  );
}
