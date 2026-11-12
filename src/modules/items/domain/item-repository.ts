import type { Item } from "./item";
import type {
  ActualizarContenidoEntrada,
  ActualizarItemEntrada,
  ActualizarItemResult,
} from "./actualizar-item";
import type {
  EliminarItemEntrada,
  EliminarItemResult,
} from "./eliminar-item";

export interface ItemResult {
  success: boolean;
  message: string;
  /** Código HTTP de la respuesta: la API no lo incluye en el body. */
  status: number;
  item: Item | null;
}

export interface ItemRepository {
  obtener(internalId: string): Promise<ItemResult>;
  actualizar(entrada: ActualizarItemEntrada): Promise<ActualizarItemResult>;
  actualizarContenido(
    entrada: ActualizarContenidoEntrada,
  ): Promise<ActualizarItemResult>;
  eliminar(entrada: EliminarItemEntrada): Promise<EliminarItemResult>;
}
