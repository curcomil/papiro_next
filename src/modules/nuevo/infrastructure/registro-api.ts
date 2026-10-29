import type {
  NuevoRegistroPayload,
  ProgresoSubida,
} from "../domain/nuevo-registro";
import type { SubidaZip } from "../domain/registro-repository";
import type { OperationResult } from "../domain/resultado";

/**
 * Peticiones directas al mismo origen. En producción nginx enruta
 * `/api/xmlibris/*` a Flask sin pasar por Next; el navegador autentica con la
 * cookie del token, que la API acepta desde `JWT_TOKEN_LOCATION`.
 */
const RUTA_ITEM = "/api/xmlibris/newitem";
const RUTA_SUBIDA = "/api/xmlibris/upload";

interface RespuestaApi {
  success?: boolean;
  message?: string;
  data?: { upload_id?: string };
  detalles?: { msg?: string; loc?: unknown[] }[];
}

/** Los 422 traen `detalles`: sin ellos el usuario solo ve "datos no válidos". */
function mensajeDeDetalles(cuerpo: RespuestaApi | null): string | undefined {
  const detalles = cuerpo?.detalles;
  if (!Array.isArray(detalles) || detalles.length === 0) {
    return undefined;
  }

  const mensajes = detalles
    .map((detalle) => detalle?.msg)
    .filter((mensaje): mensaje is string => Boolean(mensaje));

  if (mensajes.length === 0) {
    return undefined;
  }

  return [...new Set(mensajes)].slice(0, 3).join(" · ");
}

async function leerRespuesta(
  response: Response,
  mensajeOk: string,
): Promise<OperationResult> {
  const cuerpo = (await response.json().catch(() => null)) as RespuestaApi | null;

  if (response.ok && cuerpo?.success) {
    return { success: true, message: cuerpo.message ?? mensajeOk };
  }

  const base =
    cuerpo?.message ??
    (response.ok ? "El servidor no confirmó el alta" : `Error ${response.status}`);
  const detalle = mensajeDeDetalles(cuerpo);

  return { success: false, message: detalle ? `${base}: ${detalle}` : base };
}

/**
 * Sube el ZIP como cuerpo crudo. Se usa XHR y no `fetch` porque hace falta el
 * progreso de subida: con archivos de varios GB es la única señal para el
 * usuario, y además permite cancelar (`abort`).
 */
export function subirZip(
  archivo: File,
  onProgreso?: (progreso: ProgresoSubida) => void,
): SubidaZip {
  const xhr = new XMLHttpRequest();

  const promesa = new Promise<string>((resolve, reject) => {
    xhr.open("POST", RUTA_SUBIDA);
    xhr.setRequestHeader("Content-Type", "application/zip");
    // Sin límite de tiempo: un ZIP grande puede tardar muchos minutos.
    xhr.timeout = 0;

    xhr.upload.onprogress = (evento) => {
      if (evento.lengthComputable) {
        onProgreso?.({ cargados: evento.loaded, total: evento.total });
      }
    };

    xhr.onload = () => {
      let cuerpo: RespuestaApi | null = null;
      try {
        cuerpo = JSON.parse(xhr.responseText) as RespuestaApi;
      } catch {
        cuerpo = null;
      }

      const uploadId = cuerpo?.data?.upload_id;

      if (xhr.status >= 200 && xhr.status < 300 && cuerpo?.success && uploadId) {
        resolve(uploadId);
        return;
      }

      reject(
        new Error(
          cuerpo?.message ?? `No se pudo subir el archivo (${xhr.status})`,
        ),
      );
    };

    xhr.onerror = () => reject(new Error("No se pudo conectar con el servidor"));
    xhr.onabort = () => reject(new DOMException("Subida cancelada", "AbortError"));

    // El File va como cuerpo: el navegador lo lee del disco y lo streamea, sin
    // cargarlo en memoria.
    xhr.send(archivo);
  });

  return { promesa, cancelar: () => xhr.abort() };
}

export async function crearItem(
  payload: NuevoRegistroPayload,
  archivo?: File,
): Promise<OperationResult> {
  if (payload.libro) {
    const response = await fetch(`${RUTA_ITEM}?libro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    return leerRespuesta(response, "Registro creado");
  }

  const formulario = new FormData();
  formulario.append("data", JSON.stringify(payload));
  if (archivo) {
    formulario.append("files", archivo);
  }

  const response = await fetch(RUTA_ITEM, {
    method: "POST",
    body: formulario,
  });

  return leerRespuesta(response, "Registro creado");
}
