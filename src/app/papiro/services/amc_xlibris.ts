export interface Carpeta {
  _id: string;
  nombre_expediente: string;
  nombre_expediente_normalizado: string;
  ubicacion_fisica: string;
  items: string[];
  notas: string;
  referencia_control: string;
  url: string;
  type: string;
  keywords: string[];
}

export interface Item {
  carpeta_padre?: Carpeta | null;
  _id: string;
  numero_inventario: number;
  tipologia: string;
  titulo: string;
  autor: string;
  fecha: string;
  dimensiones: string;
  descripcion: string;
  notas: string;
  referencia_control: string;
  url: string;
  imagen_url: string;
  type: string;
  avaluo: string;
  keywords: string[];
  father_id: string;
  coleccion: string;
  subcoleccion: string;
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
    return response.json();
  }

  async getItems(carpetaId: string): Promise<Item[]> {
    const response = await fetch(
      `${this.baseUrl}/api/xmlibris/amc/items/${carpetaId}`,
    );
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);
    return response.json();
  }

  async getCarpeta_by_id(carpetaId: string): Promise<Carpeta> {
    const response = await fetch(
      `${this.baseUrl}/api/xmlibris/amc/carpeta/${carpetaId}`,
    );
    if (!response.ok)
      throw new Error(`${response.status} ${response.statusText}`);
    return response.json();
  }

  async updateCarpeta(
    carpetaId: string,
    data: Partial<Carpeta>,
  ): Promise<Carpeta> {
    const response = await fetch(
      `${this.baseUrl}/api/xmlibris/amc/carpeta/${carpetaId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async updateItem(itemId: string, data: Partial<Item>): Promise<Carpeta> {
    const response = await fetch(
      `${this.baseUrl}/api/xmlibris/amc/item/${itemId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async findbyfilter(data: any): Promise<any> {
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
