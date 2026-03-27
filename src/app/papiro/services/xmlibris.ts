"use server";

import type { Generic_response } from "./xmlibris.types";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000";

async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No autenticado");
  return token;
}

export async function new_collection(data: any): Promise<Generic_response> {
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/api/xmlibris/newcollection`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json().catch(() => null);
    if (!response.ok)
      return {
        success: false,
        message: res?.message ?? "Error al crear colección",
      };
    return { success: true, message: res.message };
  } catch {
    return { success: false, message: "No se pudo conectar con el servidor" };
  }
}
