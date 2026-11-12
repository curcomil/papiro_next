import type { Pendiente } from "./pendiente";

/** Tope de resultados que aplica la API en el bloque `pagination`. */
export interface PaginacionPendientes {
  limit: number;
  returned: number;
  hasMore: boolean;
}

export interface PendientesResult {
  success: boolean;
  message: string;
  /** Código HTTP de la respuesta: la API no lo incluye en el body. */
  status: number;
  pendientes: Pendiente[];
  paginacion: PaginacionPendientes;
}

export interface PendientesRepository {
  listar(): Promise<PendientesResult>;
}
