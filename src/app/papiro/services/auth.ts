"use server";

import { cookies } from "next/headers";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:5000";

// En un servidor sin TLS (HTTP) el navegador descarta las cookies `Secure`.
// Por defecto va en `true`; se pone `COOKIE_SECURE=false` mientras no haya HTTPS.
const COOKIE_SECURE = process.env.COOKIE_SECURE !== "false";

const ROLE_REDIRECT: Record<string, string> = {
  admin: "/papiro/dashboard",
  digitizer: "/papiro/dashboard",
  coordinator: "/papiro/dashboard",
  chief: "/papiro/dashboard",
};

interface LoginData {
  username: string;
  password: string;
}

interface RegisterData {
  username: string;
  password: string;
  email: string;
}

interface LoginRes {
  success: boolean;
  message: string;
  token: string;
  user: {
    username: string;
    name: string;
    role: string;
  };
}

interface ActionResult {
  error?: string;
  redirect?: string;
  message?: string;
}

// ── Login ──────────────────────────────────────────────
export async function login(data: LoginData): Promise<ActionResult> {
  const response = await fetch(`${API_URL}/api/auth/xmlibris/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const res = await response.json().catch(() => ({}));

  if (!response.ok) {
    return { error: res.message ?? "Error al iniciar sesión" };
  }

  const { token, user } = res as LoginRes;

  const cookieStore = await cookies();

  // Token HttpOnly — solo el servidor lo puede leer
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: COOKIE_SECURE,
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  // User info — el cliente puede leerla para mostrar nombre y rol
  cookieStore.set("user", JSON.stringify(user), {
    httpOnly: false,
    secure: COOKIE_SECURE,
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  return { redirect: ROLE_REDIRECT[user.role] ?? "/papiro/dashboard" };
}

// ── Register ───────────────────────────────────────────
export async function register(data: RegisterData): Promise<ActionResult> {
  const response = await fetch(`${API_URL}/api/auth/xmlibris/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const res = await response.json().catch(() => ({}));

  if (!response.ok) {
    return { error: res.message ?? "Error al registrarse" };
  }

  return { message: res.message ?? "Usuario registrado correctamente" };
}

// ── Logout ─────────────────────────────────────────────
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("user");
}
