import { DUBLIN_CORE_NONE, LABEL_OTRO } from "./campo";
import { campoCompleto } from "./schema-coleccion";
import type { CampoSchema } from "./schema-coleccion";
import type { ValorFijo } from "./valores-fijos";

export const ORIGENES = ["acervo", "tesis"] as const;

export type Origen = (typeof ORIGENES)[number];

export interface ExportacionFijaPayload {
  etiqueta: string;
  valor: string;
}

export interface SchemaPayload {
  campo: string;
  es_multiple: boolean;
  requerido: boolean;
  frontend: { label: string };
  exportacion_dc: { etiqueta: string } | null;
}

/** Cuerpo del POST /api/xmlibris/newcollection. */
export interface NuevaColeccionPayload {
  nombre_coleccion: string;
  origen: string;
  exportacion_fija: ExportacionFijaPayload[];
  schema: SchemaPayload[];
}

/** Estado del formulario que se traduce al payload. */
export interface NuevaColeccionEntrada {
  titulo: string;
  origen: string;
  valoresFijos: readonly ValorFijo[];
  schema: readonly CampoSchema[];
}

export function construirPayload(
  entrada: NuevaColeccionEntrada,
): NuevaColeccionPayload {
  return {
    nombre_coleccion: entrada.titulo.trim(),
    origen: entrada.origen,
    // Las filas sin etiqueta elegida se descartan: la sección arranca con una vacía.
    exportacion_fija: entrada.valoresFijos
      .filter((fila) => fila.etiqueta.trim() !== "")
      .map((fila) => ({ etiqueta: fila.etiqueta, valor: fila.valor })),
    schema: entrada.schema.filter(campoCompleto).map((fila) => ({
      campo: fila.campo,
      es_multiple: fila.multiple,
      requerido: fila.requerido,
      frontend: {
        label: fila.label === LABEL_OTRO ? fila.labelOtro : fila.label,
      },
      exportacion_dc:
        fila.dublinCore && fila.dublinCore !== DUBLIN_CORE_NONE
          ? { etiqueta: fila.dublinCore }
          : null,
    })),
  };
}
