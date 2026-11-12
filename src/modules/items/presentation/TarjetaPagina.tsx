"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { esImagen, type PaginaItem } from "../domain/contenido-item";
import { ICONO_ASA } from "./iconos";
import MiniaturaArchivo from "./MiniaturaArchivo";

const ICONO_DOCUMENTO = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="size-12"
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

interface Props {
  pagina: PaginaItem;
  url: string;
  seleccionada: boolean;
  onSeleccionar: () => void;
  onAbrir: () => void;
}

export default function TarjetaPagina({
  pagina,
  url,
  seleccionada,
  onSeleccionar,
  onAbrir,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: pagina.file_name });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex flex-col gap-2 ${isDragging ? "z-10 opacity-60" : ""}`}
    >
      <div className="relative h-56 w-full">
        <input
          type="checkbox"
          checked={seleccionada}
          onChange={onSeleccionar}
          aria-label={`Seleccionar ${pagina.file_name}`}
          className="checkbox checkbox-primary checkbox-sm absolute top-2 left-2 z-10 bg-base-100"
        />

        {/* Solo el asa arrastra: el resto de la card sigue siendo clicable. */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          aria-label={`Reordenar ${pagina.file_name}`}
          title="Arrastrar para reordenar"
          className="btn btn-ghost btn-xs btn-square absolute top-2 right-2 z-10 cursor-grab touch-none bg-base-100/80 text-base-content/40 hover:text-base-content active:cursor-grabbing"
        >
          {ICONO_ASA}
        </button>

        <button
          type="button"
          onClick={onAbrir}
          aria-label={`Abrir ${pagina.file_name}`}
          className="group block h-full w-full cursor-pointer overflow-hidden rounded-sm border border-primary/20 bg-base-100 transition-all hover:border-primary/50 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {esImagen(pagina.file_name) ? (
            <MiniaturaArchivo url={url} nombre={pagina.file_name} />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-base-200 text-base-content/35 transition-colors group-hover:text-base-content/60">
              {ICONO_DOCUMENTO}
            </div>
          )}
        </button>
      </div>

      <p className="home truncate text-xs font-light text-base-content/70">
        {pagina.file_name}
      </p>
      <p className="home text-xs text-base-content">
        Número de página: {pagina.number ?? "—"}
      </p>
    </div>
  );
}
