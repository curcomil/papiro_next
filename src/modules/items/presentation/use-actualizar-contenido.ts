"use client";

import { useCallback, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { createActualizarContenidoUseCases } from "../application/actualizar-contenido";
import type { ActualizarContenidoEntrada } from "../domain/actualizar-item";
import { createItemRepository } from "../infrastructure/server-action-item-repository";

const CONFIRM_COLOR = "oklch(42% 0.09 330)";

export function useActualizarContenido() {
  const useCases = useMemo(
    () => createActualizarContenidoUseCases(createItemRepository()),
    [],
  );
  const [guardando, setGuardando] = useState(false);

  const guardarContenido = useCallback(
    async (entrada: ActualizarContenidoEntrada): Promise<boolean> => {
      setGuardando(true);
      const result = await useCases.actualizarContenido(entrada);
      setGuardando(false);

      if (!result.success) {
        await Swal.fire({
          icon: "error",
          title: "Error al guardar el contenido",
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

  return { guardarContenido, guardando };
}
