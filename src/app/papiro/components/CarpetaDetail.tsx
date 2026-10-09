import type { Carpeta } from "../services/amc_xlibris.types";

type CarpetaDetailProps = {
  carpeta: Carpeta;
  onEditar: () => void;
};

export function CarpetaDetail({ carpeta, onEditar }: CarpetaDetailProps) {
  return (
    <div className="flex-none flex gap-3">
      <img
        className="w-12 h-12 2xl:w-16 2xl:h-16 object-contain shrink-0"
        src="/xmlibris/carpeta.png"
        alt="Carpeta"
      />
      <div className="flex flex-col flex-1 min-w-0 justify-between">
        <div>
          <h2 className="font-bold text-sm 2xl:text-xl leading-tight truncate">
            {carpeta.name_subcollection}
          </h2>
          <div className="mt-1 space-y-0.5">
            {[
              { label: "Referencia", value: carpeta.app.referencia_externa },
              { label: "Notas", value: carpeta.app.notas },
            ].map(({ label, value }) => (
              <p key={label} className="text-xs 2xl:text-sm truncate">
                <span className="font-medium">{label}:</span> {value || "N/A"}
              </p>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-2">
          <button
            onClick={onEditar}
            className="btn btn-primary btn-xs btn-soft 2xl:btn-sm"
          >
            Editar carpeta
          </button>
        </div>
      </div>
    </div>
  );
}
