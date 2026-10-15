export interface CampoApi {
  campo: string;
  etiqueta: string;
  label: string[];
}

export const DUBLIN_CORE_NONE = "None";

export const LABEL_OTRO = "otro";

export function buscarCampo(
  campos: readonly CampoApi[],
  campo: string,
): CampoApi | undefined {
  return campos.find((item) => item.campo === campo);
}

export function etiquetaDeCampo(
  campos: readonly CampoApi[],
  campo: string,
): string {
  return buscarCampo(campos, campo)?.etiqueta ?? "";
}

export function labelsDeCampo(
  campos: readonly CampoApi[],
  campo: string,
): string[] {
  return buscarCampo(campos, campo)?.label ?? [];
}
