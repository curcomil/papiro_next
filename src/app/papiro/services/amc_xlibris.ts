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

export class AmcService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000";
  }

  async getCarpetas(): Promise<Carpeta[]> {
    const response = await fetch(`${this.baseUrl}/api/xmlibris/amc/carpetas`);
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);
    const res = await response.json();
    return res.data;
  }

  async getItems(carpetaId: string): Promise<Item[]> {
    const response = await fetch(
      `${this.baseUrl}/api/xmlibris/amc/items/${carpetaId}`,
    );
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);
    const res = await response.json();
    return res.data;
  }

  async getCarpeta_by_id(carpetaId: string): Promise<Carpeta> {
    const response = await fetch(
      `${this.baseUrl}/api/xmlibris/amc/carpeta/${carpetaId}`,
    );
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);
    const res = await response.json();
    return res.data;
  }

  async updateCarpeta(
    carpetaId: string,
    data: Partial<Carpeta>,
  ): Promise<{ success: boolean; message: string; data: Carpeta }> {
    const response = await fetch(
      `${this.baseUrl}/api/xmlibris/amc/carpeta/${carpetaId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);
    return response.json();
  }

  async updateItem(itemId: string, data: Partial<Item>): Promise<{ success: boolean; message: string; data: Item }> {
    const response = await fetch(
      `${this.baseUrl}/api/xmlibris/amc/item/${itemId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);
    return response.json();
  }

  async findbyfilter(data: {
    type: "carpeta" | "item";
    filtro: string;
    query: string;
  }): Promise<{ success: boolean; data: Carpeta[] | Item[] }> {
    const response = await fetch(
      `${this.baseUrl}/api/xmlibris/amc/findbyfilter`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

export const amcService = new AmcService();
