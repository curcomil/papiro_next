/**
 * Paneles de trabajo de un item. Viven bajo `/dashboard` para heredar la
 * protección del middleware, igual que `/dashboard/new`. Los comparte el grid
 * de pendientes y, más adelante, el visor de items de cada colección.
 */
const RUTA_BASE = "/papiro/dashboard";

/** Sección «Pendientes» del dashboard, de donde salen estos paneles. */
export const RUTA_PENDIENTES = `${RUTA_BASE}?s=pendientes`;

export function rutaClasificar(internalId: string): string {
  return `${RUTA_BASE}/clasificar?item=${encodeURIComponent(internalId)}`;
}

export function rutaArchivos(internalId: string): string {
  return `${RUTA_BASE}/archivos?item=${encodeURIComponent(internalId)}`;
}
