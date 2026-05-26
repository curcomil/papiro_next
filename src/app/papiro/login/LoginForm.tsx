"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Swal from "sweetalert2";
import { login, register } from "../services/auth";

const errorMessages: Record<string, string> = {
  unauthorized: "Tu sesión ha expirado. Inicia sesión nuevamente.",
  invalid_session: "Sesión no válida. Vuelve a iniciar sesión.",
};

interface Props {
  error?: string;
}

export default function LoginForm({ error }: Props) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      username: String(formData.get("username")),
      password: String(formData.get("password")),
    };

    try {
      const result = await login(data);

      if (result.error) {
        Swal.fire({
          icon: "error",
          title: "Error al iniciar sesión",
          text: result.error,
          confirmButtonColor: "oklch(42% 0.09 330)",
        });
        return;
      }

      if (result.redirect) {
        await Swal.fire({
          icon: "success",
          title: "¡Bienvenido!",
          text: "Iniciando sesión...",
          timer: 1200,
          showConfirmButton: false,
          timerProgressBar: true,
        });
        router.push(result.redirect);
      }
    } catch {
      Swal.fire({
        icon: "error",
        title: "Sin conexión",
        text: "No se pudo conectar con el servidor. Intenta más tarde.",
        confirmButtonColor: "oklch(42% 0.09 330)",
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      username: String(formData.get("username")),
      password: String(formData.get("password")),
      email: String(formData.get("email")),
    };

    try {
      const result = await register(data);

      if (result.error) {
        Swal.fire({
          icon: "error",
          title: "Error al registrarse",
          text: result.error,
          confirmButtonColor: "oklch(42% 0.09 330)",
        });
        return;
      }

      await Swal.fire({
        icon: "success",
        title: "Registro exitoso",
        text: "Por favor inicia sesión con los datos de tu cuenta",
        confirmButtonColor: "oklch(42% 0.09 330)",
      });
      setTab("login");
    } catch {
      Swal.fire({
        icon: "error",
        title: "Sin conexión",
        text: "No se pudo conectar con el servidor. Intenta más tarde.",
        confirmButtonColor: "oklch(42% 0.09 330)",
      });
    } finally {
      setIsPending(false);
    }
  };

  const EyeIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );

  const EyeOffIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );

  const PasswordToggle = () => (
    <button
      type="button"
      className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content/70 transition-colors"
      onClick={() => setShowPassword(!showPassword)}
      tabIndex={-1}
    >
      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
    </button>
  );

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-base-100">
      {/* ── Left panel – branding ── */}
      <div className="hidden lg:flex flex-col justify-between bg-neutral text-neutral-content px-16 py-14">
        <div className="flex items-center gap-3">
          <span className="login text-2xl tracking-wide">Papiro</span>
        </div>
        <div>
          <p className="login text-4xl leading-snug text-neutral-content/90 mb-6">
            Donde se protege la memoria, <br /> también nace la resistencia.
          </p>
          <p className="home text-sm text-neutral-content/50 font-light">
            Sistema de gestión de colecciones digitales
          </p>
        </div>
        <p className="home text-xs text-neutral-content/30 font-light">
          © {new Date().getFullYear()} Papiro — Uso interno
        </p>
      </div>

      {/* ── Right panel – form ── */}
      <div className="flex flex-col justify-center items-center px-8 py-14 bg-base-200">
        {/* Mobile logo */}
        <div className="flex lg:hidden items-center gap-2 mb-10">
          <Image
            src="/xmlibris/carpeta.png"
            alt="Papiro"
            width={28}
            height={28}
          />
          <span className="login text-xl tracking-wide text-base-content">
            Papiro
          </span>
        </div>

        <div className="w-full max-w-sm">
          {/* Error alert desde middleware */}
          {error && (
            <div role="alert" className="alert alert-warning mb-6 py-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="home text-sm font-light">
                {errorMessages[error] ?? "Debes iniciar sesión para continuar."}
              </span>
            </div>
          )}

          {/* Heading */}
          <div className="mb-8">
            <h1 className="login text-3xl text-base-content mb-1">
              {tab === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </h1>
            <p className="home text-sm text-base-content/50 font-light">
              {tab === "login"
                ? "Accede a tu colección asignada"
                : "Solicita acceso al sistema"}
            </p>
          </div>

          {/* Tabs */}
          <div role="tablist" className="tabs tabs-border mb-8">
            <button
              role="tab"
              className={`tab home text-sm font-normal ${tab === "login" ? "tab-active" : "text-base-content/50"}`}
              onClick={() => setTab("login")}
            >
              Iniciar sesión
            </button>
            <button
              role="tab"
              className={`tab home text-sm font-normal ${tab === "register" ? "tab-active" : "text-base-content/50"}`}
              onClick={() => setTab("register")}
            >
              Registrarse
            </button>
          </div>

          {/* ── Login form ── */}
          {tab === "login" && (
            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
              <fieldset className="fieldset">
                <legend className="fieldset-legend home text-xs font-normal text-base-content/60 uppercase tracking-widest">
                  Username
                </legend>
                <input
                  name="username"
                  type="text"
                  className="input w-full home font-light text-sm"
                  placeholder="user__"
                  autoComplete="username"
                  required
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend home text-xs font-normal text-base-content/60 uppercase tracking-widest">
                  Contraseña
                </legend>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="input w-full home font-light text-sm pr-10"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <PasswordToggle />
                </div>
              </fieldset>

              <button
                type="submit"
                className="btn btn-primary home font-normal mt-1"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  "Entrar"
                )}
              </button>

              <p className="home text-xs text-center text-base-content/40 font-light">
                ¿Olvidaste tu contraseña? Contacta al administrador.
              </p>
            </form>
          )}

          {/* ── Register form ── */}
          {tab === "register" && (
            <form className="flex flex-col gap-5" onSubmit={handleRegister}>
              <fieldset className="fieldset">
                <legend className="fieldset-legend home text-xs font-normal text-base-content/60 uppercase tracking-widest">
                  Correo electrónico
                </legend>
                <input
                  name="email"
                  type="email"
                  className="input w-full home font-light text-sm"
                  placeholder="usuario@udlap.mx"
                  autoComplete="email"
                  required
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend home text-xs font-normal text-base-content/60 uppercase tracking-widest">
                  Username
                </legend>
                <input
                  name="username"
                  type="text"
                  className="input w-full home font-light text-sm"
                  placeholder="user__"
                  autoComplete="username"
                  required
                />
              </fieldset>

              <fieldset className="fieldset">
                <legend className="fieldset-legend home text-xs font-normal text-base-content/60 uppercase tracking-widest">
                  Contraseña
                </legend>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    className="input w-full home font-light text-sm pr-10"
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                  />
                  <PasswordToggle />
                </div>
              </fieldset>

              <p className="home text-xs text-center text-base-content/40 font-light">
                Si tu correo no pertenece a un usuario autorizado se denegará el
                acceso, contacta al administrador.
              </p>

              <button
                type="submit"
                className="btn btn-primary home font-normal"
                disabled={isPending}
              >
                {isPending ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  "Registrarme"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
