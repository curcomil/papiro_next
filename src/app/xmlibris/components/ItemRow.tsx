import type { Item } from "../services/amc_xlibris";

type ItemRowProps = {
  item: Item;
  seleccionado: boolean;
  onClick: () => void;
};

export function ItemRow({ item, seleccionado, onClick }: ItemRowProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer rounded-lg p-2 transition-all border
        ${
          seleccionado
            ? "bg-primary text-primary-content border-primary shadow"
            : "bg-base-100 border-transparent shadow-sm hover:shadow hover:border-primary"
        }`}
    >
      <p className="text-xs font-bold truncate">
        {item.titulo || "Sin título"}
      </p>
      <p
        className={`text-xs truncate mt-0.5 ${seleccionado ? "text-primary-content/50" : "text-base-content/50"}`}
      >
        {item.tipologia || "—"}
      </p>
      <p
        className={`text-xs truncate mt-0.5 ${seleccionado ? "text-primary-content/50" : "text-base-content/50"}`}
      >
        {item.autor || "—"}
      </p>
    </div>
  );
}
