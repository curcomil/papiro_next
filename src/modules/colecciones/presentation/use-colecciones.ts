"use client";

import { useEffect, useMemo, useState } from "react";
import { createColeccionesUseCases } from "../application/listar-colecciones";
import type { Coleccion } from "../domain/coleccion";
import { createColeccionesRepository } from "../infrastructure/server-action-colecciones-repository";

/**
 * Misma convención que el resto de paneles: unión discriminada por `tipo`, con
 * "loading" como valor por defecto porque la petición arranca al montar.
 */
export type EstadoColecciones =
  | { tipo: "loading" }
  | { tipo: "success"; colecciones: Coleccion[] }
  | { tipo: "error"; message: string; status: number };

export function useColecciones(): EstadoColecciones {
  const useCases = useMemo(
    () => createColeccionesUseCases(createColeccionesRepository()),
    [],
  );
  const [estado, setEstado] = useState<EstadoColecciones>({ tipo: "loading" });

  useEffect(() => {
    let vigente = true;

    useCases.listarColecciones().then((result) => {
      if (!vigente) return;

      setEstado(
        result.success
          ? { tipo: "success", colecciones: result.colecciones }
          : { tipo: "error", message: result.message, status: result.status },
      );
    });

    return () => {
      vigente = false;
    };
  }, [useCases]);

  return estado;
}
