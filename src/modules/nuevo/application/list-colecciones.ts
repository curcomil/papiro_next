import { ordenarPorNombre } from "../domain/coleccion-padre";
import type { ColeccionesListResult } from "../domain/coleccion-padre";
import type {
  ColeccionesRepository,
  ListarColeccionesOpciones,
} from "../domain/colecciones-repository";

export interface ColeccionesUseCases {
  listColecciones(
    opciones?: ListarColeccionesOpciones,
  ): Promise<ColeccionesListResult>;
}

export function createColeccionesUseCases(
  repository: ColeccionesRepository,
): ColeccionesUseCases {
  return {
    async listColecciones(opciones) {
      const result = await repository.list(opciones);
      return {
        ...result,
        colecciones: ordenarPorNombre(result.colecciones).map((coleccion) => ({
          ...coleccion,
          subcolecciones: ordenarPorNombre(coleccion.subcolecciones),
        })),
      };
    },
  };
}
