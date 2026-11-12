import type {
  ActualizarContenidoEntrada,
  ActualizarItemResult,
} from "../domain/actualizar-item";
import type { ItemRepository } from "../domain/item-repository";

export interface ActualizarContenidoUseCases {
  actualizarContenido(
    entrada: ActualizarContenidoEntrada,
  ): Promise<ActualizarItemResult>;
}

export function createActualizarContenidoUseCases(
  repository: ItemRepository,
): ActualizarContenidoUseCases {
  return {
    async actualizarContenido(entrada) {
      if (!entrada.coleccionInternalId || !entrada.internalId) {
        return { success: false, message: "Item no indicado" };
      }
      if (entrada.sections.length === 0) {
        return {
          success: false,
          message: "El item no tiene páginas para guardar",
        };
      }
      return repository.actualizarContenido(entrada);
    },
  };
}
