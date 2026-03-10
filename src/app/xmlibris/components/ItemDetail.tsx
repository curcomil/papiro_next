import Link from "next/link";
import type { Item } from "../services/amc_xlibris";
import { useRef } from "react";

type ItemDetailProps = {
  item: Item;
  onEditar: () => void;
};

export function ItemDetail({ item, onEditar }: ItemDetailProps) {
  const modalImageRef = useRef<HTMLDialogElement>(null);

  return (
    <div className="flex gap-3 2xl:gap-6">
      <div className="shrink-0">
        <dialog
          ref={modalImageRef}
          className="modal modal-bottom sm:modal-middle"
        >
          {" "}
          <div className="modal-box flex flex-col items-center gap-4">
            <img
              src={item.imagen_url}
              alt={item.titulo}
              className="max-w-full rounded-lg"
            />
            <div className="modal-action">
              <form method="dialog">
                <button className="btn btn-sm">Cerrar</button>
              </form>
            </div>
          </div>
        </dialog>

        {item.imagen_url ? (
          <img
            src={item.imagen_url}
            alt={item.titulo}
            className="w-20 h-20 2xl:w-32 2xl:h-32 object-cover rounded-lg shadow cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => modalImageRef.current?.showModal()}
          />
        ) : (
          <div className="w-20 h-20 2xl:w-32 2xl:h-32 bg-primary/10 rounded-lg shadow flex items-center justify-center">
            <svg
              className="w-8 h-8 text-base-content/20"
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
      </div>
      <div className="flex flex-col gap-0.5 flex-1 text-xs 2xl:text-sm">
        <h3 className="font-bold text-sm 2xl:text-base leading-tight mb-1">
          {item.titulo || "Sin título"}
        </h3>
        {[
          { label: "Autor", value: item.autor },
          { label: "Tipología", value: item.tipologia },
          { label: "Fecha", value: item.fecha },
          { label: "Dimensiones", value: item.dimensiones },
          { label: "Descripción", value: item.descripcion },
          { label: "Notas", value: item.notas },
          { label: "Avalúo", value: item.avaluo },
        ].map(({ label, value }) => (
          <p key={label}>
            <span className="font-semibold">{label}:</span> {value || "N/A"}
          </p>
        ))}
        {item.numero_inventario > 0 && (
          <p>
            <span className="font-semibold">Inventario:</span>{" "}
            {item.numero_inventario}
          </p>
        )}
        <div className="flex gap-2 mt-2">
          {item.url && (
            <Link href={item.url} target="_blank" rel="noopener noreferrer">
              <button className="btn btn-xs btn-soft btn-primary 2xl:btn-sm">
                Ver en Catarina ↗
              </button>
            </Link>
          )}
          <button
            onClick={onEditar}
            className="btn btn-xs btn-soft btn-primary 2xl:btn-sm"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
}
