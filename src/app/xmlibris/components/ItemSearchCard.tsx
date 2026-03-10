import type { Item } from "../services/amc_xlibris";

type ItemSearchCardProps = {
  item: Item;
  seleccionado: boolean;
  onClick: () => void;
};

export function ItemSearchCard({
  item,
  seleccionado,
  onClick,
}: ItemSearchCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded p-2 2xl:p-3 transition-all flex flex-col items-center text-center gap-1.5 border
        ${
          seleccionado
            ? "bg-primary/40 border-primary shadow-md"
            : "bg-base-200 border-transparent shadow-sm hover:shadow-md hover:border-primary"
        }`}
    >
      {item.imagen_url ? (
        <img
          src={item.imagen_url}
          alt={item.titulo}
          className="w-30 h-30 2xl:w-40 2xl:h-40 object-cover rounded-lg"
        />
      ) : (
        <div className="w-10 h-10 2xl:w-14 2xl:h-14 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
          <svg
            className="w-5 h-5 text-base-content/30"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      )}
      <p className="font-semibold text-xs leading-tight line-clamp-2">
        {item.titulo || "Sin título"}
      </p>
      {item.numero_inventario > 0 && (
        <p className="text-xs text-base-content/50">
          Inv. {item.numero_inventario}
        </p>
      )}
    </div>
  );
}
