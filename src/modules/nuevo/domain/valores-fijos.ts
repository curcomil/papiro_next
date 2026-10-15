/** Etiquetas básicas de Dublin Core, hardcodeadas. */
export const ETIQUETAS_DUBLIN_CORE: readonly string[] = [
  "dc:title",
  "dc:creator",
  "dc:subject",
  "dc:description",
  "dc:publisher",
  "dc:contributor",
  "dc:date",
  "dc:type",
  "dc:format",
  "dc:identifier",
  "dc:source",
  "dc:language",
  "dc:relation",
  "dc:coverage",
  "dc:rights",
];

export interface ValorFijo {
  id: number;
  etiqueta: string;
  valor: string;
}

export function valorFijoVacio(id: number): ValorFijo {
  return { id, etiqueta: "", valor: "" };
}
