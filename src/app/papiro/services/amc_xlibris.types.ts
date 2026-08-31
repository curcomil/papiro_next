// services/amc_xlibris.types.ts — solo tipos (el módulo de acciones es "use server")

export type ItemStatus = "draft" | "pending_review" | "published" | "archived";

export interface HistoryEntry {
  name: string;
  user: string;
  date: string;
  from: string;
}

export interface Carpeta {
  _id: string;
  type: "carpeta";
  coleccion: string;
  subcoleccion: string;
  subcoleccion_normalizada: string;
  ubicacion_fisica: string;
  items: string[];
  keywords: string[];
  notas: string;
  referencia_control: string;
  url: string;
  status: ItemStatus;
  ultima_actualizacion: string | null;
  published_at: string | null;
  published_by: string | null;
  history: HistoryEntry[];
}

export interface DcMetadata {
  titulo: string;
  autor: string;
  descripcion: string;
  tecnica: string;
  medidas: string;
  numero: string;
}

export interface PapiroData {
  father_id: string;
  tipo_de_objeto: string;
  imagen: string;
  imagen_url: string;
  item_url: string;
  keywords: string[];
  notas: string;
  avaluo: string;
  referencia_control: string;
}

export interface Item {
  _id: string;
  internal_id: string;
  type: "item";
  coleccion: string;
  subcoleccion: string;
  status: ItemStatus;
  ultima_actualizacion: string | null;
  published_at: string | null;
  published_by: string | null;
  history: HistoryEntry[];
  dc_metadata: DcMetadata;
  papiro_data: PapiroData;
  /** Solo presente en respuestas de findbyfilter */
  carpeta_padre?: Carpeta | "Sin carpeta asignada" | null;
}
