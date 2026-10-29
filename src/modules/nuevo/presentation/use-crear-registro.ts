"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { createCrearRegistroUseCases } from "../application/crear-registro";
import { MENSAJE_CANCELADO } from "../domain/nuevo-registro";
import type { ProgresoSubida, RegistroEntrada } from "../domain/nuevo-registro";
import { createRegistroRepository } from "../infrastructure/registro-repository";
import { RUTA_PANEL } from "./rutas";

const CONFIRM_COLOR = "oklch(42% 0.09 330)";

export function useCrearRegistro() {
  const router = useRouter();
  const useCases = useMemo(
    () => createCrearRegistroUseCases(createRegistroRepository()),
    [],
  );

  const cancelarRef = useRef<(() => void) | null>(null);
  // ZIP ya subido y su archivo: si el alta falla, el reintento no resube.
  const subidaRef = useRef<{ archivo: File; uploadId: string } | null>(null);

  const [progreso, setProgreso] = useState<ProgresoSubida | null>(null);
  const [enviando, setEnviando] = useState(false);

  const cancelar = useCallback(() => {
    cancelarRef.current?.();
    cancelarRef.current = null;
  }, []);

  const crearRegistro = useCallback(
    async (entrada: RegistroEntrada, archivo: File | null): Promise<boolean> => {
      setEnviando(true);
      setProgreso(
        entrada.libro && archivo ? { cargados: 0, total: archivo.size } : null,
      );

      const zipPrevio =
        archivo && subidaRef.current?.archivo === archivo
          ? subidaRef.current.uploadId
          : undefined;

      const result = await useCases.crearRegistro(entrada, archivo, {
        zipUploadId: zipPrevio,
        onProgreso: setProgreso,
        onSubidaIniciada: (cancelarSubida) => {
          cancelarRef.current = cancelarSubida;
        },
        onSubidaCompletada: (uploadId) => {
          if (archivo) {
            subidaRef.current = { archivo, uploadId };
          }
        },
      });

      cancelarRef.current = null;
      setProgreso(null);
      setEnviando(false);

      if (!result.success) {
        // Cancelar es una acción deliberada del usuario, no un error.
        if (result.message !== MENSAJE_CANCELADO) {
          await Swal.fire({
            icon: "error",
            title: "Error al crear el registro",
            text: result.message,
            confirmButtonColor: CONFIRM_COLOR,
          });
        }
        return false;
      }

      subidaRef.current = null;

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
    [useCases, router],
  );

  return { crearRegistro, progreso, enviando, cancelar };
}
