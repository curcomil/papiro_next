"use client";

import { useCallback, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { createEliminarItemUseCases } from "../application/eliminar-item";
import type { EliminarItemEntrada } from "../domain/eliminar-item";
import { createItemRepository } from "../infrastructure/server-action-item-repository";

/** Rojo del tema (`--color-error`), no el acento: la acción es destructiva. */
const CONFIRM_COLOR = "oklch(65% 0.18 25)";

export function useEliminarItem() {
  const useCases = useMemo(
    () => createEliminarItemUseCases(createItemRepository()),
    [],
  );
  const [eliminando, setEliminando] = useState(false);

  const eliminar = useCallback(
    async (entrada: EliminarItemEntrada, titulo: string): Promise<boolean> => {
      const { isConfirmed } = await Swal.fire({
        icon: "warning",
        title: "¿Eliminar este registro?",
        text: `Se borrará «${titulo}» junto con sus archivos. Esta acción no se puede deshacer.`,
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: CONFIRM_COLOR,
      });

      if (!isConfirmed) return false;

      setEliminando(true);
      const result = await useCases.eliminarItem(entrada);
      setEliminando(false);

      if (!result.success) {
        await Swal.fire({
          icon: "error",
          title: "Error al eliminar el registro",
          text: result.message,
          confirmButtonColor: CONFIRM_COLOR,
        });
        return false;
      }

      await Swal.fire({
        icon: "success",
        title: result.message,
        timer: 1500,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      return true;
    },
    [useCases],
  );

  return { eliminar, eliminando };
}
