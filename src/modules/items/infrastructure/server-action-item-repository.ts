import type { ItemRepository } from "../domain/item-repository";
import {
  actualizarContenido,
  actualizarItem,
  eliminarItem,
  getItem,
} from "./item-api";

export function createItemRepository(): ItemRepository {
  return {
    obtener: (internalId) => getItem(internalId),
    actualizar: (entrada) => actualizarItem(entrada),
    actualizarContenido: (entrada) => actualizarContenido(entrada),
    eliminar: (entrada) => eliminarItem(entrada),
  };
}
