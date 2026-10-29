import type { NuevaSubcoleccionRepository } from "../domain/nueva-subcoleccion-repository";
import { crearSubcoleccion } from "./nueva-subcoleccion-api";

export function createNuevaSubcoleccionRepository(): NuevaSubcoleccionRepository {
  return {
    create: (payload) => crearSubcoleccion(payload),
  };
}
