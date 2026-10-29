/** Cuerpo del POST /api/xmlibris/newsubcollection. La API usa extra="forbid":
 *  solo estas dos claves. */
export interface NuevaSubcoleccionPayload {
  nombre_subcoleccion: string;
  coleccion_internal_id: string;
}

export interface NuevaSubcoleccionEntrada {
  nombre: string;
  coleccionInternalId: string;
}

export function construirPayloadSubcoleccion(
  entrada: NuevaSubcoleccionEntrada,
): NuevaSubcoleccionPayload {
  return {
    nombre_subcoleccion: entrada.nombre.trim(),
    coleccion_internal_id: entrada.coleccionInternalId,
  };
}
