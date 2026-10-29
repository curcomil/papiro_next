import type { ColeccionDetalleRepository } from "../domain/coleccion-detalle-repository";
import { getColeccionDetalle } from "./coleccion-detalle-api";

export function createColeccionDetalleRepository(): ColeccionDetalleRepository {
  return {
    obtener: (internalId) => getColeccionDetalle(internalId),
  };
}
