import { construirPayloadSubcoleccion } from "../domain/nueva-subcoleccion";
import type { NuevaSubcoleccionEntrada } from "../domain/nueva-subcoleccion";
import type { NuevaSubcoleccionRepository } from "../domain/nueva-subcoleccion-repository";
import type { OperationResult } from "../domain/resultado";

export interface NuevaSubcoleccionUseCases {
  crearSubcoleccion(entrada: NuevaSubcoleccionEntrada): Promise<OperationResult>;
}

export function createNuevaSubcoleccionUseCases(
  repository: NuevaSubcoleccionRepository,
): NuevaSubcoleccionUseCases {
  return {
    async crearSubcoleccion(entrada) {
      if (!entrada.coleccionInternalId) {
        return { success: false, message: "Selecciona una colección padre" };
      }
      if (!entrada.nombre.trim()) {
        return {
          success: false,
          message: "El nombre de la subcolección es obligatorio",
        };
      }
      return repository.create(construirPayloadSubcoleccion(entrada));
    },
  };
}
