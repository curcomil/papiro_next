"use client";

import { useEffect, useMemo, useState } from "react";
import { createItemUseCases } from "../application/obtener-item";
import type { Item } from "../domain/item";
import { createItemRepository } from "../infrastructure/server-action-item-repository";

/**
 * Misma convención que `EstadoPendientes` y `EstadoMetadatos`: unión
 * discriminada por `tipo`, con "loading" como valor por defecto porque la
 * petición arranca al montar el panel.
 */
export type EstadoItem =
  | { tipo: "loading" }
  | { tipo: "success"; item: Item }
  | { tipo: "error"; message: string; status: number };

export function useItem(internalId: string): EstadoItem {
  const useCases = useMemo(
    () => createItemUseCases(createItemRepository()),
    [],
  );
  const [estado, setEstado] = useState<EstadoItem>({ tipo: "loading" });

  useEffect(() => {
    let vigente = true;

    useCases.obtenerItem(internalId).then((result) => {
      if (!vigente) return;

      setEstado(
        result.success && result.item
          ? { tipo: "success", item: result.item }
          : { tipo: "error", message: result.message, status: result.status },
      );
    });

    return () => {
      vigente = false;
    };
  }, [internalId, useCases]);

  return estado;
}
