"use server";

// Server action porque el token vive en una cookie httpOnly que el cliente no
// puede leer, y porque la API está en otro origen (CORS).

import { cookies } from "next/headers";
import type {
  ActualizarContenidoEntrada,
  ActualizarItemEntrada,
  ActualizarItemResult,
} from "../domain/actualizar-item";
import type { Item } from "../domain/item";
import type {
  EliminarItemEntrada,
  EliminarItemResult,
} from "../domain/eliminar-item";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:5000";

interface ColeccionDto {
  name_collection?: string;
  setspec_collection?: string;
  internal_id?: string;
}

interface SubcoleccionDto {
  name_subcollection?: string;
  setspec_subcollection?: string;
  internal_id?: string;
}

interface ItemDto {
  internal_id?: string;
  status?: string;
  parents?: {
    coleccion?: ColeccionDto;
    subcoleccion?: SubcoleccionDto;
  };
  metadata?: Record<string, unknown>;
  app?: { notas?: string | null };
  content?: Record<string, unknown>[];
}

interface GetItemResponse {
  success: boolean;
  message?: string;
  data?: ItemDto;
}

export interface ItemResponse {
  success: boolean;
  message: string;
  status: number;
  item: Item | null;
}

export async function getItem(internalId: string): Promise<ItemResponse> {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "No autenticado",
        status: 401,
        item: null,
      };
    }

    const response = await fetch(
      `${API_URL}/api/xmlibris/getitem?internal_id=${encodeURIComponent(internalId)}`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    const payload: GetItemResponse | null = await response
      .json()
      .catch(() => null);

    // El status viaja en el código HTTP de la respuesta, no en el body.
    const status = response.status;

    if (!response.ok || !payload?.success || !payload.data) {
      return {
        success: false,
        message: payload?.message ?? "No se pudo obtener el item",
        status,
        item: null,
      };
    }

    const dto = payload.data;
    const coleccion = dto.parents?.coleccion ?? {};
    const subcoleccion = dto.parents?.subcoleccion ?? {};

    return {
      success: true,
      message: payload.message ?? "OK",
      status,
      item: {
        internalId: dto.internal_id ?? internalId,
        status: dto.status ?? "",
        coleccion: {
          nombre: coleccion.name_collection ?? "",
          setspec: coleccion.setspec_collection ?? "",
          internalId: coleccion.internal_id ?? "",
        },
        subcoleccion: {
          nombre: subcoleccion.name_subcollection ?? "",
          setspec: subcoleccion.setspec_subcollection ?? "",
          internalId: subcoleccion.internal_id ?? "",
        },
        metadata: dto.metadata ?? {},
        notas: dto.app?.notas ?? "",
        content: dto.content ?? [],
      },
    };
  } catch {
    return {
      success: false,
      message: "No se pudo conectar con el servidor",
      status: 0,
      item: null,
    };
  }
}

interface RespuestaApi {
  success?: boolean;
  message?: string;
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
): Promise<ActualizarItemResult> {
  const cuerpo = (await response.json().catch(() => null)) as RespuestaApi | null;

  if (response.ok && cuerpo?.success) {
    return { success: true, message: cuerpo.message ?? mensajeOk };
  }

  const base =
    cuerpo?.message ??
    (response.ok ? "El servidor no confirmó el cambio" : `Error ${response.status}`);
  const detalle = mensajeDeDetalles(cuerpo);

  return { success: false, message: detalle ? `${base}: ${detalle}` : base };
}

/**
 * Actualización parcial: la API acepta las claves anidadas bajo `data`, igual
 * que `/newitem`, y las aplica como `$set` sobre la metadata del item.
 */
export async function actualizarItem(
  entrada: ActualizarItemEntrada,
): Promise<ActualizarItemResult> {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return { success: false, message: "No autenticado" };
    }

    const ruta = `${API_URL}/api/xmlibris/${encodeURIComponent(
      entrada.coleccionInternalId,
    )}/item/${encodeURIComponent(entrada.internalId)}`;

    const response = await fetch(ruta, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ data: entrada.metadata }),
      cache: "no-store",
    });

    return leerRespuesta(response, "Item actualizado");
  } catch {
    return { success: false, message: "No se pudo conectar con el servidor" };
  }
}

/**
 * Guarda la relación secciones↔páginas. En items `pending` los `file_name` son
 * los archivos reales de `pendiente/`: el renombrado ocurre al publicar.
 */
export async function actualizarContenido(
  entrada: ActualizarContenidoEntrada,
): Promise<ActualizarItemResult> {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return { success: false, message: "No autenticado" };
    }

    const ruta = `${API_URL}/api/xmlibris/updatecontent/${encodeURIComponent(
      entrada.coleccionInternalId,
    )}/${encodeURIComponent(entrada.internalId)}`;

    const response = await fetch(ruta, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sections: entrada.sections }),
      cache: "no-store",
    });

    return leerRespuesta(response, "Contenido guardado");
  } catch {
    return { success: false, message: "No se pudo conectar con el servidor" };
  }
}

/**
 * Borra el documento del item y sus binarios. Si el disco falla después del
 * borrado en Mongo, la API responde 200 con un aviso en el mensaje.
 */
export async function eliminarItem(
  entrada: EliminarItemEntrada,
): Promise<EliminarItemResult> {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return { success: false, message: "No autenticado" };
    }

    const ruta = `${API_URL}/api/xmlibris/deleteitem/${encodeURIComponent(
      entrada.coleccionInternalId,
    )}/${encodeURIComponent(entrada.internalId)}`;

    const response = await fetch(ruta, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    return leerRespuesta(response, "Item eliminado");
  } catch {
    return { success: false, message: "No se pudo conectar con el servidor" };
  }
}
