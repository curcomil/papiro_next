/** Un elemento del `content`: una página suelta o una sección con `pages`. */
export type EntradaContenido = Record<string, unknown>;

export type ContenidoItem = readonly EntradaContenido[];

/**
 * Un item es un libro cuando su `content` viene paginado en secciones: cada
 * elemento trae la clave `pages`. Los registros sueltos (una imagen o un PDF)
 * traen una lista plana donde cada elemento es ya la página.
 */
export function isABook(content: ContenidoItem): boolean {
  // El `in` solo es válido sobre objetos: los items antiguos pueden traer
  // elementos que no son dicts y la comprobación reventaría.
  return content.some(
    (elemento) =>
      typeof elemento === "object" && elemento !== null && "pages" in elemento,
  );
}

/** Nombre real del archivo de una página del `content`. */
export function nombreDeArchivo(entrada: EntradaContenido): string {
  const valor = entrada?.file_name;
  return typeof valor === "string" ? valor : "";
}

/** Extensión en minúsculas, sin el punto: `"foto.JPG"` → `"jpg"`. */
export function extensionDe(archivo: string): string {
  const indice = archivo.lastIndexOf(".");
  return indice === -1 ? "" : archivo.slice(indice + 1).toLowerCase();
}

export const EXTENSIONES_IMAGEN = ["jpg", "jpeg", "png"] as const;

export function esImagen(archivo: string): boolean {
  return (EXTENSIONES_IMAGEN as readonly string[]).includes(
    extensionDe(archivo),
  );
}

export function esPdf(archivo: string): boolean {
  return extensionDe(archivo) === "pdf";
}

export interface PaginaItem {
  number: number | null;
  file_name: string;
  /** Nombre destino que tendría al publicarse (solo en items `pending`). */
  archivos: string;
}

export interface SeccionItem {
  /** Identidad de la sección en la UI: `updatecontent` no la recibe. */
  id: string;
  label: string;
  number: number | null;
  pages: PaginaItem[];
}

let secuenciaSeccion = 0;

/** Id efímero y único para ordenar secciones en pantalla. */
export function nuevoIdSeccion(): string {
  secuenciaSeccion += 1;
  return `sec-${secuenciaSeccion}`;
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null;
}

function numeroDe(valor: unknown): number | null {
  return typeof valor === "number" && Number.isFinite(valor) ? valor : null;
}

function textoDe(valor: unknown): string {
  return typeof valor === "string" ? valor : "";
}

/**
 * Normaliza el `content` paginado a secciones tipadas. Descarta lo que no tenga
 * `pages`, así que sobre un content plano devuelve una lista vacía.
 */
export function seccionesDe(content: ContenidoItem): SeccionItem[] {
  const secciones: SeccionItem[] = [];

  for (const elemento of content) {
    if (!Array.isArray(elemento.pages)) continue;

    secciones.push({
      id: nuevoIdSeccion(),
      label: textoDe(elemento.label) || "Sin título",
      number: numeroDe(elemento.number),
      pages: elemento.pages.filter(esObjeto).map((pagina) => ({
        number: numeroDe(pagina.number),
        file_name: textoDe(pagina.file_name),
        archivos: textoDe(pagina.archivos),
      })),
    });
  }

  return secciones;
}
