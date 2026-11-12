import Link from "next/link";
import { RUTA_PENDIENTES } from "./rutas";

interface Props {
  /** Márgenes de alineación, que cambian según dónde se coloque. */
  className?: string;
}

/** Regreso a la sección «Pendientes», de donde salen los paneles de un item. */
export default function VolverPendientes({ className = "" }: Props) {
  return (
    <Link
      href={RUTA_PENDIENTES}
      className={`home btn btn-ghost btn-sm font-light text-base-content/60 hover:text-base-content ${className}`}
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
      Volver a pendientes
    </Link>
  );
}
