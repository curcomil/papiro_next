export interface CampoMetadato {
  /** Clave con la que viaja este campo en el dict del submit. */
  campo: string;
  esMultiple: boolean;
  requerido: boolean;
  /** Texto visible del input (`frontend.label`). */
  label: string;
  /** `frontend.tipo_input`: "text" | "textarea". */
  tipoInput: string;
}

export type ValorMetadato = string | string[];

/** Valores capturados, indexados por `campo`. */
export type ValoresMetadatos = Record<string, ValorMetadato>;

export function valorInicial(campo: CampoMetadato): ValorMetadato {
  return campo.esMultiple ? [""] : "";
}

/** Devuelve el valor ya capturado o el inicial, sin necesidad de inicializar
 *  el estado cuando llega el schema. */
export function valorDe(
  valores: ValoresMetadatos,
  campo: CampoMetadato,
): ValorMetadato {
  return valores[campo.campo] ?? valorInicial(campo);
}

export function listaDe(valor: ValorMetadato): string[] {
  return Array.isArray(valor) ? valor : [valor];
}

/** El campo "portada" solo se captura cuando el registro es un Libro. */
export const CAMPO_PORTADA = "portada";

export function camposInhabilitados(esLibro: boolean): readonly string[] {
  return esLibro ? [] : [CAMPO_PORTADA];
}

export interface GruposDeClasificacion {
  textos: CampoMetadato[];
  textareas: CampoMetadato[];
  multiples: CampoMetadato[];
}

/**
 * Separa los campos por forma del control para pintar cada grupo en su propio
 * contenedor: texto → textarea → múltiples. Dentro de cada grupo se conserva
 * el orden del schema.
 */
export function agruparParaClasificar(
  campos: readonly CampoMetadato[],
): GruposDeClasificacion {
  const grupos: GruposDeClasificacion = {
    textos: [],
    textareas: [],
    multiples: [],
  };

  for (const campo of campos) {
    if (campo.esMultiple) grupos.multiples.push(campo);
    else if (campo.tipoInput === "textarea") grupos.textareas.push(campo);
    else grupos.textos.push(campo);
  }

  return grupos;
}
