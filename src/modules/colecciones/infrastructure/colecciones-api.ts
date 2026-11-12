"use server";

// Server action porque el token vive en una cookie httpOnly que el cliente no
// puede leer, y porque la API está en otro origen (CORS).

import { cookies } from "next/headers";
import type { Coleccion } from "../domain/coleccion";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:5000";

interface ColeccionDto {
  coleccion?: {
    name_collection?: string;
    setspec_collection?: string;
    internal_id?: string;
  };
  app?: { miniatura?: string };
}

interface GetMyCollectionsResponse {
  success: boolean;
  message?: string;
  data?: ColeccionDto[];
}

export interface ColeccionesResponse {
  success: boolean;
  message: string;
  status: number;
  colecciones: Coleccion[];
}

export async function getColecciones(): Promise<ColeccionesResponse> {
  try {
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return {
        success: false,
        message: "No autenticado",
        status: 401,
        colecciones: [],
      };
    }

    const response = await fetch(`${API_URL}/api/xmlibris/getmycollections`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    const payload: GetMyCollectionsResponse | null = await response
      .json()
      .catch(() => null);

    // El status viaja en el código HTTP de la respuesta, no en el body.
    const status = response.status;

    if (!response.ok || !payload?.success) {
      return {
        success: false,
        message: payload?.message ?? "No se pudieron obtener tus colecciones",
        status,
        colecciones: [],
      };
    }

    // Una lista vacía es un resultado válido aquí: el usuario no tiene
    // colecciones asignadas, no es un fallo.
    return {
      success: true,
      message: payload.message ?? "OK",
      status,
      colecciones: (payload.data ?? []).map((item) => ({
        internalId: item.coleccion?.internal_id ?? "",
        nombre: item.coleccion?.name_collection ?? "Sin nombre",
        setspec: item.coleccion?.setspec_collection ?? "",
        miniatura: item.app?.miniatura ?? "",
      })),
    };
  } catch {
    return {
      success: false,
      message: "No se pudo conectar con el servidor",
      status: 0,
      colecciones: [],
    };
  }
}
