import { createColeccionesUseCases } from "../../application/list-colecciones";
import { createColeccionesRepository } from "../../infrastructure/fetch-colecciones-repository";
import SubcoleccionForm from "./SubcoleccionForm";
import type { FormularioProps } from "./tipos";

export default async function FormularioSubcoleccion({ info }: FormularioProps) {
  const useCases = createColeccionesUseCases(createColeccionesRepository());
  const result = await useCases.listColecciones();

  return (
    <SubcoleccionForm
      info={info}
      colecciones={result.colecciones}
      errorCarga={result.success ? "" : result.message}
    />
  );
}
