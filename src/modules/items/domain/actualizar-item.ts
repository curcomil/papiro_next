import type { SeccionItem } from "./contenido-item";
import type { ValoresMetadatos } from "@/modules/metadatos/domain/campo-metadato";

export interface ActualizarItemEntrada {
  coleccionInternalId: string;
  internalId: string;
  /** Solo los campos del schema: la API rechaza con 422 las claves sobrantes. */
  metadata: ValoresMetadatos;
}

export interface ActualizarItemResult {
  success: boolean;
  message: string;
}

export interface PaginaContenidoPayload {
  number: number;
  file_name: string;
}

export interface SeccionContenidoPayload {
  label: string;
  number: number;
  pages: PaginaContenidoPayload[];
}

export interface ActualizarContenidoEntrada {
  coleccionInternalId: string;
  internalId: string;
  sections: SeccionContenidoPayload[];
}

/**
 * `updatecontent` exige al menos una sección, al menos una página por sección y
 * números únicos y ≥ 1. Se descartan las secciones vacías y se renumera todo en
 * el orden visible, que es el que el usuario tiene en pantalla.
 */
export function seccionesParaGuardar(
  secciones: SeccionItem[],
): SeccionContenidoPayload[] {
  return secciones
    .filter((seccion) => seccion.pages.length > 0)
    .map((seccion, indice) => ({
      label: seccion.label,
      number: indice + 1,
      pages: seccion.pages.map((pagina, posicion) => ({
        number: posicion + 1,
        file_name: pagina.file_name,
      })),
    }));
}
