"use client";

import Swal from "sweetalert2";
import { amcService } from "../services/amc_xlibris";
import type { Carpeta, Item } from "../services/amc_xlibris";

// ─────────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────────
interface EditFormProps {
  elemento: Carpeta | Item;
  close_modal: () => void;
  onUpdate: any;
}

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const keywordsToString = (keywords: string[] | undefined): string =>
  keywords?.join(", ") ?? "";

const stringToKeywords = (keywords: string | undefined): string[] =>
  keywords
    ? keywords
        .split(",")
        .map((kw) => kw.trim())
        .filter(Boolean)
    : [];

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

    // keywords de carpeta (nivel raíz)
    if ("keywords" in datosActualizados) {
      (datosActualizados as Record<string, unknown>).keywords = stringToKeywords(
        datosActualizados.keywords,
      );
    }
    // keywords de item (nivel papiro_data)
    if ("papiro_data.keywords" in datosActualizados) {
      (datosActualizados as Record<string, unknown>)["papiro_data.keywords"] =
        stringToKeywords(datosActualizados["papiro_data.keywords"]);
    }

    // Cerrar modal primero y esperar animación de DaisyUI antes de mostrar Swal
    close_modal();

    setTimeout(() => {
      Swal.fire({
        title: "¿Guardar cambios?",
        text: `Se actualizará ${elemento.type === "carpeta" ? "la carpeta" : "el item"}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Sí, actualizar",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#ca8a04",
      }).then((result) => {
        if (!result.isConfirmed) return;

        const request =
          elemento.type === "carpeta"
            ? amcService.updateCarpeta(elemento._id, datosActualizados)
            : amcService.updateItem(elemento._id, datosActualizados);

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
  if (elemento.type === "carpeta") {
    const carpeta = elemento as Carpeta;
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2">
        <div className="flex items-center gap-3 mb-2">
          <img className="w-12" src="/xmlibris/carpeta.png" alt="Carpeta" />
          <h2 className="font-bold text-xl">{carpeta.subcoleccion}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Nombre"
            name="subcoleccion"
            defaultValue={carpeta.subcoleccion}
          />
          <Field
            label="Ubicación física"
            name="ubicacion_fisica"
            defaultValue={carpeta.ubicacion_fisica}
          />
          <Field
            label="Referencia a la libreta"
            name="referencia_control"
            defaultValue={carpeta.referencia_control}
          />
          <Field label="URL" name="url" defaultValue={carpeta.url} />
        </div>

        <Field
          label="Palabras clave (separadas por coma)"
          name="keywords"
          defaultValue={keywordsToString(carpeta.keywords)}
          styles="w-full"
        />

        <TextAreaField
          label="Notas"
          name="notas"
          defaultValue={carpeta.notas}
        />

        <button type="submit" className="mt-2 w-full btn btn-primary">
          Guardar cambios
        </button>
      </form>
    );
  }

  // ── Form item ──
  if (elemento.type === "item") {
    const item = elemento as Item;
    return (
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-2">
        <div className="flex items-center gap-3 mb-2">
          {item.papiro_data.imagen_url ? (
            <img
              src={item.papiro_data.imagen_url}
              alt={item.dc_metadata.titulo}
              className="w-12 h-12 object-cover rounded-lg shadow"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-400">Sin img</span>
            </div>
          )}
          <h2 className="font-bold text-xl">{item.dc_metadata.titulo || "Sin título"}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Título" name="dc_metadata.titulo" defaultValue={item.dc_metadata.titulo} />
          <Field label="Autor" name="dc_metadata.autor" defaultValue={item.dc_metadata.autor} />
          <Field
            label="Tipología"
            name="papiro_data.tipo_de_objeto"
            defaultValue={item.papiro_data.tipo_de_objeto}
          />
          <Field
            label="Dimensiones"
            name="dc_metadata.medidas"
            defaultValue={item.dc_metadata.medidas}
          />
          <Field label="Avalúo" name="papiro_data.avaluo" defaultValue={item.papiro_data.avaluo} />
          <Field label="URL" name="papiro_data.item_url" defaultValue={item.papiro_data.item_url} />
          <Field
            label="URL imagen"
            name="papiro_data.imagen_url"
            defaultValue={item.papiro_data.imagen_url}
          />
        </div>

        <Field
          label="Palabras clave (separadas por coma)"
          name="papiro_data.keywords"
          defaultValue={keywordsToString(item.papiro_data.keywords)}
          styles="w-full"
        />
        <TextAreaField
          label="Descripción"
          name="dc_metadata.descripcion"
          defaultValue={item.dc_metadata.descripcion}
        />
        <TextAreaField label="Notas" name="papiro_data.notas" defaultValue={item.papiro_data.notas} />

        <button type="submit" className="mt-2 w-full btn btn-primary">
          Guardar cambios
        </button>
      </form>
    );
  }

  return null;
};
