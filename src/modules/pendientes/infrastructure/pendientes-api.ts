"use server";

// Server action porque el token vive en una cookie httpOnly que el cliente no
// puede leer, y porque la API está en otro origen (CORS).

import { cookies } from "next/headers";
import type { Pendiente } from "../domain/pendiente";
import type { PaginacionPendientes } from "../domain/pendientes-repository";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:5000";
const SIN_TITULO = "Sin título";

/** Item crudo de Mongo tal como lo devuelve `getpendientes` (sin proyección). */
interface ItemDto {
  internal_id?: string;
  metadata?: Record<string, unknown>;
  parents?: { coleccion?: { internal_id?: string } };
}

interface GetPendientesResponse {
  success: boolean;
  message?: string;
  data?: ItemDto[];
  pagination?: { limit?: number; returned?: number; has_more?: boolean };
}

export interface PendientesResponse {
  success: boolean;
  message: string;
  status: number;
  pendientes: Pendiente[];
  paginacion: PaginacionPendientes;
}

const SIN_PAGINACION: PaginacionPendientes = {
  limit: 0,
  returned: 0,
  hasMore: false,
};

/**
 * `metadata.titulo` es texto, pero el schema admite campos múltiples: si llega
 * como lista se unen sus valores para no pintar un `[object Object]`/coma suelta.
 */
function tituloDe(metadata: Record<string, unknown> | undefined): string {
  const valor = metadata?.titulo;

  if (Array.isArray(valor)) {
    const textos = valor.filter(
      (texto): texto is string => typeof texto === "string" && texto.trim() !== "",
    );
    return textos.length > 0 ? textos.join(", ") : SIN_TITULO;
  }

  if (typeof valor === "string" && valor.trim() !== "") return valor;

  return SIN_TITULO;
}

function portadaDe(metadata: Record<string, unknown> | undefined): string {
  const valor = metadata?.portada;
  return typeof valor === "string" ? valor : "";
}

export async function getPendientes(): Promise<PendientesResponse> {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "No autenticado",
        status: 401,
        pendientes: [],
        paginacion: SIN_PAGINACION,
      };
    }

    const response = await fetch(`${API_URL}/api/xmlibris/getpendientes`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const payload: GetPendientesResponse | null = await response
      .json()
      .catch(() => null);

    // El status viaja en el código HTTP de la respuesta, no en el body.
    const status = response.status;

    if (!response.ok || !payload?.success) {
      return {
        success: false,
        message: payload?.message ?? "No se pudieron obtener los pendientes",
        status,
        pendientes: [],
        paginacion: SIN_PAGINACION,
      };
    }

    const items = payload.data ?? [];

    // Una lista vacía no es un fallo de red, pero se trata como el mismo caso:
    // el panel muestra `message` y el status en vez de un grid sin tarjetas.
    if (items.length === 0) {
      return {
        success: false,
        message: payload.message ?? "No hay registros pendientes",
        status,
        pendientes: [],
        paginacion: SIN_PAGINACION,
      };
    }

    return {
      success: true,
      message: payload.message ?? "OK",
      status,
      pendientes: items.map((item) => ({
        internalId: item.internal_id ?? "",
        coleccionInternalId: item.parents?.coleccion?.internal_id ?? "",
        titulo: tituloDe(item.metadata),
        portada: portadaDe(item.metadata),
      })),
      paginacion: {
        limit: payload.pagination?.limit ?? 0,
        returned: payload.pagination?.returned ?? items.length,
        hasMore: payload.pagination?.has_more ?? false,
      },
    };
  } catch {
    return {
      success: false,
      message: "No se pudo conectar con el servidor",
      status: 0,
      pendientes: [],
      paginacion: SIN_PAGINACION,
    };
  }
}
