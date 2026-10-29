"use client";

import type { ProgresoSubida } from "../../domain/nuevo-registro";

const LEYENDA =
  "fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest";

const ACEPTA_LIBRO = ".zip,application/zip";
const ACEPTA_SUELTO = ".jpg,.jpeg,.png,.pdf,image/jpeg,image/png,application/pdf";

interface Props {
  libro: boolean;
  archivo: File | null;
  onArchivoChange: (archivo: File | null) => void;
  /** Solo tiene valor mientras la subida del ZIP está en curso. */
  progreso: ProgresoSubida | null;
  enviando: boolean;
  onCancelar: () => void;
  error: string;
}

function formatearBytes(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const unidades = ["KB", "MB", "GB"];
  let valor = bytes / 1024;
  let indice = 0;

  while (valor >= 1024 && indice < unidades.length - 1) {
    valor /= 1024;
    indice += 1;
  }

  return `${valor.toFixed(valor >= 10 ? 0 : 1)} ${unidades[indice]}`;
}

export default function ArchivoSection({
  libro,
  archivo,
  onArchivoChange,
  progreso,
  enviando,
  onCancelar,
  error,
}: Props) {
  const porcentaje =
    progreso && progreso.total > 0
      ? Math.min(100, Math.round((progreso.cargados / progreso.total) * 100))
      : 0;

  return (
    <fieldset className="fieldset" aria-busy={Boolean(progreso)}>
      <legend className={LEYENDA}>
        <span>
          Archivo
          <span className="text-error" aria-hidden="true">
            {" *"}
          </span>
        </span>
        <span className="home text-xs font-normal normal-case tracking-normal text-base-content/40">
          {libro ? "Un .zip" : "Un .jpg, .png o .pdf"}
        </span>
      </legend>

      {archivo ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-primary/20 bg-base-200 px-4 py-3">
          <div className="flex min-w-0 flex-col">
            <span className="home truncate text-sm font-light text-base-content/80">
              {archivo.name}
            </span>
            <span className="home text-xs font-light text-base-content/50">
              {formatearBytes(archivo.size)}
              {progreso ? ` · ${porcentaje}%` : null}
            </span>
          </div>
          <button
            type="button"
            className="btn btn-ghost btn-sm home font-normal"
            onClick={() => onArchivoChange(null)}
            disabled={enviando}
          >
            Quitar
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-sm border border-dashed border-primary/40 bg-base-200/40 px-4 py-8 text-center transition-colors hover:border-primary/70">
          <span className="home text-sm font-light text-base-content/70">
            Haz clic para elegir el archivo
          </span>
          <span className="home text-xs font-light text-base-content/40">
            {libro
              ? "Un único .zip con las páginas numeradas"
              : "Un único .jpg, .jpeg, .png o .pdf"}
          </span>
          <input
            type="file"
            className="hidden"
            accept={libro ? ACEPTA_LIBRO : ACEPTA_SUELTO}
            onChange={(event) => {
              onArchivoChange(event.target.files?.[0] ?? null);
              // Sin esto, volver a elegir el mismo archivo rechazado no dispara
              // el evento y el usuario se queda sin forma de corregirlo.
              event.target.value = "";
            }}
            disabled={enviando}
          />
        </label>
      )}

      {progreso && (
        <div className="flex items-center gap-3 pt-1">
          <progress
            className="progress progress-primary w-full"
            value={porcentaje}
            max={100}
          />
          <button
            type="button"
            className="btn btn-ghost btn-xs home font-normal text-error"
            onClick={onCancelar}
          >
            Cancelar
          </button>
        </div>
      )}

      {error && (
        <p className="home text-xs font-light text-error">{error}</p>
      )}
    </fieldset>
  );
}
