import type { ContenidoItem } from "./contenido-item";

/** Identidad de la colección o subcolección a la que pertenece un item. */
export interface PadreItem {
  nombre: string;
  setspec: string;
  internalId: string;
}

export interface Item {
  internalId: string;
  /** `pending`, `hidden` o `published`. */
  status: string;
  coleccion: PadreItem;
  subcoleccion: PadreItem;
  /** Claves dinámicas: dependen del schema de la colección. */
  metadata: Record<string, unknown>;
  notas: string;
  /** Archivos del item, planos o paginados en secciones. */
  content: ContenidoItem;
}
