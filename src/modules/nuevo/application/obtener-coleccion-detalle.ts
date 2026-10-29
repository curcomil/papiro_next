import type {
  ColeccionDetalleRepository,
  ColeccionDetalleResult,
} from "../domain/coleccion-detalle-repository";

export interface ColeccionDetalleUseCases {
  obtenerColeccion(internalId: string): Promise<ColeccionDetalleResult>;
}

export function createColeccionDetalleUseCases(
  repository: ColeccionDetalleRepository,
): ColeccionDetalleUseCases {
  return {
    async obtenerColeccion(internalId) {
      if (!internalId) {
        return {
          success: false,
          message: "Colección no indicada",
          status: 0,
          schema: [],
        };
      }
      return repository.obtener(internalId);
    },
  };
}
