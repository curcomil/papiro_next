"use client";

import { useEffect, useMemo, useState } from "react";
import { createColeccionDetalleUseCases } from "../application/obtener-coleccion-detalle";
import type { CampoMetadato } from "../domain/campo-metadato";
import type { ColeccionDetalleResult } from "../domain/coleccion-detalle-repository";
import { createColeccionDetalleRepository } from "../infrastructure/server-action-coleccion-detalle-repository";

export type EstadoMetadatos =
  | { tipo: "idle" }
  | { tipo: "loading" }
  | { tipo: "success"; schema: CampoMetadato[] }
  | { tipo: "error"; message: string; status: number };

/**
 * El schema pertenece a la COLECCIÓN, por eso la petición se identifica con su
 * internal_id y no cambia al pasar de una subcolección a otra de la misma
 * colección. La clave exige que además haya subcolección elegida.
 *
 * "loading" es derivado (clave pedida ≠ clave resuelta), así el efecto solo
 * hace setState dentro del `.then()`.
 */
export function useColeccionDetalle(
  coleccionId: string,
  subcoleccionId: string,
): EstadoMetadatos {
  const useCases = useMemo(
    () => createColeccionDetalleUseCases(createColeccionDetalleRepository()),
    [],
  );
  const [resuelto, setResuelto] = useState<{
    clave: string;
    result: ColeccionDetalleResult;
  } | null>(null);

  const clave = coleccionId && subcoleccionId ? coleccionId : "";

  useEffect(() => {
    if (!clave) return;
    let vigente = true;

    useCases.obtenerColeccion(clave).then((result) => {
      if (vigente) setResuelto({ clave, result });
    });

    return () => {
      vigente = false;
    };
  }, [clave, useCases]);

  if (!clave) return { tipo: "idle" };
  if (!resuelto || resuelto.clave !== clave) return { tipo: "loading" };

  return resuelto.result.success
    ? { tipo: "success", schema: resuelto.result.schema }
    : {
        tipo: "error",
        message: resuelto.result.message,
        status: resuelto.result.status,
      };
}
