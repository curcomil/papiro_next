import type { NuevaColeccionPayload } from "./nueva-coleccion";

export interface OperationResult {
  success: boolean;
  message: string;
}

export interface NuevaColeccionRepository {
  create(payload: NuevaColeccionPayload): Promise<OperationResult>;
}
