import Link from "next/link";
import type { ReactNode } from "react";
import type { TipoFormulario } from "../domain/tipo-formulario";
import { TIPOS_FORMULARIO } from "../domain/tipo-formulario";
import { rutaNuevo } from "./rutas";

const ICONOS: Record<TipoFormulario, ReactNode> = {
  coleccion: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m0 0a2.246 2.246 0 00-.75-.128H5.25c-.263 0-.515.045-.75.128m15 0A2.25 2.25 0 0121 12v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6c0-.98.626-1.813 1.5-2.122"
    />
  ),
  subcoleccion: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
    />
  ),
  registro: (
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3h-6m-1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
    />
  ),
};

export default function NuevoPanel() {
  return (
    <div className="home grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {TIPOS_FORMULARIO.map((info) => (
        <Link
          key={info.tipo}
          href={rutaNuevo(info.tipo)}
          className="card group w-full border border-primary/20 bg-base-100 card-md shadow-sm transition-all hover:border-primary hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <div className="card-body gap-3">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-content">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {ICONOS[info.tipo]}
              </svg>
            </span>

            <h2 className="login text-lg leading-snug text-base-content">
              {info.titulo}
            </h2>

            <p className="grow text-sm font-light text-base-content/60">
              {info.descripcion}
            </p>

            <span className="inline-flex items-center gap-1.5 pt-1 text-xs uppercase tracking-widest text-primary">
              Crear
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-3.5 transition-transform group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
