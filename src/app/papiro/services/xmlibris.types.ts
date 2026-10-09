export interface Generic_response {
  success: boolean;
  message: string;
}

export interface AppMetadata {
  notas: string;
  miniatura: string;
  referencia_externa: string;
}

export interface ColeccionInfo {
  name_collection: string;
  setspec_collection: string;
  internal_id: string;
}

/**
 * Subcolección embebida en el registro de colecciones.
 * OJO: NO tiene `origen` — ese campo vive en el documento de la colección.
 */
export interface Subcoleccion {
  name_subcollection: string;
  setspec_subcollection: string;
  internal_id: string;
  app: AppMetadata;
  status: string;
}

/** Documento que devuelve GET /getallcollections (sin schema ni exportacion_fija). */
export interface ColeccionDocument {
  _id: string;
  coleccion: ColeccionInfo;
  subcolecciones: Subcoleccion[];
  app: AppMetadata;
  status: string;
  origen: string;
}

/** Campo del formulario declarado por la colección en su `schema[]`. */
export interface SchemaCampo {
  campo: string;
  es_multiple: boolean;
  requerido: boolean;
  frontend?: { label?: string; tipo_input?: string };
  exportacion_dc?: {
    etiqueta?: string | null;
    etiqueta_final_alma?: string | null;
  } | null;
}

/** Regla de exportación fija de la colección (a veces condicional). */
export interface ExportacionFija {
  etiqueta: string;
  valor?: string;
  condicional?: { campo: string; si_presente: string; si_ausente: string };
}

/** Documento que devuelve GET /getcollection/<internal_id>: el registro completo. */
export interface ColeccionDetalle extends ColeccionDocument {
  exportacion_fija: ExportacionFija[];
  schema: SchemaCampo[];
}

export interface ResponseGetAllCollections {
  success: boolean;
  message: string;
  data: Array<ColeccionDocument>;
}
