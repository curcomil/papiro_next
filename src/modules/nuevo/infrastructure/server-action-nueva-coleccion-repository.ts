import type { NuevaColeccionRepository } from "../domain/nueva-coleccion-repository";
import { crearColeccion } from "./nueva-coleccion-api";

export function createNuevaColeccionRepository(): NuevaColeccionRepository {
  return {
    create: (payload) => crearColeccion(payload),
  };
}
