"use server";

import { cookies } from "next/headers";
import type {
  UsersResponse,
  UpdateUserResponse,
  User,
  Coordinators,
  CoordinatorsResponse,
} from "./users.types";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:5000";

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

export async function createUser(
  data: Pick<User, "name" | "email" | "role" | "assignedCollections">,
): Promise<UpdateUserResponse> {
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/api/users/create`, {
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
        message: res?.message ?? "Error al crear usuario",
      };
    return { success: true, message: res.message };
  } catch {
    return { success: false, message: "No se pudo conectar con el servidor" };
  }
}

export async function deleteUser(user_id: string): Promise<any> {
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/api/users/${user_id}`, {
      method: "Delete",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const res = await response.json().catch(() => null);
    if (!response.ok)
      return { success: false, message: res?.message ?? "Error al eliminar" };
    return { success: true, message: res.message };
  } catch {
    return {
      success: false,
      message: "No se pudo conectar con el servidor",
    };
  }
}

export async function reset_credentials(user_id: string): Promise<any> {
  try {
    const token = await getToken();
    const response = await fetch(
      `${API_URL}/api/users/reset_credentials/${user_id}`,
      {
        method: "Delete",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      },
    );
    const res = await response.json().catch(() => null);
    if (!response.ok)
      return {
        success: false,
        message: res?.message ?? "Error al eliminar credenciales",
      };
    return { success: true, message: res.message };
  } catch {
    return {
      success: false,
      message: "No se pudo conectar con el servidor",
    };
  }
}

export async function getcoordinators(): Promise<CoordinatorsResponse> {
  try {
    const token = await getToken();
    const response = await fetch(`${API_URL}/api/users/getcoordinators`, {
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
