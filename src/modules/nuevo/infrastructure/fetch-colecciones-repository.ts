import type {
  ColeccionesRepository,
  ListarColeccionesOpciones,
} from "../domain/colecciones-repository";
import { getColecciones } from "./colecciones-api";

export function createColeccionesRepository(): ColeccionesRepository {
  return {
    async list(opciones: ListarColeccionesOpciones = {}) {
      const response = await getColecciones(opciones);
      return {
        success: response.success,
        message: response.message,
        colecciones: response.data.map((item) => ({
          internalId: item.coleccion.internal_id,
          nombre: item.coleccion.name_collection,
          setspec: item.coleccion.setspec_collection,
          origen: item.origen || "acervo",
          subcolecciones: (item.subcolecciones ?? []).map((sub) => ({
            internalId: sub.internal_id,
            nombre: sub.name_subcollection,
            setspec: sub.setspec_subcollection,
          })),
        })),
      };
    },
  };
}
