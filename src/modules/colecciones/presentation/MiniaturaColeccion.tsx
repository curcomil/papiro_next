"use client";

import { useState } from "react";
import { rutaMiniatura } from "../infrastructure/miniatura-url";

const ICONO_ARCHIVO = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="size-10"
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
  miniatura: string;
  nombre: string;
}

/** Miniatura de la colección; si no hay imagen usable, el SVG genérico. */
export default function MiniaturaColeccion({ miniatura, nombre }: Props) {
  const url = rutaMiniatura(miniatura);
  const [estado, setEstado] = useState<Estado>(url ? "loading" : "error");

  const sinImagen = !url || estado === "error";

  return (
    <div className="flex h-56 w-full items-center justify-center overflow-hidden bg-base-200 text-base-content/30">
      {sinImagen ? (
        ICONO_ARCHIVO
      ) : (
        <>
          {estado === "loading" && (
            <span className="loading loading-spinner loading-md"></span>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt={`Miniatura de ${nombre}`}
            onLoad={() => setEstado("success")}
            onError={() => setEstado("error")}
            className={`h-full w-full object-contain ${
              estado === "success" ? "" : "hidden"
            }`}
          />
        </>
      )}
    </div>
  );
}
