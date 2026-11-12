"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { SeccionItem } from "../domain/contenido-item";
import { ICONO_ASA } from "./iconos";

interface Props {
  seccion: SeccionItem;
  activa: boolean;
  onSeleccionar: () => void;
}

export default function FilaSeccion({
  seccion,
  activa,
  onSeleccionar,
}: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: seccion.id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`flex items-center gap-1 border-b border-primary/20 ${
        isDragging ? "z-10 opacity-60" : ""
      }`}
    >
      <button
        type="button"
        onClick={onSeleccionar}
        className={`home flex-1 cursor-pointer rounded-sm px-2 py-2 text-left text-sm font-light transition-colors hover:bg-primary/5 ${
          activa
            ? "text-primary"
            : "text-base-content/70 hover:text-base-content"
        }`}
      >
        {seccion.label}
      </button>

      <button
        type="button"
        {...attributes}
        {...listeners}
        aria-label={`Reordenar ${seccion.label}`}
        title="Arrastrar para reordenar"
        className="btn btn-ghost btn-xs btn-square mr-1 shrink-0 cursor-grab touch-none text-base-content/30 hover:text-base-content active:cursor-grabbing"
      >
        {ICONO_ASA}
      </button>
    </div>
  );
}
