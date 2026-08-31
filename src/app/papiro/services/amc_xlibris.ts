"use server";

import type { Carpeta, Item } from "./amc_xlibris.types";

// ─── helpers ───────────────────────────────────────────────────────────────

function apiBase(coleccion: string): string {
  const origin = process.env.API_URL ?? "http://127.0.0.1:5000";
  return `${origin}/api/xmlibris/${coleccion}`;
}

function assertOk(res: Response): void {
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
}

// ─── funciones de API ───────────────────────────────────────────────────────

export async function getCarpetas(coleccion: string): Promise<Carpeta[]> {
  const res = await fetch(`${apiBase(coleccion)}/carpetas`);
  assertOk(res);
  return (await res.json()).data;
}

/** @param subcoleccionNormalizada slug de la carpeta, ej. "abstracto_decorativo_recortes" */
export async function getItems(
  coleccion: string,
  subcoleccionNormalizada: string,
): Promise<Item[]> {
  const res = await fetch(
    `${apiBase(coleccion)}/items/${subcoleccionNormalizada}`,
  );
  assertOk(res);
  return (await res.json()).data;
}

export async function getCarpeta_by_id(
  coleccion: string,
  carpetaId: string,
): Promise<Carpeta> {
  const res = await fetch(`${apiBase(coleccion)}/carpeta/${carpetaId}`);
  assertOk(res);
  return (await res.json()).data;
}

export async function updateCarpeta(
  coleccion: string,
  carpetaId: string,
  data: Partial<Carpeta>,
): Promise<{ success: boolean; message: string; data: Carpeta }> {
  const res = await fetch(`${apiBase(coleccion)}/carpeta/${carpetaId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  assertOk(res);
  return res.json();
}

export async function updateItem(
  coleccion: string,
  itemId: string,
  data: Partial<Item>,
): Promise<{ success: boolean; message: string; data: Item }> {
  const res = await fetch(`${apiBase(coleccion)}/item/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  assertOk(res);
  return res.json();
}

export async function findbyfilter(
  coleccion: string,
  data: { type: "carpeta" | "item"; filtro: string; query: string },
): Promise<{ success: boolean; data: Carpeta[] | Item[] }> {
  const res = await fetch(`${apiBase(coleccion)}/findbyfilter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  assertOk(res);
  return res.json();
}
