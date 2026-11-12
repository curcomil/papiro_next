import type { Coleccion } from "./coleccion";

export interface ColeccionesResult {
  success: boolean;
  message: string;
  /** Código HTTP de la respuesta: la API no lo incluye en el body. */
  status: number;
  colecciones: Coleccion[];
}

export interface ColeccionesRepository {
  listar(): Promise<ColeccionesResult>;
}
