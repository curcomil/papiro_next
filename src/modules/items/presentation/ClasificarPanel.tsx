"use client";

import { useState } from "react";
import type { ValoresMetadatos } from "@/modules/metadatos/domain/campo-metadato";
import MetadatosSection from "@/modules/metadatos/presentation/components/MetadatosSection";
import { useColeccionDetalle } from "@/modules/metadatos/presentation/use-coleccion-detalle";
import { metadataParaGuardar, valoresDesdeMetadata } from "../domain/metadata-item";
import { useActualizarItem } from "./use-actualizar-item";
import { useItem } from "./use-item";

interface Props {
  internalId: string;
}

export default function ClasificarPanel({ internalId }: Props) {
  const estado = useItem(internalId);
  const { guardar, enviando } = useActualizarItem();

  // El schema pertenece a la colección, así que se pide cuando el item ya
  // trae los internal_id de sus padres.
  const item = estado.tipo === "success" ? estado.item : null;
  const estadoMetadatos = useColeccionDetalle(
    item?.coleccion.internalId ?? "",
    item?.subcoleccion.internalId ?? "",
  );

  /** `null` = intacto: se muestran los valores que ya tiene el item. */
  const [edicion, setEdicion] = useState<ValoresMetadatos | null>(null);

  if (estado.tipo === "loading") {
    return (
      <div className="flex justify-center py-16">
        <span className="loading loading-bars loading-xl"></span>
      </div>
    );
  }

  if (estado.tipo === "error") {
    return (
      <p className="home py-6 text-sm font-light text-error">
        {estado.message}
        {estado.status > 0 ? ` (status ${estado.status})` : null}
      </p>
    );
  }

  const valores = edicion ?? valoresDesdeMetadata(estado.item.metadata);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (enviando || estadoMetadatos.tipo !== "success") return;

    await guardar({
      coleccionInternalId: estado.item.coleccion.internalId,
      internalId: estado.item.internalId,
      metadata: metadataParaGuardar(estadoMetadatos.schema, valores),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="card w-full bg-base-100 card-md shadow-sm"
    >
      <div className="card-body">
        <MetadatosSection
          estado={estadoMetadatos}
          valores={valores}
          onChange={setEdicion}
          siempreClasificado
        />

        <div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-2 flex items-center justify-end gap-3 rounded-b-box border-t border-primary/20 bg-base-100 px-6 py-4">
          <button
            type="submit"
            className="btn btn-primary btn-sm home font-normal"
            disabled={enviando || estadoMetadatos.tipo !== "success"}
          >
            {enviando ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Guardando…
              </>
            ) : (
              "Guardar cambios"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
