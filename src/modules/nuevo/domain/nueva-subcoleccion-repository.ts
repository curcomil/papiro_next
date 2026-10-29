import type { NuevaSubcoleccionPayload } from "./nueva-subcoleccion";
import type { OperationResult } from "./resultado";

export interface NuevaSubcoleccionRepository {
  create(payload: NuevaSubcoleccionPayload): Promise<OperationResult>;
}
