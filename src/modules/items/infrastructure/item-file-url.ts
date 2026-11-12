import type { Item } from "../domain/item";

/**
 * URL de un archivo del item, servida por el mismo origen. En producción nginx
 * enruta `/api/xmlibris/*` a Flask; el endpoint resuelve el binario tanto en la
 * carpeta publicada como en `pendiente/`.
 */
const RUTA_ARCHIVO = "/api/xmlibris/getfile";

/** Arma la URL desde una ruta relativa ya compuesta: `coleccion/sub/item/archivo`. */
export function rutaArchivoDesdeRuta(ruta: string): string {
  if (!ruta) return "";
  return `${RUTA_ARCHIVO}/${ruta.split("/").map(encodeURIComponent).join("/")}`;
}

export function rutaArchivo(item: Item, archivo: string): string {
  return rutaArchivoDesdeRuta(
    [
      item.coleccion.setspec,
      item.subcoleccion.setspec,
      item.internalId,
      archivo,
    ].join("/"),
  );
}
