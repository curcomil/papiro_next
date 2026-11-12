"use client";

import { useCallback, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { createActualizarItemUseCases } from "../application/actualizar-item";
import type { ActualizarItemEntrada } from "../domain/actualizar-item";
import { createItemRepository } from "../infrastructure/server-action-item-repository";

const CONFIRM_COLOR = "oklch(42% 0.09 330)";

export function useActualizarItem() {
  const useCases = useMemo(
    () => createActualizarItemUseCases(createItemRepository()),
    [],
  );
  const [enviando, setEnviando] = useState(false);

  const guardar = useCallback(
    async (entrada: ActualizarItemEntrada): Promise<boolean> => {
      setEnviando(true);
      const result = await useCases.actualizarItem(entrada);
      setEnviando(false);

      if (!result.success) {
        await Swal.fire({
          icon: "error",
          title: "Error al guardar el item",
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

  return { guardar, enviando };
}
