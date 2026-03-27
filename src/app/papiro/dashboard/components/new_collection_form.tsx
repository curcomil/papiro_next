"use client";

import { useState } from "react";
import type { Coordinators } from "../../services/users.types";
import type { FetchMap } from "../page";
import type { CurrentUser } from "./digitizer_page";
import { new_collection } from "../../services/xmlibris";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export interface CollectionForm {
  name: string;
  coordinators: string[]; // array de _id
  new_collection_name: string;
}

function toSetspec(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()
    .replace(/\s+/g, "_");
}

interface Props {
  COORDINATORS: Coordinators[];
  fetch_map: FetchMap;
  user: CurrentUser;
}

export default function New_collection_form({
  COORDINATORS,
  fetch_map,
  user,
}: Props) {
  const router = useRouter();
  const [form, setForm] = useState<CollectionForm>({
    name: "",
    coordinators: [],
    new_collection_name: "",
  });
  const [isPending, setIsPending] = useState(false);

  const setspec = toSetspec(form.name);

  const toggleCoordinator = (id: string) => {
    setForm((prev) => ({
      ...prev,
      coordinators: prev.coordinators.includes(id)
        ? prev.coordinators.filter((c) => c !== id)
        : [...prev.coordinators, id],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    // TODO: conectar con createCollection()
    const result = await new_collection({ ...form, setspec, user });

    if (result.success) {
      await Swal.fire({
        icon: "success",
        title: "Colección creada",
        text: "La colección será aprovada por la coordinación asignada",
        timer: 2000,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      router.refresh();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al crear usuario",
        text: result.message,
        confirmButtonColor: "oklch(42% 0.09 330)",
      });
    }

    setIsPending(false);
  };

  if (!fetch_map.coordinators.success) {
    return (
      <div className="max-w-xl">
        <p className="home text-sm text-error font-light">
          {fetch_map.coordinators.message}
        </p>
      </div>
    );
  } else {
    return (
      <div className="max-w-xl flex flex-col gap-8">
        {/* Intro */}
        <div>
          <p className="home text-sm text-base-content/50 font-light leading-relaxed">
            La colección quedará en revisión hasta que sea aprobada por la
            jefatura. El coordinador asignado podrá editar los metadatos antes
            de enviarla a aprobación.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Nombre */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest">
              Nombre de la colección
            </legend>
            <input
              type="text"
              className="input w-full home font-light text-sm border-neutral/50"
              placeholder="Ej. Archivo Miguel Covarrubias"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />

            {/* Preview del setspec */}
            {form.name && (
              <div className="mt-2 flex items-center gap-2">
                <span className="home text-xs text-base-content/30 font-light uppercase tracking-widest">
                  Identificador
                </span>
                <code className="home text-xs text-base-content/50 bg-base-300 px-2 py-0.5 rounded-sm">
                  {setspec}
                </code>
              </div>
            )}
          </fieldset>

          {/* Nombre nueva colección en mongo */}

          <fieldset className="fieldset">
            <legend className="fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest">
              Colección en la db
            </legend>
            <input
              type="text"
              className="input w-full home font-light text-sm border-neutral/50"
              placeholder="Ej. amc"
              value={form.new_collection_name}
              onChange={(e) =>
                setForm({ ...form, new_collection_name: e.target.value })
              }
              required
            />
          </fieldset>

          {/* Coordinadores */}
          <fieldset className="fieldset">
            <legend className="fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest">
              Coordinadores asignados
            </legend>

            <div className="flex flex-col gap-2 mt-1">
              {COORDINATORS.map((coord: Coordinators) => {
                const active = form.coordinators.includes(coord._id);
                return (
                  <label
                    key={coord._id}
                    className={`
                    flex items-center gap-3 px-4 py-3 rounded-sm border cursor-pointer transition-colors
                    ${
                      active
                        ? "border-primary bg-primary/5"
                        : "border-neutral/50 hover:border-base-content/20"
                    }
                  `}
                  >
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary checkbox-sm"
                      checked={active}
                      onChange={() => toggleCoordinator(coord._id)}
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <div
                        className={`
                      size-7 rounded-sm flex items-center justify-center login text-xs shrink-0
                      ${active ? "bg-primary text-primary-content" : "bg-base-300 text-base-content/50"}
                    `}
                      >
                        {coord.name.charAt(0)}
                      </div>
                      <div>
                        <p
                          className={`home text-sm font-normal ${active ? "text-base-content" : "text-base-content/70"}`}
                        >
                          {coord.name}
                        </p>
                        <p className="home text-xs text-base-content/40 font-light">
                          @{coord.username}
                        </p>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            {form.coordinators.length === 0 && (
              <p className="home text-xs text-base-content/50 font-light mt-2">
                Sin coordinadores asignados
              </p>
            )}
          </fieldset>

          {/* Resumen antes de enviar */}
          {form.name && (
            <div className="bg-base-200 border border-primary/50 rounded-sm px-4 py-4 flex flex-col gap-1.5">
              <p className="home text-xs text-base-content/40 uppercase tracking-widest font-normal mb-1">
                Resumen
              </p>
              <p className="home text-sm text-base-content font-light">
                <span className="text-base-content/50">Nombre — </span>
                {form.name}
              </p>
              <p className="home text-sm text-base-content font-light">
                <span className="text-base-content/50">
                  Nombre coleccion en db —{" "}
                </span>
                {form.new_collection_name}
              </p>
              <p className="home text-sm text-base-content font-light">
                <span className="text-base-content/50">Identificador — </span>
                <code className="text-xs bg-base-300 px-1.5 py-0.5 rounded-sm">
                  {setspec}
                </code>
              </p>
              <p className="home text-sm text-base-content font-light">
                <span className="text-base-content/50">Coordinadores — </span>
                {form.coordinators.length > 0
                  ? COORDINATORS.filter((c) =>
                      form.coordinators.includes(c._id),
                    )
                      .map((c) => c.name)
                      .join(", ")
                  : "Ninguno"}
              </p>
              <p className="home text-sm text-base-content font-light">
                <span className="text-base-content/50">Estado inicial — </span>
                <span className="badge badge-warning badge-sm font-light">
                  Pendiente de aprobación
                </span>
              </p>
            </div>
          )}

          {/* Acciones */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-primary/50">
            <button
              type="button"
              className="btn btn-ghost btn-sm home font-normal"
              onClick={() =>
                setForm({
                  name: "",
                  coordinators: [],
                  new_collection_name: "",
                })
              }
              disabled={isPending}
            >
              Limpiar
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm home font-normal"
              disabled={isPending || !form.name}
            >
              {isPending ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                "Enviar a revisión"
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }
}
