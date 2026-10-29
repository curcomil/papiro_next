"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { createNuevaSubcoleccionUseCases } from "../application/crear-subcoleccion";
import type { NuevaSubcoleccionEntrada } from "../domain/nueva-subcoleccion";
import { createNuevaSubcoleccionRepository } from "../infrastructure/server-action-nueva-subcoleccion-repository";
import { RUTA_PANEL } from "./rutas";

const CONFIRM_COLOR = "oklch(42% 0.09 330)";

export function useCrearSubcoleccion() {
  const router = useRouter();
  const useCases = useMemo(
    () => createNuevaSubcoleccionUseCases(createNuevaSubcoleccionRepository()),
    [],
  );

  return useMemo(
    () => ({
      async crearSubcoleccion(
        entrada: NuevaSubcoleccionEntrada,
      ): Promise<boolean> {
        const result = await useCases.crearSubcoleccion(entrada);

        if (!result.success) {
          await Swal.fire({
            icon: "error",
            title: "Error al crear la subcolección",
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

        router.push(RUTA_PANEL);
        router.refresh();
        return true;
      },
    }),
    [useCases, router],
  );
}
