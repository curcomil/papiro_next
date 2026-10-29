import { construirPayload, MENSAJE_CANCELADO } from "../domain/nuevo-registro";
import type { ProgresoSubida, RegistroEntrada } from "../domain/nuevo-registro";
import type { RegistroRepository } from "../domain/registro-repository";
import type { OperationResult } from "../domain/resultado";

export interface CrearRegistroOpciones {
  onProgreso?: (progreso: ProgresoSubida) => void;
  /** Entrega el cancelador de la subida mientras está en curso. */
  onSubidaIniciada?: (cancelar: () => void) => void;
  /** Avisa del `upload_id` obtenido, para poder reutilizarlo en un reintento. */
  onSubidaCompletada?: (zipUploadId: string) => void;
  /** ZIP ya subido en un intento previo: evita volver a subir cientos de MB. */
  zipUploadId?: string;
}

export interface CrearRegistroUseCases {
  crearRegistro(
    entrada: RegistroEntrada,
    archivo: File | null,
    opciones?: CrearRegistroOpciones,
  ): Promise<OperationResult>;
}

function mensajeDeError(error: unknown): string {
  if (error instanceof DOMException && error.name === "AbortError") {
    return MENSAJE_CANCELADO;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "No se pudo completar la operación";
}

export function createCrearRegistroUseCases(
  repository: RegistroRepository,
): CrearRegistroUseCases {
  return {
    async crearRegistro(entrada, archivo, opciones = {}) {
      if (!archivo) {
        return {
          success: false,
          message: entrada.libro
            ? "Adjunta el archivo .zip del libro"
            : "Adjunta el archivo del registro",
        };
      }

      let zipUploadId = opciones.zipUploadId;

      // Solo el libro sube primero: su ZIP puede pesar gigas y así el alta no
      // se reprocesa si algo falla después.
      if (entrada.libro && !zipUploadId) {
        const subida = repository.subirZip(archivo, opciones.onProgreso);
        opciones.onSubidaIniciada?.(subida.cancelar);

        try {
          zipUploadId = await subida.promesa;
        } catch (error) {
          return { success: false, message: mensajeDeError(error) };
        }

        opciones.onSubidaCompletada?.(zipUploadId);
      }

      try {
        return await repository.crear(
          construirPayload(entrada, zipUploadId),
          archivo,
        );
      } catch (error) {
        return { success: false, message: mensajeDeError(error) };
      }
    },
  };
}
