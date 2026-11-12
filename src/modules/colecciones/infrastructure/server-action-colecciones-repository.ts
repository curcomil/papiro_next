import type { ColeccionesRepository } from "../domain/colecciones-repository";
import { getColecciones } from "./colecciones-api";

export function createColeccionesRepository(): ColeccionesRepository {
  return {
    listar: () => getColecciones(),
  };
}
