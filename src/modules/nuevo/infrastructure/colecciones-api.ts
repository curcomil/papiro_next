const API_URL = process.env.API_URL ?? "http://127.0.0.1:5000";

interface MetadataDto {
  notas: string;
  miniatura: string;
  referencia_externa: string;
}

export interface SubcoleccionDto {
  name_subcollection: string;
  setspec_subcollection: string;
  internal_id: string;
  app: MetadataDto;
  status: string;
}

/** Forma cruda de cada colección en la respuesta de la API. */
export interface ColeccionDto {
  coleccion: {
    name_collection: string;
    setspec_collection: string;
    internal_id: string;
  };
  subcolecciones?: SubcoleccionDto[];
  app: MetadataDto;
  status: string;
  origen: string;
}

interface GetAllCollectionsResponse {
  success: boolean;
  message?: string;
  data?: ColeccionDto[];
  status?: number;
}

export interface ColeccionesApiResponse {
  success: boolean;
  message: string;
  data: ColeccionDto[];
}

export interface GetColeccionesOpciones {
  conSubcolecciones?: boolean;
}

/**
 * Se llama desde el servidor al renderizar, por eso no es server action.
 * Sin `conSubcolecciones` se añade `sin_subcolecciones=true`, que aligera la
 * respuesta. El endpoint no pide token.
 */
export async function getColecciones(
  opciones: GetColeccionesOpciones = {},
): Promise<ColeccionesApiResponse> {
  const query = opciones.conSubcolecciones ? "" : "?sin_subcolecciones=true";

  try {
    const response = await fetch(
      `${API_URL}/api/xmlibris/getallcollections${query}`,
      { method: "GET", cache: "no-store" },
    );

    const payload: GetAllCollectionsResponse | null = await response
      .json()
      .catch(() => null);

    if (!response.ok || !payload?.success) {
      return {
        success: false,
        message: payload?.message ?? "No se pudieron obtener las colecciones",
        data: [],
      };
    }

    return {
      success: true,
      message: payload.message ?? "OK",
      data: payload.data ?? [],
    };
  } catch {
    return {
      success: false,
      message: "No se pudo conectar con el servidor",
      data: [],
    };
  }
}
