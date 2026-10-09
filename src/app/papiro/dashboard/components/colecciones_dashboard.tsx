import Link from "next/link";
import type { ColeccionDocument } from "../../services/xmlibris.types";
import type { FetchStatus } from "../page";

interface Props {
  colecciones: ColeccionDocument[];
  fetchStatus: FetchStatus;
}

export default function Colecciones_dashboard({
  colecciones,
  fetchStatus,
}: Props) {
  if (!fetchStatus.success) {
    return (
      <p className="home text-sm text-error font-light">
        {fetchStatus.message}
      </p>
    );
  }

  if (colecciones.length === 0) {
    return (
      <p className="home text-sm text-base-content/50 font-light">
        No hay colecciones registradas
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      {colecciones.map((col) => (
        <Link
          key={col._id}
          href={`/papiro/collection?coleccion=${col.coleccion.setspec_collection}`}
          className="card bg-base-100 w-48 card-xs shadow-xl mr-4"
        >
          <figure>
            <img
              src={col.app.miniatura || "/xmlibris/carpeta.png"}
              alt={col.coleccion.name_collection}
              className="pt-3 aspect-square object-contain"
            />
          </figure>
          <div className="card-body flex items-center justify-center">
            <h2 className="card-title text-center">
              {col.coleccion.name_collection}
            </h2>
          </div>
        </Link>
      ))}
    </div>
  );
}
