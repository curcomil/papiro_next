import type { TipoFormulario } from "../domain/tipo-formulario";

export const RUTA_PANEL = "/papiro/dashboard?s=nuevo";

export const RUTA_NUEVO = "/papiro/dashboard/new";

export function rutaNuevo(tipo: TipoFormulario): string {
  return `${RUTA_NUEVO}?tipo=${tipo}`;
}
