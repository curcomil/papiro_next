"use server";

// Server action porque el token vive en una cookie httpOnly que el cliente no
// puede leer, y porque la API está en otro origen (CORS).

import { cookies } from "next/headers";
import type { NuevaColeccionPayload } from "../domain/nueva-coleccion";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:5000";

interface CrearColeccionResponse {
  success: boolean;
  message: string;
}

export async function crearColeccion(
  payload: NuevaColeccionPayload,
): Promise<CrearColeccionResponse> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return { success: false, message: "No autenticado" };

    const response = await fetch(`${API_URL}/api/xmlibris/newcollection`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const res = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: res?.message ?? "Error al crear la colección",
      };
    }

    return { success: true, message: res?.message ?? "Colección creada" };
  } catch {
    return { success: false, message: "No se pudo conectar con el servidor" };
  }
}
