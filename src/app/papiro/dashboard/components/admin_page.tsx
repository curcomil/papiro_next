"use client";

import { useState, useEffect } from "react";
import UsersTable from "./users_dashboard";
import type { User } from "../../services/users.types";
import type { FetchMap } from "../page";
import { ThemeToggle } from "../../components/ThemeToggle";
import Colecciones_dashboard from "./colecciones_dashboard";
import { logout } from "../../services/auth";
import { useRouter } from "next/navigation";

interface CurrentUser {
  username: string;
  name: string;
  role: string;
}

// ── Iconos ─────────────────────────────────────────────
const Icons = {
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
  users: (
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
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
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
  digitizer: (
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
        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
      />
    </svg>
  ),
  coordinator: (
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
        d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"
      />
    </svg>
  ),
  chief: (
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
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    </svg>
  ),
};

// ── Stat Card ──────────────────────────────────────────
function StatCard({
  label,
  value,
  icon,
  accent = false,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-sm border p-5 flex flex-col gap-3 ${accent ? "bg-primary text-primary-content border-primary" : "bg-base-200 border-base-300"}`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`home text-xs uppercase tracking-widest font-normal ${accent ? "text-primary-content/70" : "text-base-content/50"}`}
        >
          {label}
        </span>
        <span
          className={
            accent ? "text-primary-content/70" : "text-base-content/40"
          }
        >
          {icon}
        </span>
      </div>
      <p
        className={`login text-3xl ${accent ? "text-primary-content" : "text-base-content"}`}
      >
        {value}
      </p>
    </div>
  );
}

// ── Constantes ─────────────────────────────────────────
const roleLabel: Record<string, string> = {
  digitizer: "Digitalizador",
  coordinator: "Coordinadora",
  chief: "Jefatura",
};

const mockActivity = [
  {
    user: "curcomil",
    action: "Digitalizó carpeta",
    target: "Africa - Fotografías",
    time: "Hace 2h",
    status: "pending_metadata",
  },
  {
    user: "marina",
    action: "Completó metadatos",
    target: "Amazon Carib Arawak",
    time: "Hace 4h",
    status: "pending_approval",
  },
  {
    user: "jefatura",
    action: "Aprobó carpeta",
    target: "Abstracto Decorativo",
    time: "Ayer",
    status: "approved",
  },
  {
    user: "curcomil",
    action: "Digitalizó carpeta",
    target: "Africa - Bocetos",
    time: "Ayer",
    status: "pending_metadata",
  },
];

const navItems = [
  { id: "overview", label: "General", icon: Icons.general },
  { id: "users", label: "Usuarios", icon: Icons.users },
  { id: "colecciones", label: "Colecciones", icon: Icons.collection },
  { id: "digitizer", label: "Digitalizador", icon: Icons.digitizer },
  { id: "coordinator", label: "Coordinadora", icon: Icons.coordinator },
  { id: "chief", label: "Jefatura", icon: Icons.chief },
];

const VALID_SECTIONS = navItems.map((n) => n.id);
const DEFAULT_SECTION = "overview";
const SESSION_KEY = "papiro_dashboard_section";

interface Props {
  current_user: CurrentUser;
  fetchMap: FetchMap;
  users: User[];
}

// ── Main ───────────────────────────────────────────────
export default function AdminView({ current_user, fetchMap, users }: Props) {
  const [activeNav, setActiveNav] = useState<string>(DEFAULT_SECTION);
  const router = useRouter();

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved && VALID_SECTIONS.includes(saved)) {
      setActiveNav(saved);
    }
  }, []);

  const handleNav = (id: string) => {
    setActiveNav(id);
    sessionStorage.setItem(SESSION_KEY, id);
  };

  const handle_logout = async () => {
    await logout();
    router.refresh();
  };

  return (
    <div className="min-h-screen flex bg-base-200">
      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 flex flex-col bg-base-100 text-base-content min-h-screen sticky top-0">
        <div className="px-6 py-6 border-b border-primary/50">
          <span className="login text-xl tracking-wide">Papiro</span>
          <p className="home text-xs text-base-content/40 font-light mt-0.5">
            Panel de administración
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
                    : "text-base-content/70 hover:text-base-content/80 hover:bg-primary/30"
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

      {/* ── Contenido ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-10 pt-10 pb-6 border-b border-primary/50">
          <p className="home text-xs text-base-content/40 uppercase tracking-widest font-light mb-1">
            {navItems.find((n) => n.id === activeNav)?.label}
          </p>
          <h1 className="login text-3xl text-base-content">
            {activeNav === "overview" &&
              `Bienvenidx, ${current_user.name.split(" ")[0]} ${current_user.name.split(" ")[1]}`}
            {activeNav === "users" && "Gestión de usuarios"}
            {activeNav === "colecciones" && "Visualizador de colecciones"}
            {activeNav === "digitizer" && "Vista digitalizador"}
            {activeNav === "coordinator" && "Vista coordinadora"}
            {activeNav === "chief" && "Vista jefatura"}
          </h1>
        </div>

        <div className="px-10 py-8">
          {activeNav === "overview" && (
            <div className="flex flex-col gap-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                  label="Usuarios activos"
                  value={4}
                  icon={Icons.users}
                  accent
                />
                <StatCard
                  label="Colecciones"
                  value={3}
                  icon={Icons.collection}
                />
                <StatCard
                  label="Carpetas totales"
                  value={142}
                  icon={Icons.folder}
                />
                <StatCard label="Pendientes" value={7} icon={Icons.clock} />
              </div>
              <div>
                <h2 className="login text-lg text-base-content mb-4">
                  Actividad reciente
                </h2>
                <div className="flex flex-col gap-2">
                  {mockActivity.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between px-4 py-3 bg-base-200 rounded-sm border border-base-300"
                    >
                      <div className="flex items-center gap-4">
                        <div className="size-7 rounded-sm bg-base-300 flex items-center justify-center login text-xs text-base-content/50 shrink-0">
                          {item.user.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="home text-sm font-normal text-base-content">
                            {item.action} —{" "}
                            <span className="text-base-content/60">
                              {item.target}
                            </span>
                          </p>
                          <p className="home text-xs text-base-content/40 font-light">
                            {item.user} · {item.time}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`badge badge-sm home font-light
                        ${item.status === "approved" ? "badge-success" : ""}
                        ${item.status === "pending_metadata" ? "badge-warning" : ""}
                        ${item.status === "pending_approval" ? "badge-info" : ""}
                      `}
                      >
                        {item.status === "approved" && "Aprobado"}
                        {item.status === "pending_metadata" && "Sin metadatos"}
                        {item.status === "pending_approval" && "En revisión"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeNav === "users" && (
            <UsersTable users={users} FetchStatus={fetchMap.users} />
          )}
          {activeNav === "colecciones" && <Colecciones_dashboard />}

          {["digitizer", "coordinator", "chief"].includes(activeNav) && (
            <div className="flex flex-col items-center justify-center py-24 gap-4 text-base-content/30">
              <div className="size-12 rounded-sm border-2 border-dashed border-base-300 flex items-center justify-center">
                {navItems.find((n) => n.id === activeNav)?.icon}
              </div>
              <p className="login text-xl">{roleLabel[activeNav]}</p>
              <p className="home text-sm font-light">
                Este componente se construirá próximamente
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
