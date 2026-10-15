import { LABEL_OTRO } from "./campo";

export interface CampoSchema {
  id: number;
  campo: string;
  multiple: boolean;
  requerido: boolean;
  label: string;
  /** Solo aplica cuando `label === LABEL_OTRO`. */
  labelOtro: string;
  dublinCore: string;
}

export function campoSchemaVacio(id: number): CampoSchema {
  return {
    id,
    campo: "",
    multiple: false,
    requerido: false,
    label: "",
    labelOtro: "",
    dublinCore: "",
  };
}

export function campoCompleto(fila: CampoSchema): boolean {
  if (fila.campo.trim() === "") return false;
  if (fila.label === LABEL_OTRO) return fila.labelOtro.trim() !== "";
  return fila.label.trim() !== "";
}

export function hayCampoLleno(schema: readonly CampoSchema[]): boolean {
  return schema.some(campoCompleto);
}
