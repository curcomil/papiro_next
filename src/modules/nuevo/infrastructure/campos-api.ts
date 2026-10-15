"use server";

// Server action porque la API vive en otro origen y necesita la cookie httpOnly
// del token, que el cliente no puede leer.

import { cookies } from "next/headers";
import type { CampoApi } from "../domain/campo";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:5000";

interface GetCamposResponse {
  success: boolean;
  message: string;
  data: CampoApi[];
}

export async function getCampos(): Promise<GetCamposResponse> {
  try {
    const token = (await cookies()).get("token")?.value;

    const response = await fetch(`${API_URL}/api/xmlibris/getcampos`, {
      method: "GET",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      cache: "no-store",
    });

    const payload = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        success: false,
        message: payload?.message ?? "Error al obtener los campos",
        data: [],
      };
    }

    // El endpoint puede devolver el arreglo directo o envuelto en { data }.
    const data: CampoApi[] = Array.isArray(payload)
      ? payload
      : (payload?.data ?? []);

    return { success: true, message: payload?.message ?? "OK", data };
  } catch {
    return {
      success: false,
      message: "No se pudo conectar con el servidor",
      data: [],
    };
  }
}
