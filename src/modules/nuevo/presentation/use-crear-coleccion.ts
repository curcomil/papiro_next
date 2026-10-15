"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import type { NuevaColeccionEntrada } from "../domain/nueva-coleccion";
import { createNuevaColeccionUseCases } from "../application/crear-coleccion";
import { createNuevaColeccionRepository } from "../infrastructure/server-action-nueva-coleccion-repository";
import { RUTA_PANEL } from "./rutas";

const CONFIRM_COLOR = "oklch(42% 0.09 330)";

export function useCrearColeccion() {
  const router = useRouter();
  const useCases = useMemo(
    () => createNuevaColeccionUseCases(createNuevaColeccionRepository()),
    [],
  );

  return useMemo(
    () => ({
      async crearColeccion(entrada: NuevaColeccionEntrada): Promise<boolean> {
        const result = await useCases.crearColeccion(entrada);

        if (!result.success) {
          await Swal.fire({
            icon: "error",
            title: "Error al crear la colección",
            text: result.message,
            confirmButtonColor: CONFIRM_COLOR,
          });
          return false;
        }

        await Swal.fire({
          icon: "success",
          title: "Colección creada",
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
