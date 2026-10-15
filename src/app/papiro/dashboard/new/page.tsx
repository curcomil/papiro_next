import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import NuevoFormulario from "@/modules/nuevo/presentation/NuevoFormulario";
import { isTipoFormulario } from "@/modules/nuevo/domain/tipo-formulario";
import { RUTA_PANEL } from "@/modules/nuevo/presentation/rutas";

interface PageProps {
  searchParams: Promise<{ tipo?: string }>;
}

function Volver() {
  return (
    <Link
      href={RUTA_PANEL}
      className="home btn btn-ghost btn-sm -ml-3 mb-4 font-light text-base-content/60 hover:text-base-content"
    >
      <svg
        className="size-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
        />
      </svg>
      Volver al panel
    </Link>
  );
}

export default async function NuevoPage({ searchParams }: PageProps) {
  const cookieStore = await cookies();
  const user = JSON.parse(cookieStore.get("user")?.value || "null");

  // Mismo fallback que el dashboard. El token ya lo validó el middleware.
  if (!user || !user.role) {
    redirect("/papiro/login?error=invalid_session");
  }

  const { tipo } = await searchParams;

  return (
    <div className="min-h-screen bg-base-200 text-base-content">
      <div className="mx-auto w-full max-w-4xl px-6 py-10">
        <Volver />

        {isTipoFormulario(tipo) ? (
          <NuevoFormulario tipo={tipo} />
        ) : (
          <div className="card w-full bg-base-100 card-md shadow-sm">
            <div className="card-body items-start">
              <h1 className="login text-2xl">Tipo no válido</h1>
              <p className="home text-sm font-light text-base-content/60">
                La URL debe incluir un parámetro{" "}
                <code className="font-mono bg-base-300 px-1 rounded">tipo</code>{" "}
                con uno de los valores disponibles (
                <em>coleccion</em>, <em>subcoleccion</em> o <em>registro</em>).
              </p>
              <div className="card-actions mt-4">
                <Link href={RUTA_PANEL} className="btn btn-sm btn-primary">
                  Volver al panel
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
