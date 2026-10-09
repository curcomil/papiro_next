// services/amc_xlibris.types.ts — solo tipos (el módulo de acciones es "use server")
//
// Modelo nuevo de la base 'xmlibris':
//   - Las subcolecciones (antes "carpetas") viven EMBEBIDAS en el registro
//     'colecciones', no como documentos propios.
//   - Los items de TODAS las colecciones viven en la colección 'items'.

// ─────────────────────────────────────────────────────────────────────────────
// Subcolección (= la antigua "carpeta")
// ─────────────────────────────────────────────────────────────────────────────

export interface SubcoleccionApp {
  notas: string;
  miniatura: string;
  referencia_externa: string;
}

export interface Subcoleccion {
  name_subcollection: string;
  setspec_subcollection: string;
  internal_id: string;
  app: SubcoleccionApp;
  status: string;
}

/** Alias histórico: el visor sigue llamando "Carpeta" a la subcolección. */
export type Carpeta = Subcoleccion;

/**
 * Bloque que acompaña a las respuestas con colecciones. La API topa a 100
 * resultados por consulta, así que `has_more` es la única forma de saber que
 * quedaron resultados fuera.
 */
export interface Pagination {
  limit: number;
  returned: number;
  has_more: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Item
// ─────────────────────────────────────────────────────────────────────────────

export interface ColeccionRef {
  name_collection: string;
  setspec_collection: string;
  internal_id: string;
}

export interface SubcoleccionRef {
  name_subcollection: string;
  setspec_subcollection: string;
  internal_id: string;
}

export interface ItemParents {
  coleccion: ColeccionRef;
  subcoleccion: SubcoleccionRef;
}

/**
 * Los campos de metadata VARÍAN por colección: AMC usa 'descripcion' y
 * 'clasificacion_local', Franciscana y AHPSEM usan 'descripcion_fisica',
 * Periódicos no tiene 'portada' ni 'tipo_de_objeto'. Qué campos existen para
 * cada colección lo declara `schema[]` en el registro de colecciones.
 */
export interface ItemMetadata {
  titulo?: string;
  autor?: string | null;
  descripcion?: string | null;
  descripcion_fisica?: string | null;
  tecnica?: string | null;
  medidas?: string | null;
  /** Folio / número de inventario (el antiguo `numero`). */
  clasificacion_local?: string | null;
  tipo_de_objeto?: string | null;
  /**
   * La API lo entrega como la RUTA del archivo, sin el nombre del endpoint:
   * `<coleccion>/<subcoleccion>/<internal_id>/<archivo>`.
   * El servicio la resuelve en `portada_url` anteponiendo `/api/xmlibris/getfile/`.
   */
  portada?: string | null;
  [campo: string]: unknown;
}

export interface ItemApp {
  notas: string | null;
  [campo: string]: unknown;
}

/** Archivo suelto: forma plana del content (Covarrubias, Telegramas, Periódicos). */
export interface ItemArchivo {
  file_name: string;
  original_file_name: string | null;
}

/** Página dentro de una sección: forma paginada del content (libros). */
export interface ItemPagina extends ItemArchivo {
  number: string;
}

export interface ItemSeccion {
  label: string;
  number: string;
  pages: ItemPagina[];
}

/** El content tiene dos formas; discrime con `'pages' in elemento`. */
export type ItemContent = ItemArchivo | ItemSeccion;

export interface Item {
  _id: string;
  internal_id: string;
  is_published: boolean;
  parents: ItemParents;
  metadata: ItemMetadata;
  app: ItemApp;
  content: ItemContent[];
  /**
   * Derivado por el servicio (NO lo devuelve la API): URL absoluta de
   * `metadata.portada` para usarla directo en `<img src>`. Es `null` cuando el
   * item no tiene portada (p. ej. los periódicos).
   */
  portada_url?: string | null;
  /**
   * Solo presente en respuestas de findbyfilter: la subcolección PADRE completa
   * (la del registro, con `app` y `status`) o el string "Sin carpeta asignada".
   */
  carpeta_padre?: Subcoleccion | "Sin carpeta asignada" | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers de forma (evitan ramificar a mano en los componentes)
// ─────────────────────────────────────────────────────────────────────────────

/** Todas las páginas/archivos de un item, en cualquiera de las dos formas. */
export function archivosDe(content: ItemContent[] | undefined): ItemArchivo[] {
  const archivos: ItemArchivo[] = [];
  for (const elemento of content ?? []) {
    if ("pages" in elemento) {
      archivos.push(...elemento.pages);
    } else {
      archivos.push(elemento);
    }
  }
  return archivos;
}

/** Cuántos archivos tiene el item (`pages` si hay secciones, o el arreglo plano). */
export function totalArchivos(content: ItemContent[] | undefined): number {
  return archivosDe(content).length;
}
