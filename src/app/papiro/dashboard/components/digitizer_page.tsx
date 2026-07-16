"use client";

import { ThemeToggle } from "../../components/ThemeToggle";
import Colecciones_dashboard from "./colecciones_dashboard";
import { logout } from "../../services/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import New_collection_form from "./new_collection_form";
import type { Coordinators } from "../../services/users.types";
import type { FetchMap } from "../page";

export interface CurrentUser {
  username: string;
  name: string;
  role: string;
  _id: string;
}

// ── Iconos ─────────────────────────────────────────────
const Icons = {
  crear: (
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
        d="M4.5 4.5h15v15h-15v-15zM12 8.25v7.5m3.75-3.75h-7.5"
      />
    </svg>
  ),
  general: (
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
        d="M3.75 3.75h6.75v6.75H3.75V3.75zm9.75 0h6.75v4.5h-6.75v-4.5zM3.75 13.5h4.5v6.75h-4.5V13.5zm6.75 3h9.75v3.75H10.5V16.5z"
      />
    </svg>
  ),
  folder: (
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
        d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
      />
    </svg>
  ),
  collection: (
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
        d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
      />
    </svg>
  ),
  clock: (
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
        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  logout: (
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
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
      />
    </svg>
  ),
  edit: (
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
        d="M4.5 19.5h15M14.25 6.75l3 3m1.5-1.5a2.121 2.121 0 10-3-3l-9 9v3h3l9-9z"
      />
    </svg>
  ),
  check: (
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
        d="M15.75 15.75L19.5 19.5M10.5 16.5a6 6 0 100-12 6 6 0 000 12z"
      />
    </svg>
  ),
};

const navItems = [
  { id: "overview", label: "General", icon: Icons.general },
  { id: "new_collection", label: "Nueva Colección", icon: Icons.crear },
  { id: "new_folder", label: "Nueva Carpeta", icon: Icons.crear },
  { id: "new_item", label: "Nuevo Item", icon: Icons.crear },
  { id: "check", label: "Revisiones", icon: Icons.check },
  { id: "colecciones", label: "Colecciones", icon: Icons.collection },
];

const DEFAULT_SECTION = "overview";

interface Props {
  current_user: CurrentUser;
  coordinators: Coordinators[];
  fetchMap: FetchMap;
}

export function Digitizer_page({
  current_user,
  coordinators,
  fetchMap,
}: Props) {
  const [activeNav, setActiveNav] = useState<string>(DEFAULT_SECTION);
  const router = useRouter();

  // Restaurar sección desde la URL al montar
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const s = params.get("s");
    if (s && navItems.some((n) => n.id === s)) setActiveNav(s);
  }, []);

  // Sincronizar con los botones atrás/adelante del navegador
  useEffect(() => {
    const onPopState = () => {
      const params = new URLSearchParams(window.location.search);
      const s = params.get("s") ?? DEFAULT_SECTION;
      setActiveNav(navItems.some((n) => n.id === s) ? s : DEFAULT_SECTION);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const handleNav = (id: string) => {
    setActiveNav(id);
    window.history.pushState(null, "", `?s=${id}`);
  };

  const handle_logout = async () => {
    await logout();
    router.refresh();
  };

  return (
    <div className="min-h-screen flex bg-base-200">
      <aside className="w-56 shrink-0 flex flex-col bg-base-100 text-base-content min-h-screen sticky top-0">
        <div className="px-6 py-6 border-b border-primary/50">
          <span className="login text-xl tracking-wide">Papiro</span>
          <p className="home text-xs text-base-content/40 font-light mt-0.5">
            Panel de digitalización
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-colors w-full
                      home text-sm font-light
                      ${
                        activeNav === item.id
                          ? "bg-primary text-primary-content"
                          : "text-base-content/70 hover:text-base-content hover:bg-primary/10"
                      }
                    `}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="px-4 py-4 border-t border-primary/50">
          <div className="flex items-center gap-3 mb-3">
            <div className="size-8 rounded-sm bg-primary flex items-center justify-center text-primary-content login text-sm shrink-0">
              {current_user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="home text-sm font-normal text-base-content truncate">
                {current_user.name}
              </p>
              <p className="home text-sm text-base-content/60 font-light">
                @{current_user.username}
              </p>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <button
              onClick={() => handle_logout()}
              className="flex items-center gap-2 text-base-content/60 hover:text-base-content transition-colors hover:cursor-pointer text-sm font-light"
            >
              {Icons.logout}
              Cerrar sesión
            </button>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="px-10 pt-10 pb-6 border-b border-primary/50">
          <p className="home text-xs text-base-content/40 uppercase tracking-widest font-light mb-1">
            {navItems.find((n) => n.id === activeNav)?.label}
          </p>
          <h1 className="login text-3xl text-base-content">
            {activeNav === "overview" &&
              `Bienvenidx, ${current_user.name.split(" ")[0]} ${current_user.name.split(" ")[1]}`}
            {activeNav === "colecciones" && "Visualizador de colecciones"}
            {activeNav === "new_collection" && "Crear una nueva colección"}
            {activeNav === "new_folder" &&
              "Agregar un nuevo folder a una colección existente"}
            {activeNav === "new_item" &&
              "Agregar un nuevo item a un folder existente"}
          </h1>
        </div>

        <div className="px-10 py-8">
          {activeNav === "overview" && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-base-content/50">
              <p className="home text-sm font-light">
                Este componente se construirá próximamente
              </p>
            </div>
          )}

          {activeNav === "new_collection" && (
            <New_collection_form
              COORDINATORS={coordinators}
              fetch_map={fetchMap}
              user={current_user}
            />
          )}

          {activeNav === "colecciones" && <Colecciones_dashboard />}
        </div>
      </main>
    </div>
  );
}
