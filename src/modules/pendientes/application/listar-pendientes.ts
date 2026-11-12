import type {
  PendientesRepository,
  PendientesResult,
} from "../domain/pendientes-repository";

export interface PendientesUseCases {
  listarPendientes(): Promise<PendientesResult>;
}

export function createPendientesUseCases(
  repository: PendientesRepository,
): PendientesUseCases {
  return {
    listarPendientes: () => repository.listar(),
  };
}
