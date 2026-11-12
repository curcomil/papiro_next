import type { Coleccion } from "../domain/coleccion";
import MiniaturaColeccion from "./MiniaturaColeccion";

interface Props {
  coleccion: Coleccion;
}

export default function TarjetaColeccion({ coleccion }: Props) {
  return (
    <article className="card w-3/4 cursor-pointer overflow-hidden border border-primary/20 bg-base-100 card-sm shadow-sm transition-all hover:border-primary/50 hover:shadow-md">
      <MiniaturaColeccion
        miniatura={coleccion.miniatura}
        nombre={coleccion.nombre}
      />

      <div className="px-3 py-2">
        <p className="home truncate text-sm text-base-content">
          {coleccion.nombre}
        </p>
      </div>
    </article>
  );
}
