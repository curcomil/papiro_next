import type { ComponentType } from "react";
import type { TipoFormulario } from "../domain/tipo-formulario";
import { infoDeTipo } from "../domain/tipo-formulario";
import type { FormularioProps } from "./formularios/tipos";
import FormularioColeccion from "./formularios/FormularioColeccion";
import FormularioSubcoleccion from "./formularios/FormularioSubcoleccion";
import FormularioRegistro from "./formularios/FormularioRegistro";

// Exhaustivo: al añadir un tipo al dominio, TypeScript obliga a registrarlo aquí.
const FORMULARIOS: Record<TipoFormulario, ComponentType<FormularioProps>> = {
  coleccion: FormularioColeccion,
  subcoleccion: FormularioSubcoleccion,
  registro: FormularioRegistro,
};

interface Props {
  tipo: TipoFormulario;
}

export default function NuevoFormulario({ tipo }: Props) {
  const Formulario = FORMULARIOS[tipo];
  return <Formulario info={infoDeTipo(tipo)} />;
}
