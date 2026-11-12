/** Un item en estado `pending`, tal como lo devuelve la API. */
export interface Pendiente {
  internalId: string;
  /** Colección a la que pertenece: la piden los endpoints de escritura. */
  coleccionInternalId: string;
  titulo: string;
  /**
   * Ruta relativa de la portada (`coleccion/subcoleccion/item/archivo`), ya
   * reescrita por la API. Vacía cuando el item no tiene portada.
   */
  portada: string;
}
