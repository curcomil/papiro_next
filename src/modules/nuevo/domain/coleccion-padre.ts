export interface Subcoleccion {
  internalId: string;
  nombre: string;
  setspec: string;
}

export interface ColeccionPadre {
  internalId: string;
  nombre: string;
  setspec: string;
  /** "acervo" | "tesis": lo exige el alta de items y decide la colección de Mongo. */
  origen: string;
  /** Vacío cuando se consultó con `conSubcolecciones: false`. */
  subcolecciones: Subcoleccion[];
}

export interface ColeccionesListResult {
  success: boolean;
  message: string;
  colecciones: ColeccionPadre[];
}

// Collator español: sin él "Ávila" caería después de "Zúñiga" por código de carácter.
const collator = new Intl.Collator("es", { sensitivity: "base" });

export function ordenarPorNombre<T extends { nombre: string }>(
  items: readonly T[],
): T[] {
  return [...items].sort((a, b) => collator.compare(a.nombre, b.nombre));
}
