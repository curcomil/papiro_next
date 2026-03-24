"use client";

import { useState } from "react";
import Swal from "sweetalert2";
import type { User, UserRole } from "../../services/users.types";
import { updateUser, reset_credentials } from "../../services/users";
import { useRouter } from "next/navigation";

const ROLES: { value: UserRole; label: string }[] = [
  { value: "admin", label: "Administrador" },
  { value: "digitizer", label: "Digitalizador" },
  { value: "coordinator", label: "Coordinadora" },
  { value: "chief", label: "Jefatura" },
];

const COLLECTIONS = ["AMC", "BF", "Periódicos", "Fototeca"];

const roleBadgeClass: Record<UserRole, string> = {
  admin: "badge-neutral",
  digitizer: "badge-info",
  coordinator: "badge-warning",
  chief: "badge-success",
};

interface Props {
  user: User;
  onClose?: () => void;
}

export const Edit_user_form = ({ user, onClose }: Props) => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: user.name,
    role: user.role,
    assignedCollections: user.assignedCollections,
    isActive: user.isActive,
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

    const result = await updateUser(user._id, form);

    if (result.success) {
      await Swal.fire({
        icon: "success",
        title: "Usuario actualizado",
        timer: 1200,
        showConfirmButton: false,
        timerProgressBar: true,
      });
      router.refresh();
      // Notifica al padre con los datos actualizados para reflejar en tabla
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: result.message,
        confirmButtonColor: "oklch(42% 0.09 330)",
      });
    }

    setIsPending(false);
  };

  const handle_reset_credentials = async (id_user: string) => {
    onClose?.();
    const confirm = await Swal.fire({
      title: "¿Eliminar credenciales?",
      text: "El usuario tendrá que realizar el registro nuevamente",
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: "Cancelar",
      confirmButtonColor: "oklch(42% 0.09 330)",
    });

    if (!confirm.isConfirmed) return;

    const result = await reset_credentials(id_user);

    if (result.success) {
      await Swal.fire({
        icon: "success",
        title: "Credenciales eliminadas",
        timer: 1200,
        showConfirmButton: false,
        timerProgressBar: true,
      });

      router.refresh();
    } else {
      Swal.fire({
        icon: "error",
        title: "Error al eliminar",
        text: result.message,
        confirmButtonColor: "oklch(42% 0.09 330)",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-3">
      {/* Header del usuario */}
      <div className="flex items-center gap-4 pb-5 border-b border-primary/50">
        <div className="size-12 rounded-sm bg-primary flex items-center justify-center text-primary-content login text-xl shrink-0">
          {user.name.charAt(0)}
        </div>
        <div className="w-full flex justify-between">
          <div>
            <p className="login text-lg text-base-content leading-tight">
              @{user.username}
            </p>
            <p className="home text-xs text-base-content/40 font-light">
              {user.email}
            </p>
            <span
              className={`badge badge-md mt-1 font-light ${roleBadgeClass[user.role]}`}
            >
              {ROLES.find((r) => r.value === user.role)?.label}
            </span>
          </div>
          <div>
            <button
              className="btn btn-warning btn-sm mt-3"
              onClick={() => handle_reset_credentials(user._id)}
            >
              Reiniciar credenciales de acceso
            </button>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <fieldset className="fieldset">
          <legend className="fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest">
            Nombre completo
          </legend>
          <input
            type="text"
            className="input w-full home font-light text-sm"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </fieldset>

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
                      : "border-base-content/50 text-base-content/60 hover:border-primary/50"
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
                        ? "bg-primary/70 text-primary-content"
                        : "border-primary/50 text-base-content/50 hover:border-primary"
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

        <fieldset className="fieldset">
          <legend className="fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest">
            Estado de la cuenta
          </legend>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-sm"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
            />
            <span
              className={`home text-sm font-light ${form.isActive ? "text-success" : "text-error"}`}
            >
              {form.isActive ? "Usuario activo" : "Usuario desactivado"}
            </span>
          </label>
        </fieldset>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-primary/50">
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
              "Guardar cambios"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Edit_user_form;
