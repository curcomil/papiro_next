import type { ColeccionPadre, Subcoleccion } from "./coleccion-padre";
import type { ValoresMetadatos } from "@/modules/metadatos/domain/campo-metadato";

/** Identidad de la colección y subcolección que espera `POST /newitem`. */
export interface ParentsRegistro {
  coleccion: {
    name_collection: string;
    setspec_collection: string;
    internal_id: string;
  };
  subcoleccion: {
    name_subcollection: string;
    setspec_subcollection: string;
    internal_id: string;
  };
}

export interface NuevoRegistroPayload {
  parents: ParentsRegistro;
  origen: string;
  libro: boolean;
  metadata: ValoresMetadatos;
  /** Solo en libros: identificador del ZIP ya subido por `/upload`. */
  zip_upload_id?: string;
}

export interface RegistroEntrada {
  coleccion: ColeccionPadre;
  subcoleccion: Subcoleccion;
  libro: boolean;
  metadata: ValoresMetadatos;
}

export interface ProgresoSubida {
  cargados: number;
  total: number;
}

/** Se reporta así una subida cancelada para no tratarla como error. */
export const MENSAJE_CANCELADO = "Subida cancelada";

/**
 * La API revalida `parents` contra la base y descarta lo que no coincida, pero
 * el schema exige los seis campos, así que se envían completos.
 */
export function construirParents(
  coleccion: ColeccionPadre,
  subcoleccion: Subcoleccion,
): ParentsRegistro {
  return {
    coleccion: {
      name_collection: coleccion.nombre,
      setspec_collection: coleccion.setspec,
      internal_id: coleccion.internalId,
    },
    subcoleccion: {
      name_subcollection: subcoleccion.nombre,
      setspec_subcollection: subcoleccion.setspec,
      internal_id: subcoleccion.internalId,
    },
  };
}

/**
 * `origen` no se pregunta en el formulario: se hereda de la colección, que es
 * la que decide si el item vive en `items` o en `items_tesis`.
 */
export function construirPayload(
  entrada: RegistroEntrada,
  zipUploadId?: string,
): NuevoRegistroPayload {
  return {
    parents: construirParents(entrada.coleccion, entrada.subcoleccion),
    origen: entrada.coleccion.origen,
    libro: entrada.libro,
    metadata: entrada.metadata,
    ...(zipUploadId ? { zip_upload_id: zipUploadId } : {}),
  };
}
