"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createPendientesUseCases } from "../application/listar-pendientes";
import type { Pendiente } from "../domain/pendiente";
import type { PaginacionPendientes } from "../domain/pendientes-repository";
import { createPendientesRepository } from "../infrastructure/server-action-pendientes-repository";

/**
 * Misma convención que `EstadoMetadatos`: unión discriminada por `tipo`.
 * Aquí no hay "idle" porque la lista no depende de ninguna selección: al
 * montarse el panel ya hay una petición en curso, así que "loading" es el
 * valor por defecto.
 */
export type EstadoPendientes =
  | { tipo: "loading" }
  | { tipo: "success"; pendientes: Pendiente[]; paginacion: PaginacionPendientes }
  | { tipo: "error"; message: string; status: number };

export function usePendientes() {
  const useCases = useMemo(
    () => createPendientesUseCases(createPendientesRepository()),
    [],
  );
  const [estado, setEstado] = useState<EstadoPendientes>({ tipo: "loading" });
  /** Cambiar la versión vuelve a pedir la lista sin limpiar la actual. */
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let vigente = true;

    useCases.listarPendientes().then((result) => {
      if (!vigente) return;

      setEstado(
        result.success
          ? {
              tipo: "success",
              pendientes: result.pendientes,
              paginacion: result.paginacion,
            }
          : {
              tipo: "error",
              message: result.message,
              status: result.status,
            },
      );
    });

    return () => {
      vigente = false;
    };
  }, [useCases, version]);

  const recargar = useCallback(() => {
    setVersion((actual) => actual + 1);
  }, []);

  return { estado, recargar };
}
