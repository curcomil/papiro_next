import type { NuevaColeccionPayload } from "./nueva-coleccion";
import type { OperationResult } from "./resultado";

export interface NuevaColeccionRepository {
  create(payload: NuevaColeccionPayload): Promise<OperationResult>;
}
