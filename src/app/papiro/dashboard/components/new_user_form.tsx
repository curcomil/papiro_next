"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import type { UserRole } from "../../services/users.types";
import { createUser } from "../../services/users";
import { useRouter } from "next/navigation";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Administrador" },
  { value: "digitizer", label: "Digitalizador" },
  { value: "coordinator", label: "Coordinadora" },
  { value: "chief", label: "Jefatura" },
];

const COLLECTIONS = ["AMC", "BF", "Periódicos", "Fototeca"];

interface Props {
  onClose?: () => void;
}

export const Create_user_form = ({ onClose }: Props) => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "digitizer" as UserRole,
    assignedCollections: [] as string[],
    isActive: true as boolean,
  });
  const [isPending, setIsPending] = useState(false);

  const toggleCollection = (col: string) => {
    setForm((prev) => ({
      ...prev,
      assignedCollections: prev.assignedCollections.includes(col)
        ? prev.assignedCollections.filter((c) => c !== col)
        : [...prev.assignedCollections, col],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onClose?.();
    setIsPending(true);

    const result = await createUser(form);

    if (result.success) {
      await Swal.fire({
        icon: "success",
        title: "Usuario creado",
        text: "Se le enviará un correo para que active su cuenta.",
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

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="pb-5 border-b border-base-300">
        <p className="login text-lg text-base-content leading-tight">
          Nuevo usuario
        </p>
        <p className="home text-xs text-base-content/40 font-light mt-0.5">
          El usuario recibirá un correo para registrar su contraseña.
        </p>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Nombre */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest">
            Nombre completo
          </legend>
          <input
            type="text"
            className="input w-full home font-light text-sm"
            placeholder="Nombre Apellido"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </fieldset>

        {/* Email */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest">
            Correo electrónico
          </legend>
          <input
            type="email"
            className="input w-full home font-light text-sm"
            placeholder="usuario@udlap.mx"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </fieldset>

        {/* Rol */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest">
            Rol
          </legend>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map((r) => (
              <label
                key={r.value}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-sm border cursor-pointer transition-colors
                  ${
                    form.role === r.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-base-300 text-base-content/60 hover:border-base-content/30"
                  }
                `}
              >
                <input
                  type="radio"
                  name="role"
                  className="radio radio-primary radio-sm"
                  value={r.value}
                  checked={form.role === r.value}
                  onChange={() => setForm({ ...form, role: r.value })}
                />
                <span className="home text-sm font-light">{r.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Colecciones */}
        <fieldset className="fieldset">
          <legend className="fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest">
            Colecciones asignadas
          </legend>
          <div className="flex flex-wrap gap-2 mt-1">
            {COLLECTIONS.map((col) => {
              const active = form.assignedCollections.includes(col);
              return (
                <button
                  key={col}
                  type="button"
                  onClick={() => toggleCollection(col)}
                  className={`
                    px-3 py-1.5 rounded-sm border home text-xs font-light transition-colors
                    ${
                      active
                        ? "bg-neutral text-neutral-content border-neutral"
                        : "border-base-300 text-base-content/50 hover:border-base-content/30"
                    }
                  `}
                >
                  {active && <span className="mr-1.5">✓</span>}
                  {col}
                </button>
              );
            })}
          </div>
          {form.assignedCollections.length === 0 && (
            <p className="home text-xs text-base-content/30 font-light mt-2">
              Sin colecciones asignadas
            </p>
          )}
        </fieldset>

        {/* Acciones */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-300">
          <button
            type="button"
            className="btn btn-ghost btn-sm home font-normal"
            onClick={onClose}
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="btn btn-primary btn-sm home font-normal"
            disabled={isPending}
          >
            {isPending ? (
              <span className="loading loading-spinner loading-xs" />
            ) : (
              "Crear usuario"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Create_user_form;
