import { construirPayload } from "../domain/nueva-coleccion";
import type { NuevaColeccionEntrada } from "../domain/nueva-coleccion";
import type {
  NuevaColeccionRepository,
  OperationResult,
} from "../domain/nueva-coleccion-repository";
import { hayCampoLleno } from "../domain/schema-coleccion";

export interface NuevaColeccionUseCases {
  crearColeccion(entrada: NuevaColeccionEntrada): Promise<OperationResult>;
}

export function createNuevaColeccionUseCases(
  repository: NuevaColeccionRepository,
): NuevaColeccionUseCases {
  return {
    async crearColeccion(entrada) {
      if (!entrada.titulo.trim()) {
        return { success: false, message: "El título es obligatorio" };
      }
      if (!entrada.origen) {
        return { success: false, message: "El origen es obligatorio" };
      }
      if (!hayCampoLleno(entrada.schema)) {
        return {
          success: false,
          message: "El schema requiere al menos un campo completo",
        };
      }
      return repository.create(construirPayload(entrada));
    },
  };
}
