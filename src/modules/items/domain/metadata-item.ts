import {
  CAMPO_PORTADA,
  type CampoMetadato,
  type ValoresMetadatos,
} from "@/modules/metadatos/domain/campo-metadato";

const SIN_VALOR = "";

/**
 * Convierte la metadata cruda de un item (claves dinámicas, valores de texto,
 * listas o `null`) en los valores que espera el formulario de metadatos.
 */
export function valoresDesdeMetadata(
  metadata: Record<string, unknown>,
): ValoresMetadatos {
  const valores: ValoresMetadatos = {};

  for (const [campo, valor] of Object.entries(metadata)) {
    valores[campo] = valorDeMetadata(campo, valor);
  }

  return valores;
}

function valorDeMetadata(campo: string, valor: unknown): string | string[] {
  if (Array.isArray(valor)) return valor.map(textoDe);

  const texto = textoDe(valor);

  // La API reescribe `portada` como <coleccion>/<subcoleccion>/<id>/<archivo>
  // al leer; en el formulario se edita el nombre del archivo, no la ruta.
  return campo === CAMPO_PORTADA ? basename(texto) : texto;
}

function textoDe(valor: unknown): string {
  if (typeof valor === "string") return valor;
  if (typeof valor === "number") return String(valor);
  return SIN_VALOR;
}

function basename(valor: string): string {
  const segmentos = valor.split("/");
  return segmentos[segmentos.length - 1] ?? valor;
}

/**
 * Nombre del archivo de portada, sin la ruta. La API reescribe `portada` como
 * <coleccion>/<subcoleccion>/<id>/<archivo> al leer, así que se compara contra
 * el `file_name` de cada página, nunca contra la ruta completa.
 */
export function nombrePortada(metadata: Record<string, unknown>): string {
  const valor = metadata.portada;
  return typeof valor === "string" ? basename(valor) : SIN_VALOR;
}

/**
 * Deja solo los campos que declara el schema de la colección. La API valida la
 * metadata con `extra="forbid"` y devuelve 422 ante una clave desconocida, y
 * los items antiguos suelen traer campos que ya no están en el schema.
 */
export function metadataParaGuardar(
  schema: readonly CampoMetadato[],
  valores: ValoresMetadatos,
): ValoresMetadatos {
  const metadata: ValoresMetadatos = {};

  for (const campo of schema) {
    const valor = valores[campo.campo];

    if (valor === undefined) {
      metadata[campo.campo] = campo.esMultiple ? [] : SIN_VALOR;
      continue;
    }

    if (campo.esMultiple) {
      metadata[campo.campo] = Array.isArray(valor) ? valor : [valor];
    } else {
      metadata[campo.campo] = Array.isArray(valor)
        ? (valor[0] ?? SIN_VALOR)
        : valor;
    }
  }

  return metadata;
}
