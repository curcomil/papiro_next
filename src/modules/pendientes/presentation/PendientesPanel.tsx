"use client";

import Link from "next/link";
import BotonEliminar from "./BotonEliminar";
import BotonPublicar from "./BotonPublicar";
import MiniaturaPendiente from "./MiniaturaPendiente";
import { rutaArchivos, rutaClasificar } from "./rutas";
import { usePendientes } from "./use-pendientes";

export default function PendientesPanel() {
  const { estado, recargar } = usePendientes();

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

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {estado.pendientes.map((pendiente) => (
        <article
          key={pendiente.internalId}
          className="card w-full border border-primary/20 bg-base-100 card-sm shadow-sm"
        >
          <div className="card-body gap-3">
            <div className="flex flex-row gap-3">
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                <div className="min-w-0">
                  <h3
                    title={pendiente.titulo}
                    className="home truncate text-base leading-snug font-normal text-base-content"
                  >
                    {pendiente.titulo}
                  </h3>
                  <p className="home truncate text-xs font-light text-base-content/40">
                    {pendiente.internalId}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href={rutaArchivos(pendiente.internalId)}
                    className="btn btn-outline btn-primary btn-xs home font-normal"
                  >
                    Ver archivos
                  </Link>
                  <Link
                    href={rutaClasificar(pendiente.internalId)}
                    className="btn btn-outline btn-primary btn-xs home font-normal"
                  >
                    Clasificar
                  </Link>
                  <button
                    type="button"
                    className="btn btn-outline btn-primary btn-xs home font-normal"
                  >
                    Exportar
                  </button>
                  <BotonEliminar
                    coleccionInternalId={pendiente.coleccionInternalId}
                    internalId={pendiente.internalId}
                    titulo={pendiente.titulo}
                    onEliminado={recargar}
                  />
                </div>
              </div>

              <MiniaturaPendiente
                portada={pendiente.portada}
                titulo={pendiente.titulo}
                className="h-40 w-28"
              />
            </div>

            <div>
              <BotonPublicar />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
