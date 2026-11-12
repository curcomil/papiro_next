import type { ItemRepository, ItemResult } from "../domain/item-repository";

export interface ItemUseCases {
  obtenerItem(internalId: string): Promise<ItemResult>;
}

export function createItemUseCases(repository: ItemRepository): ItemUseCases {
  return {
    async obtenerItem(internalId) {
      if (!internalId) {
        return {
          success: false,
          message: "Item no indicado",
          status: 0,
          item: null,
        };
      }
      return repository.obtener(internalId);
    },
  };
}
