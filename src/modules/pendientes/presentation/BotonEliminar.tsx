"use client";

import { useEliminarItem } from "@/modules/items/presentation/use-eliminar-item";

interface Props {
  coleccionInternalId: string;
  internalId: string;
  titulo: string;
  /** Se llama solo cuando el borrado salió bien, para refrescar la lista. */
  onEliminado: () => void;
}

export default function BotonEliminar({
  coleccionInternalId,
  internalId,
  titulo,
  onEliminado,
}: Props) {
  const { eliminar, eliminando } = useEliminarItem();

  const handleClick = async () => {
    const ok = await eliminar({ coleccionInternalId, internalId }, titulo);
    if (ok) onEliminado();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={eliminando}
      aria-label={`Eliminar ${titulo}`}
      className="btn btn-error btn-soft btn-xs home font-normal"
    >
      {eliminando ? (
        <span className="loading loading-spinner loading-xs"></span>
      ) : (
        "Eliminar"
      )}
    </button>
  );
}
