"use server";

// Server action porque la llamada se dispara desde el cliente y la API vive en
// otro origen (CORS). El endpoint no pide token.

import type { CampoMetadato } from "../domain/campo-metadato";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:5000";

interface SchemaDto {
  campo: string;
  es_multiple: boolean;
  requerido: boolean;
  frontend?: { label?: string; tipo_input?: string };
}

interface GetCollectionResponse {
  success: boolean;
  message?: string;
  data?: { schema?: SchemaDto[] };
}

interface ColeccionDetalleResponse {
  success: boolean;
  message: string;
  status: number;
  schema: CampoMetadato[];
}

export async function getColeccionDetalle(
  internalId: string,
): Promise<ColeccionDetalleResponse> {
  try {
    const response = await fetch(
      `${API_URL}/api/xmlibris/getcollection/${internalId}`,
      { method: "GET", cache: "no-store" },
    );

    const payload: GetCollectionResponse | null = await response
      .json()
      .catch(() => null);

    // El status viaja en el código HTTP de la respuesta, no en el body.
    const status = response.status;

    if (!response.ok || !payload?.success) {
      return {
        success: false,
        message: payload?.message ?? "No se pudo obtener la colección",
        status,
        schema: [],
      };
    }

    const schema: CampoMetadato[] = (payload.data?.schema ?? []).map(
      (campo) => ({
        campo: campo.campo,
        esMultiple: campo.es_multiple,
        requerido: campo.requerido,
        label: campo.frontend?.label ?? campo.campo,
        tipoInput: campo.frontend?.tipo_input ?? "text",
      }),
    );

    return { success: true, message: payload.message ?? "OK", status, schema };
  } catch {
    return {
      success: false,
      message: "No se pudo conectar con el servidor",
      status: 0,
      schema: [],
    };
  }
}
