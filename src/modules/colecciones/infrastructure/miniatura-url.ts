const RUTA_ARCHIVO = "/api/xmlibris/getfile";

/**
 * `app.miniatura` debe traer la ruta que espera `getfile`, con sus cuatro
 * segmentos: `coleccion/subcoleccion/internal_id/archivo`. Cualquier otra cosa
 * —vacía, un nombre suelto, una URL— se descarta y la card cae al SVG genérico
 * en vez de pedir una ruta inválida.
 */
export function rutaMiniatura(miniatura: string): string {
  const segmentos = miniatura.trim().split("/").filter(Boolean);

  if (segmentos.length !== 4) return "";

  return `${RUTA_ARCHIVO}/${segmentos.map(encodeURIComponent).join("/")}`;
}
