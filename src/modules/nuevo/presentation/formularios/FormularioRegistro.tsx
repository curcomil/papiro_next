import { createColeccionesUseCases } from "../../application/list-colecciones";
import { createColeccionesRepository } from "../../infrastructure/fetch-colecciones-repository";
import RegistroForm from "./RegistroForm";
import type { FormularioProps } from "./tipos";

export default async function FormularioRegistro({ info }: FormularioProps) {
  const useCases = createColeccionesUseCases(createColeccionesRepository());
  // Aquí sí hacen falta las subcolecciones para el segundo select.
  const result = await useCases.listColecciones({ conSubcolecciones: true });

  return (
    <RegistroForm
      info={info}
      colecciones={result.colecciones}
      errorCarga={result.success ? "" : result.message}
    />
  );
}
