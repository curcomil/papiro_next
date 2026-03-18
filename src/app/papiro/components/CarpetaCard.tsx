import type { Carpeta } from "../services/amc_xlibris";

type CarpetaCardProps = {
  carpeta: Carpeta;
  seleccionada: boolean;
  onClick: () => void;
};

export function CarpetaCard({
  carpeta,
  seleccionada,
  onClick,
}: CarpetaCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded p-2 2xl:p-3 transition-all flex flex-col items-center text-center gap-1 border
        ${
          seleccionada
            ? "bg-primary text-primary-content border-primary shadow"
            : "bg-base-200 border-transparent shadow-sm hover:shadow-md hover:border-primary"
        }`}
    >
      <img
        src="/xmlibris/carpeta.png"
        alt="Carpeta"
        className="w-10 h-10 2xl:w-14 2xl:h-14 object-contain"
      />
      <p className="font-semibold text-xs leading-tight line-clamp-2">
        {carpeta.nombre_expediente}
      </p>
      <p
        className={`text-xs ${seleccionada ? "text-primary-content/50" : "text-base-content/50"}`}
      >
        {carpeta.items.length} items
      </p>
    </div>
  );
}
