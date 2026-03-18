// services/users.ts — "use server"
"use server";

import { cookies } from "next/headers";
import type { UsersResponse, UpdateUserResponse, User } from "./users.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000";

async function getToken(): Promise<string> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) throw new Error("No autenticado");
  return token;
}

export async function getUsers(): Promise<UsersResponse> {
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/api/users/getusers`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    const res = await response.json().catch(() => null);
    if (!response.ok)
      return { success: false, message: res?.message ?? "Error", data: [] };
    return res as UsersResponse;
  } catch {
    return {
      success: false,
      message: "No se pudo conectar con el servidor",
      data: [],
    };
  }
}

export async function updateUser(
  userId: string,
  data: Partial<
    Pick<User, "name" | "role" | "assignedCollections" | "isActive">
  >,
): Promise<UpdateUserResponse> {
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/api/users/${userId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const res = await response.json().catch(() => null);
    if (!response.ok)
      return { success: false, message: res?.message ?? "Error al actualizar" };
    return { success: true, message: res.message };
  } catch {
    return { success: false, message: "No se pudo conectar con el servidor" };
  }
}
