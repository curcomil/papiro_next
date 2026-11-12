"use client";

import { useState } from "react";

type Estado = "loading" | "success" | "error";

interface Props {
  url: string;
  nombre: string;
}

/**
 * Miniatura de un archivo del item. Los mismos tres estados que el resto:
 */
export default function MiniaturaArchivo({ url, nombre }: Props) {
  const [estado, setEstado] = useState<Estado>("loading");

  if (estado === "error") {
    return (
      <div className="flex h-full w-full items-center justify-center bg-base-200 px-3">
        <p className="home text-center text-xs font-light text-error">
          No se pudo cargar
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center bg-base-200">
      {estado === "loading" && (
        <span className="loading loading-spinner loading-sm text-base-content/30"></span>
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={nombre}
        onLoad={() => setEstado("success")}
        onError={() => setEstado("error")}
        className={`h-full w-full object-contain transition-transform duration-200 group-hover:scale-[1.02] ${
          estado === "success" ? "" : "hidden"
        }`}
      />
    </div>
  );
}
