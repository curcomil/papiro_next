"use server";

// Server action porque el token vive en una cookie httpOnly que el cliente no
// puede leer, y porque la API está en otro origen (CORS).

import { cookies } from "next/headers";
import type { NuevaSubcoleccionPayload } from "../domain/nueva-subcoleccion";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:5000";

interface NuevaSubcoleccionResponse {
  success: boolean;
  message: string;
}

export async function crearSubcoleccion(
  payload: NuevaSubcoleccionPayload,
): Promise<NuevaSubcoleccionResponse> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) return { success: false, message: "No autenticado" };

    const response = await fetch(`${API_URL}/api/xmlibris/newsubcollection`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const res = await response.json().catch(() => null);

    if (!response.ok || !res?.success) {
      return {
        success: false,
        message: res?.message ?? "Error al crear la subcolección",
      };
    }

    return {
      success: true,
      message: res?.message ?? "Subcolección agregada exitosamente",
    };
  } catch {
    return { success: false, message: "No se pudo conectar con el servidor" };
  }
}
