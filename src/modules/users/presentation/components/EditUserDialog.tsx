"use client";

import { useState } from "react";
import type { RefObject } from "react";
import type { User, UserChanges } from "../../domain/user";
import {
  roleBadgeClass,
  roleLabel,
  userInitials,
} from "../../domain/user";
import { Dialog } from "./Dialog";
import {
  CollectionsField,
  FormActions,
  RoleField,
} from "./UserFormFields";
import { useUserActions } from "../use-user-actions";

interface Props {
  dialogRef: RefObject<HTMLDialogElement | null>;
  /** `null` deja el modal montado pero vacío, para poder abrirlo con `showModal`. */
  user: User | null;
}

export function EditUserDialog({ dialogRef, user }: Props) {
  const close = () => dialogRef.current?.close();

  return (
    <Dialog dialogRef={dialogRef}>
      {user && <EditUserForm key={user._id} user={user} onCancel={close} />}
    </Dialog>
  );
}

function EditUserForm({
  user,
  onCancel,
}: {
  user: User;
  onCancel: () => void;
}) {
  const { updateUser, resetUserCredentials } = useUserActions();
  const [form, setForm] = useState<UserChanges>({
    name: user.name,
    role: user.role,
    assignedCollections: user.assignedCollections,
    isActive: user.isActive,
  });
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    const updated = await updateUser(user._id, form);
    setIsPending(false);
    if (updated) onCancel();
  };

  const handleResetCredentials = async () => {
    const reset = await resetUserCredentials(user._id);
    if (reset) onCancel();
  };

  return (
    <div className="flex flex-col gap-6 mt-3">
      <div className="flex items-center gap-4 pb-5 border-b border-primary/50">
        <div className="size-12 rounded-sm bg-primary flex items-center justify-center text-primary-content login text-xl shrink-0">
          {userInitials(user.name)}
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
              className={`badge badge-md mt-1 font-light ${roleBadgeClass(user.role)}`}
            >
              {roleLabel(user.role)}
            </span>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-warning btn-sm mt-3"
              onClick={handleResetCredentials}
            >
              Reiniciar credenciales de acceso
            </button>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <fieldset className="fieldset">
          <legend className="fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest">
            Nombre completo
          </legend>
          <input
            type="text"
            className="input w-full home font-light text-sm"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
        </fieldset>

        <RoleField
          role={form.role}
          onChange={(role) => setForm({ ...form, role })}
        />

        <CollectionsField
          value={form.assignedCollections}
          onChange={(assignedCollections) =>
            setForm({ ...form, assignedCollections })
          }
        />

        <fieldset className="fieldset">
          <legend className="fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest">
            Estado de la cuenta
          </legend>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="toggle toggle-primary toggle-sm"
              checked={form.isActive}
              onChange={(event) =>
                setForm({ ...form, isActive: event.target.checked })
              }
            />
            <span
              className={`home text-sm font-light ${form.isActive ? "text-success" : "text-error"}`}
            >
              {form.isActive ? "Usuario activo" : "Usuario desactivado"}
            </span>
          </label>
        </fieldset>

        <FormActions
          isPending={isPending}
          submitLabel="Guardar cambios"
          onCancel={onCancel}
        />
      </form>
    </div>
  );
}
