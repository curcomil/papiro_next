export type TipoFormulario = "coleccion" | "subcoleccion" | "registro";

export interface TipoFormularioInfo {
  tipo: TipoFormulario;
  /** Título de la tarjeta en el panel. */
  titulo: string;
  /** Descripción de la tarjeta. */
  descripcion: string;
  /** Título dentro del formulario. */
  tituloFormulario: string;
}

export const TIPOS_FORMULARIO: readonly TipoFormularioInfo[] = [
  {
    tipo: "coleccion",
    titulo: "Crear Coleccion",
    descripcion: "Nueva coleccion padre",
    tituloFormulario: "Nueva colección",
  },
  {
    tipo: "subcoleccion",
    titulo: "Crear Subcoleccion",
    descripcion: "Subcolección dentro de una colección padre",
    tituloFormulario: "Nueva subcolección",
  },
  {
    tipo: "registro",
    titulo: "Crear registro",
    descripcion: "Nuevo registro perteneciente a una subcolección",
    tituloFormulario: "Nuevo registro",
  },
];

/** Valida el `?tipo=` de la URL antes de usarlo. */
export function isTipoFormulario(
  value: string | null | undefined,
): value is TipoFormulario {
  return TIPOS_FORMULARIO.some((info) => info.tipo === value);
}

export function infoDeTipo(tipo: TipoFormulario): TipoFormularioInfo {
  return (
    TIPOS_FORMULARIO.find((info) => info.tipo === tipo) ?? TIPOS_FORMULARIO[0]
  );
}
