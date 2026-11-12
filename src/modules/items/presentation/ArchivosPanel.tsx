"use client";

import type { ReactNode } from "react";
import VolverPendientes from "@/modules/pendientes/presentation/VolverPendientes";
import {
  esImagen,
  esPdf,
  isABook,
  nombreDeArchivo,
} from "../domain/contenido-item";
import { rutaArchivo } from "../infrastructure/item-file-url";
import LibroPanel from "./LibroPanel";
import { AVISO_SUSTITUIR } from "./textos";
import { useItem } from "./use-item";

const ICONO_INFO = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="size-4 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
    />
  </svg>
);

interface Props {
  internalId: string;
}

/** Marco de las vistas de un solo archivo (no libro). */
function Contenedor({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-10 lg:px-10">
      <VolverPendientes className="-ml-3 mb-4" />
      {children}
    </div>
  );
}

export default function ArchivosPanel({ internalId }: Props) {
  const estado = useItem(internalId);

  if (estado.tipo === "loading") {
    return (
      <Contenedor>
        <div className="flex justify-center py-16">
          <span className="loading loading-bars loading-xl"></span>
        </div>
      </Contenedor>
    );
  }

  if (estado.tipo === "error") {
    return (
      <Contenedor>
        <p className="home py-6 text-sm font-light text-error">
          {estado.message}
          {estado.status > 0 ? ` (status ${estado.status})` : null}
        </p>
      </Contenedor>
    );
  }

  const item = estado.item;

  // Un libro ocupa toda la pantalla: su layout trae su propia barra superior.
  if (isABook(item.content)) {
    return <LibroPanel item={item} />;
  }

  const archivo = nombreDeArchivo(item.content[0] ?? {});

  if (!archivo) {
    return (
      <Contenedor>
        <p className="home text-sm font-light text-base-content/50">
          Este item no tiene archivos.
        </p>
      </Contenedor>
    );
  }

  const url = rutaArchivo(item, archivo);

  return (
    <Contenedor>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="home truncate text-sm font-light text-base-content/70">
            {archivo}
          </p>
          <a
            href={url}
            download={archivo}
            className="btn btn-outline btn-primary btn-sm home font-normal"
          >
            Descargar
          </a>
        </div>

        <div role="alert" className="alert alert-soft alert-info">
          {ICONO_INFO}
          <p className="home text-sm font-light">{AVISO_SUSTITUIR}</p>
        </div>

        <div className="card w-full overflow-hidden border border-primary/20 bg-base-100 card-sm shadow-sm">
          {esPdf(archivo) ? (
            <iframe src={url} title={archivo} className="h-[75vh] w-full" />
          ) : esImagen(archivo) ? (
            // El SVG/optimizador de Next no aplica: el binario lo sirve la API.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={archivo}
              className="mx-auto max-h-[75vh] w-auto max-w-full object-contain"
            />
          ) : (
            <p className="home p-6 text-sm font-light text-base-content/50">
              No hay vista previa para este tipo de archivo. Usa «Descargar».
            </p>
          )}
        </div>
      </div>
    </Contenedor>
  );
}
