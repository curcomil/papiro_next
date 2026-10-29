import type { ColeccionesListResult } from "./coleccion-padre";

export interface ListarColeccionesOpciones {
  /** Si es false se usa `sin_subcolecciones=true` y la respuesta es más ligera. */
  conSubcolecciones?: boolean;
}

export interface ColeccionesRepository {
  list(
    opciones?: ListarColeccionesOpciones,
  ): Promise<ColeccionesListResult>;
}
