import type { CampoMetadato } from "./campo-metadato";

export interface ColeccionDetalleResult {
  success: boolean;
  message: string;
  /** Código HTTP de la respuesta: la API no lo incluye en el body. */
  status: number;
  schema: CampoMetadato[];
}

export interface ColeccionDetalleRepository {
  obtener(internalId: string): Promise<ColeccionDetalleResult>;
}
