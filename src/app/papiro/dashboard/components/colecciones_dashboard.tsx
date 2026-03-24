import Link from "next/link";

export default function Colecciones_dashboard() {
  return (
    <div>
      <Link href={"/papiro"} className="card bg-base-100 w-64 h-84 shadow-xl">
        <figure>
          <img
            src="https://catarina.udlap.mx/ximg/db/xmlibris/sala_de_archivos_y_colecciones_especiales/fondo_moderno/archivo_miguel_covarrubias/miguel_y_rosa_covarrubias_i_fotografias/amc_32777.jpg"
            alt="Miguel Covarrubias"
          />
        </figure>
        <div className="card-body">
          <h2 className="card-title">Archivo Miguel Covarrubias</h2>
        </div>
      </Link>
    </div>
  );
}
