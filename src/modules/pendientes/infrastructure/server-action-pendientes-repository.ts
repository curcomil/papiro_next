import type { PendientesRepository } from "../domain/pendientes-repository";
import { getPendientes } from "./pendientes-api";

export function createPendientesRepository(): PendientesRepository {
  return {
    listar: () => getPendientes(),
  };
}
