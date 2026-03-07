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
}: {
  label: string;
  name: string;
  defaultValue?: string;
  type?: string;
}) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
      {label}
    </label>
    <input
      name={name}
      type={type}
      defaultValue={defaultValue ?? ""}
      className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
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
      className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-yellow-300 transition"
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

    if ("keywords" in datosActualizados) {
      (datosActualizados as any).keywords = stringToKeywords(
        datosActualizados.keywords,
      );
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
            onUpdate(res.carpeta ?? res.item);
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
          <h2 className="font-bold text-xl">{carpeta.nombre_expediente}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Nombre"
            name="nombre_expediente"
            defaultValue={carpeta.nombre_expediente}
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
        />
        <TextAreaField
          label="Notas"
          name="notas"
          defaultValue={carpeta.notas}
        />

        <button
          type="submit"
          className="mt-2 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition"
        >
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
          {item.imagen_url ? (
            <img
              src={item.imagen_url}
              alt={item.titulo}
              className="w-12 h-12 object-cover rounded-lg shadow"
            />
          ) : (
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-400">Sin img</span>
            </div>
          )}
          <h2 className="font-bold text-xl">{item.titulo || "Sin título"}</h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Título" name="titulo" defaultValue={item.titulo} />
          <Field label="Autor" name="autor" defaultValue={item.autor} />
          <Field
            label="Tipología"
            name="tipologia"
            defaultValue={item.tipologia}
          />
          <Field label="Fecha" name="fecha" defaultValue={item.fecha} />
          <Field
            label="Dimensiones"
            name="dimensiones"
            defaultValue={item.dimensiones}
          />
          <Field label="Avalúo" name="avaluo" defaultValue={item.avaluo} />
          <Field label="URL" name="url" defaultValue={item.url} />
          <Field
            label="URL imagen"
            name="imagen_url"
            defaultValue={item.imagen_url}
          />
        </div>

        <Field
          label="Palabras clave (separadas por coma)"
          name="keywords"
          defaultValue={keywordsToString(item.keywords)}
        />
        <TextAreaField
          label="Descripción"
          name="descripcion"
          defaultValue={item.descripcion}
        />
        <TextAreaField label="Notas" name="notas" defaultValue={item.notas} />

        <button
          type="submit"
          className="mt-2 w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition"
        >
          Guardar cambios
        </button>
      </form>
    );
  }

  return null;
};
