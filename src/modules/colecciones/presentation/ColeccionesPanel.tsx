"use client";

import TarjetaColeccion from "./TarjetaColeccion";
import { useColecciones } from "./use-colecciones";

export default function ColeccionesPanel() {
  const estado = useColecciones();

  if (estado.tipo === "loading") {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-bars loading-xl"></span>
      </div>
    );
  }

  if (estado.tipo === "error") {
    return (
      <p className="home py-6 text-sm font-light text-error">
        {estado.message}
        {estado.status > 0 ? ` (status ${estado.status})` : null}
      </p>
    );
  }

  if (estado.colecciones.length === 0) {
    return (
      <p className="home py-6 text-sm font-light text-base-content/50">
        No tienes colecciones asignadas.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {estado.colecciones.map((coleccion) => (
        <TarjetaColeccion key={coleccion.internalId} coleccion={coleccion} />
      ))}
    </div>
  );
}
