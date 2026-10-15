import { FormCard } from "../components/FormCard";
import type { FormularioProps } from "./tipos";

/** Pendiente: aún no se definen los campos del registro. */
export default function FormularioRegistro({ info }: FormularioProps) {
  return (
    <FormCard titulo={info.tituloFormulario} descripcion={info.descripcion}>
      <p className="home py-6 text-sm font-light text-base-content/60">
        Aquí va el contenido de tu formulario...
      </p>
    </FormCard>
  );
}
