"use server";

import { cookies, headers } from "next/headers";

const API_URL = process.env.API_URL ?? "http://127.0.0.1:5000";

// En un servidor sin TLS (HTTP) el navegador descarta las cookies `Secure`, el
// middleware no ve el token y el login rebota a /papiro/login?error=unauthorized.
// Por eso no basta con asumir `true`: se deduce del protocolo real de la petición.
// `COOKIE_SECURE=true|false` fuerza el valor manualmente si hiciera falta.
async function resolveCookieSecure(): Promise<boolean> {
  const override = process.env.COOKIE_SECURE;
  if (override === "false") return false;
  if (override === "true") return true;

  // Detrás de un proxy con TLS terminado (nginx, Caddy, túnel) el protocolo
  // original de la petición llega en x-forwarded-proto.
  const proto = (await headers())
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();

  // Sin cabecera de proxy la conexión es HTTP directa contra Next.
  return proto === "https";
}

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
  const secure = await resolveCookieSecure();

  // Token HttpOnly — solo el servidor lo puede leer
  cookieStore.set("token", token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  // User info — el cliente puede leerla para mostrar nombre y rol
  cookieStore.set("user", JSON.stringify(user), {
    httpOnly: false,
    secure,
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
