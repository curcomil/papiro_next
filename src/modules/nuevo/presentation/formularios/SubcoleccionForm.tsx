"use client";

import { useState } from "react";
import { FormCard } from "../components/FormCard";
import {
  CampoReferencia,
  CampoSelect,
  CampoTexto,
} from "@/modules/metadatos/presentation/components/Campos";
import type { OpcionSelect } from "@/modules/metadatos/presentation/components/Campos";
import type { ColeccionPadre } from "../../domain/coleccion-padre";
import type { TipoFormularioInfo } from "../../domain/tipo-formulario";
import { useCrearSubcoleccion } from "../use-crear-subcoleccion";

interface Props {
  info: TipoFormularioInfo;
  colecciones: ColeccionPadre[];
  errorCarga: string;
}

export default function SubcoleccionForm({
  info,
  colecciones,
  errorCarga,
}: Props) {
  const { crearSubcoleccion } = useCrearSubcoleccion();
  const [coleccionId, setColeccionId] = useState("");
  const [nombre, setNombre] = useState("");
  const [intentado, setIntentado] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const opcionesColeccion: OpcionSelect[] = colecciones.map((coleccion) => ({
    value: coleccion.internalId,
    label: coleccion.nombre,
  }));

  const errorValidacion = !coleccionId
    ? "Selecciona una colección padre."
    : !nombre.trim()
      ? "El nombre de la nueva subcolección es obligatorio."
      : "";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIntentado(true);

    if (errorValidacion) return;

    setEnviando(true);
    const creada = await crearSubcoleccion({
      nombre,
      coleccionInternalId: coleccionId,
    });

    // Si se creó, el hook ya navegó al panel y este componente se desmonta.
    if (!creada) setEnviando(false);
  };

  return (
    <FormCard titulo={info.tituloFormulario} descripcion={info.descripcion}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1fr_auto]">
          <CampoSelect
            label="Colección Padre"
            value={coleccionId}
            onChange={setColeccionId}
            opciones={opcionesColeccion}
            placeholder="Selecciona una colección"
          />
          <CampoTexto
            label="Nombre nueva subcolección"
            value={nombre}
            onChange={setNombre}
            placeholder={
              coleccionId
                ? "Nombre de la subcolección"
                : "Elige una colección padre"
            }
            disabled={!coleccionId}
            required
          />
          <CampoReferencia label="internal_id" value={coleccionId || "—"} />
        </div>

        {errorCarga && (
          <p className="home text-xs font-light text-error">{errorCarga}</p>
        )}

        <div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-2 flex flex-wrap items-center justify-between gap-3 rounded-b-box border-t border-primary/20 bg-base-100 px-6 py-4">
          {intentado && errorValidacion && (
            <p className="home text-sm font-light text-error">
              {errorValidacion}
            </p>
          )}
          <button
            type="submit"
            className="btn btn-primary btn-sm home font-normal ml-auto"
            disabled={enviando}
          >
            {enviando ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              "Crear subcolección"
            )}
          </button>
        </div>
      </form>
    </FormCard>
  );
}
