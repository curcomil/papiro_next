import type { NuevoRegistroPayload, ProgresoSubida } from "./nuevo-registro";
import type { OperationResult } from "./resultado";

export interface SubidaZip {
  /** Resuelve con el `upload_id` que consume el alta del item. */
  promesa: Promise<string>;
  cancelar: () => void;
}

export interface RegistroRepository {
  /** Sube el ZIP por cuerpo crudo y devuelve su identificador. */
  subirZip(
    archivo: File,
    onProgreso?: (progreso: ProgresoSubida) => void,
  ): SubidaZip;
  /** Alta del item: JSON para libros, multipart para el resto. */
  crear(
    payload: NuevoRegistroPayload,
    archivo?: File,
  ): Promise<OperationResult>;
}
