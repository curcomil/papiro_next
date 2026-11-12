import type {
  ColeccionesRepository,
  ColeccionesResult,
} from "../domain/colecciones-repository";

export interface ColeccionesUseCases {
  listarColecciones(): Promise<ColeccionesResult>;
}

export function createColeccionesUseCases(
  repository: ColeccionesRepository,
): ColeccionesUseCases {
  return {
    listarColecciones: () => repository.listar(),
  };
}
