"use server";

import type { Carpeta, Item, Subcoleccion, Pagination } from "./amc_xlibris.types";

// ─── helpers ───────────────────────────────────────────────────────────────

const API_URL = process.env.API_URL ?? "http://127.0.0.1:5000";

function apiBase(coleccion: string): string {
  return `${API_URL}/api/xmlibris/${coleccion}`;
}

function assertOk(res: Response): void {
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
}

/**
 * La API entrega `metadata.portada` como la RUTA del archivo, sin el nombre del
 * endpoint: `<coleccion>/<subcoleccion>/<internal_id>/<archivo>`.
 *
 * La URL que se manda al navegador es RELATIVA a propósito: se pide al propio
 * origen del frontend y Next la proxea a la API (ver `rewrites` en
 * next.config.ts). Con una URL absoluta a `127.0.0.1:5000` la imagen se rompe
 * en cuanto entras desde otra máquina por la IP de LAN — `127.0.0.1` sería el
 * loopback del cliente y Chrome lo bloquea con Private Network Access. Sin
 * portada (p. ej. periódicos) queda en `null`.
 */
function conPortadaResuelta(item: Item): Item {
  const portada = item.metadata?.portada;
  return {
    ...item,
    portada_url: portada ? `/api/xmlibris/getfile/${portada}` : null,
  };
}

// ─── funciones de API ───────────────────────────────────────────────────────

/** Subcolecciones de una colección (lo que antes llamábamos "carpetas"). */
export async function getSubcolecciones(
  coleccion: string,
): Promise<Subcoleccion[]> {
  const res = await fetch(`${apiBase(coleccion)}/subcolecciones`);
  assertOk(res);
  return (await res.json()).data;
}

/**
 * Items de una subcolección.
 * @param subcoleccion slug de la subcolección, ej. "abstracto_decorativo_recortes"
 *
 * La API topa a 100 resultados: devuelve también `pagination` para que el visor
 * no muestre un conteo falso.
 */
export async function getItems(
  coleccion: string,
  subcoleccion: string,
): Promise<{ items: Item[]; pagination: Pagination }> {
  const res = await fetch(`${apiBase(coleccion)}/items/${subcoleccion}`);
  assertOk(res);
  const body = await res.json();
  return {
    items: (body.data as Item[]).map(conPortadaResuelta),
    pagination: body.pagination as Pagination,
  };
}

// ─── escrituras y búsqueda ──────────────────────────────────────────────────

/** PUT /<coleccion>/subcoleccion/<internal_id> (reemplaza a /carpeta/<id>). */
export async function updateCarpeta(
  coleccion: string,
  internalId: string,
  /** $set de rutas con punto, ej. { "name_subcollection": "...", "app.notas": "..." } */
  data: Record<string, unknown>,
): Promise<{ success: boolean; message: string; data: Carpeta }> {
  const res = await fetch(`${apiBase(coleccion)}/subcoleccion/${internalId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  assertOk(res);
  return res.json();
}

/** PUT /<coleccion>/item/<internal_id> — solo rutas metadata.*, app.* e is_published. */
export async function updateItem(
  coleccion: string,
  internalId: string,
  /** $set de rutas con punto, ej. { "metadata.titulo": "...", "app.notas": "..." } */
  data: Record<string, unknown>,
): Promise<{ success: boolean; message: string; data: Item }> {
  const res = await fetch(`${apiBase(coleccion)}/item/${internalId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  assertOk(res);
  const body = await res.json();
  return { ...body, data: body?.data ? conPortadaResuelta(body.data) : body?.data };
}

/**
 * POST /<coleccion>/findbyfilter
 * El `filtro` debe ser un campo del schema de la colección (para items) o uno de
 * los válidos de subcolección; si no, la API responde 400.
 */
export async function findbyfilter(
  coleccion: string,
  data: { type: "carpeta" | "item"; filtro: string; query: string },
): Promise<{
  success: boolean;
  message: string;
  data: Carpeta[] | Item[];
  pagination: Pagination;
}> {
  const res = await fetch(`${apiBase(coleccion)}/findbyfilter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  assertOk(res);
  const body = await res.json();
  if (data.type === "item" && Array.isArray(body?.data)) {
    body.data = (body.data as Item[]).map(conPortadaResuelta);
  }
  return body;
}
