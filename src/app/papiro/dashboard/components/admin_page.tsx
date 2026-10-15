"use client";

import UsersPanel from "@/modules/users/presentation/UsersPanel";
import NuevoPanel from "@/modules/nuevo/presentation/NuevoPanel";
import type { User } from "@/modules/users/domain/user";
import type { LoadStatus } from "@/modules/users/domain/user-repository";
import { ThemeToggle } from "../../components/ThemeToggle";
import { logout } from "../../services/auth";
import { useRouter } from "next/navigation";
import { useSectionParam } from "../hooks/use-section-param";

interface CurrentUser {
  username: string;
  name: string;
  role: string;
}

interface Props {
  current_user: CurrentUser;
  users: User[];
  usersStatus: LoadStatus;
}

// ── Iconos ─────────────────────────────────────────────
const Icons = {
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
  nuevo: (
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
        d="M12 4.5v15m7.5-7.5h-15"
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
};

// ── Secciones ──────────────────────────────────────────
const SECTIONS = [
  {
    id: "usuarios",
    label: "Usuarios",
    title: "Gestión de usuarios",
    icon: Icons.users,
  },
  { id: "nuevo", label: "Nuevo", title: "Nuevo", icon: Icons.nuevo },
] as const;

type SectionId = (typeof SECTIONS)[number]["id"];

const DEFAULT_SECTION: SectionId = "usuarios";
const SECTION_IDS = SECTIONS.map((section) => section.id);

// ── Main ───────────────────────────────────────────────
export default function AdminView({
  current_user,
  users,
  usersStatus,
}: Props) {
  const router = useRouter();
  const [section, goToSection] = useSectionParam(
    SECTION_IDS,
    DEFAULT_SECTION,
  );

  const active = SECTIONS.find((item) => item.id === section) ?? SECTIONS[0];

  const handle_logout = async () => {
    await logout();
    router.refresh();
  };

  return (
    <div className="min-h-screen flex bg-base-200">
      {/* ── Sidebar ── */}
      <aside className="w-56 shrink-0 flex flex-col bg-base-100 text-base-content h-screen sticky top-0 self-start overflow-y-auto">
        <div className="px-6 py-6 border-b border-primary/50">
          <span className="login text-xl tracking-wide">Papiro</span>
          <p className="home text-xs text-base-content/40 font-light mt-0.5">
            Panel de administración
          </p>
        </div>

        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
          {SECTIONS.map((item) => (
            <button
              key={item.id}
              onClick={() => goToSection(item.id)}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-sm text-left transition-colors w-full
                home text-sm font-light
                ${
                  active.id === item.id
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

      {/* ── Contenido ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="px-10 pt-10 pb-6 border-b border-primary/50">
          <p className="home text-xs text-base-content/40 uppercase tracking-widest font-light mb-1">
            {active.label}
          </p>
          <h1 className="login text-3xl text-base-content">{active.title}</h1>
        </div>

        <div className="px-10 py-8">
          {section === "usuarios" && (
            <UsersPanel users={users} status={usersStatus} />
          )}
          {section === "nuevo" && <NuevoPanel />}
        </div>
      </main>
    </div>
  );
}
