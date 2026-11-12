import type {
  EliminarItemEntrada,
  EliminarItemResult,
} from "../domain/eliminar-item";
import type { ItemRepository } from "../domain/item-repository";

export interface EliminarItemUseCases {
  eliminarItem(entrada: EliminarItemEntrada): Promise<EliminarItemResult>;
}

export function createEliminarItemUseCases(
  repository: ItemRepository,
): EliminarItemUseCases {
  return {
    async eliminarItem(entrada) {
      if (!entrada.coleccionInternalId || !entrada.internalId) {
        return { success: false, message: "Item no indicado" };
      }
      return repository.eliminar(entrada);
    },
  };
}
