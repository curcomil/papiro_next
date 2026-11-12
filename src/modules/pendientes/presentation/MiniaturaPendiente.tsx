"use client";

import { useState } from "react";
import { rutaArchivoDesdeRuta } from "@/modules/items/infrastructure/item-file-url";

const ICONO_DOCUMENTO = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="size-8"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3h-6m-1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  </svg>
);

type Estado = "loading" | "success" | "error";

interface Props {
  portada: string;
  titulo: string;
  className?: string;
}

/**
 * Miniatura de la portada del item. Si no hay portada, o el binario falla, cae
 * al documento genérico en lugar de dejar un hueco.
 */
export default function MiniaturaPendiente({
  portada,
  titulo,
  className = "h-16 w-12",
}: Props) {
  const [estado, setEstado] = useState<Estado>(portada ? "loading" : "error");

  const url = rutaArchivoDesdeRuta(portada);
  const sinImagen = !portada || estado === "error";

  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-sm border border-primary/20 bg-base-200 text-base-content/35 ${className}`}
    >
      {sinImagen ? (
        ICONO_DOCUMENTO
      ) : (
        <>
          {estado === "loading" && (
            <span className="loading loading-spinner loading-xs"></span>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={`Portada de ${titulo}`}
            onLoad={() => setEstado("success")}
            onError={() => setEstado("error")}
            className={`h-full w-full object-cover ${
              estado === "success" ? "" : "hidden"
            }`}
          />
        </>
      )}
    </div>
  );
}
