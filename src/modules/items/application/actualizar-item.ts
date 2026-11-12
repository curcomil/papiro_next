import type {
  ActualizarItemEntrada,
  ActualizarItemResult,
} from "../domain/actualizar-item";
import type { ItemRepository } from "../domain/item-repository";

export interface ActualizarItemUseCases {
  actualizarItem(entrada: ActualizarItemEntrada): Promise<ActualizarItemResult>;
}

export function createActualizarItemUseCases(
  repository: ItemRepository,
): ActualizarItemUseCases {
  return {
    async actualizarItem(entrada) {
      if (!entrada.coleccionInternalId || !entrada.internalId) {
        return { success: false, message: "Item no indicado" };
      }
      return repository.actualizar(entrada);
    },
  };
}
