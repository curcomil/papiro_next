"use client";

import Swal from "sweetalert2";
import { updateCarpeta, updateItem } from "../services/amc_xlibris";
import type { Carpeta, Item } from "../services/amc_xlibris.types";

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────
interface EditFormProps {
  tipo: "carpeta" | "item";
  coleccion: string;
  elemento: Carpeta | Item;
  close_modal: () => void;
  onUpdate: any;
}

// ─────────────────────────────────────────────
// Subcomponentes de campo
// ─────────────────────────────────────────────
const Field = ({
  label,
  name,
  defaultValue,
  type = "text",
  styles,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
  styles?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {label}
    </label>
    <input
      name={name}
      type={type}
      defaultValue={defaultValue ?? ""}
      className={`input input-primary ${styles && styles}`}
    />
  </div>
);

const TextAreaField = ({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {label}
    </label>
    <textarea
      name={name}
      defaultValue={defaultValue ?? ""}
      rows={3}
      className="textarea textarea-primary w-full"
    />
  </div>
);

// ─────────────────────────────────────────────
// Componente principal
// ─────────────────────────────────────────────
export const EditForm = ({
  tipo,
  coleccion,
  elemento,
  close_modal,
  onUpdate,
}: EditFormProps) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);
    const datosActualizados = Object.fromEntries(formData.entries()) as Record<
      string,
      string
    >;

    // Cerrar modal primero y esperar animación de DaisyUI antes de mostrar Swal
    close_modal();

    setTimeout(() => {
      Swal.fire({
        title: "¿Guardar cambios?",
        text: `Se actualizará ${tipo === "carpeta" ? "la carpeta" : "el item"}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, actualizar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#ca8a04",
      }).then((result) => {
        if (!result.isConfirmed) return;

        const request =
          tipo === "carpeta"
            ? updateCarpeta(
                coleccion,
                (elemento as Carpeta).internal_id,
                datosActualizados,
              )
            : updateItem(coleccion, (elemento as Item).internal_id, datosActualizados);

        request
          .then((res: any) => {
            onUpdate(res.data);
            Swal.fire({
              title: "¡Actualizado!",
              text: res.message,
              icon: "success",
              confirmButtonColor: "#ca8a04",
            });
            formElement.reset();
          })
          .catch((error: Error) => {
            Swal.fire({
              title: "Error",
              text: `Error al actualizar: ${error.message}`,
              icon: "error",
            });
          });
      });
    }, 400);
  };

  // ── Form carpeta ──
  if (tipo === "carpeta") {
    const carpeta = elemento as Carpeta;
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2">
        <div className="flex items-center gap-3 mb-2">
          <img className="w-12" src="/xmlibris/carpeta.png" alt="Carpeta" />
          <h2 className="font-bold text-xl">{carpeta.name_subcollection}</h2>
        </div>

        {/* El body viaja como $set con rutas con punto sobre la subcolección
            embebida en el registro de colecciones. Solo se aceptan
            name_subcollection, status y app.*; internal_id y
            setspec_subcollection no son editables. */}
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Nombre"
            name="name_subcollection"
            defaultValue={carpeta.name_subcollection}
          />
          <Field
            label="Referencia a la libreta"
            name="app.referencia_externa"
            defaultValue={carpeta.app.referencia_externa}
          />
        </div>

        <TextAreaField
          label="Notas"
          name="app.notas"
          defaultValue={carpeta.app.notas}
        />

        <button type="submit" className="mt-2 w-full btn btn-primary">
          Guardar cambios
        </button>
      </form>
    );
  }

  // ── Form item ──
  if (tipo === "item") {
    const item = elemento as Item;
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2">
        <div className="flex items-center gap-3 mb-2">
          {item.portada_url ? (
            <img
              src={item.portada_url}
              alt={item.metadata.titulo}
              className="w-12 h-12 object-cover rounded-lg shadow"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-400">Sin img</span>
            </div>
          )}
          <h2 className="font-bold text-xl">
            {item.metadata.titulo || "Sin título"}
          </h2>
        </div>

        {/* El body viaja como $set con rutas con punto sobre el documento de
            'items' (solo metadata.*, app.* e is_published). Los campos que ya no
            existen en el modelo nuevo — avalúo, URL del item, URL de imagen y
            palabras clave — se quitaron del formulario.
            OJO (pendiente): estos nombres son los de AMC. En las colecciones
            cuyo schema usa "descripcion_fisica", editar la descripción
            escribiría un campo distinto. Se corrige al pintar el formulario
            desde el schema de la colección. */}
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Título"
            name="metadata.titulo"
            defaultValue={item.metadata.titulo}
          />
          <Field
            label="Autor"
            name="metadata.autor"
            defaultValue={item.metadata.autor ?? ""}
          />
          <Field
            label="Tipología"
            name="metadata.tipo_de_objeto"
            defaultValue={item.metadata.tipo_de_objeto ?? ""}
          />
          <Field
            label="Dimensiones"
            name="metadata.medidas"
            defaultValue={item.metadata.medidas ?? ""}
          />
          <Field
            label="Número de inventario"
            name="metadata.clasificacion_local"
            defaultValue={item.metadata.clasificacion_local ?? ""}
          />
        </div>

        <TextAreaField
          label="Descripción"
          name="metadata.descripcion"
          defaultValue={
            item.metadata.descripcion ?? item.metadata.descripcion_fisica ?? ""
          }
        />
        <TextAreaField
          label="Notas"
          name="app.notas"
          defaultValue={item.app.notas ?? ""}
        />

        <button type="submit" className="mt-2 w-full btn btn-primary">
          Guardar cambios
        </button>
      </form>
    );
  }

  return null;
};
