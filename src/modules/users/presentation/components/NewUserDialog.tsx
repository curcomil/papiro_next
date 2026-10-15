"use client";

import { useState } from "react";
import type { RefObject } from "react";
import type { UserDraft } from "../../domain/user";
import { Dialog } from "./Dialog";
import {
  CollectionsField,
  FormActions,
  RoleField,
} from "./UserFormFields";
import { useUserActions } from "../use-user-actions";

interface Props {
  dialogRef: RefObject<HTMLDialogElement | null>;
  /** El padre lo incrementa para remontar y vaciar el formulario. */
  resetKey: number;
  onCreated: () => void;
}

const EMPTY_DRAFT: UserDraft = {
  name: "",
  email: "",
  role: "digitizer",
  assignedCollections: [],
  isActive: true,
};

export function NewUserDialog({ dialogRef, resetKey, onCreated }: Props) {
  const close = () => dialogRef.current?.close();

  return (
    <Dialog dialogRef={dialogRef}>
      <NewUserForm key={resetKey} onCreated={onCreated} onCancel={close} />
    </Dialog>
  );
}

function NewUserForm({
  onCreated,
  onCancel,
}: {
  onCreated: () => void;
  onCancel: () => void;
}) {
  const { createUser } = useUserActions();
  const [form, setForm] = useState<UserDraft>(EMPTY_DRAFT);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);
    const created = await createUser(form);
    setIsPending(false);
    if (created) onCreated();
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="pb-5 border-b border-base-300">
        <p className="login text-lg text-base-content leading-tight">
          Nuevo usuario
        </p>
        <p className="home text-xs text-base-content/40 font-light mt-0.5">
          El usuario recibirá un correo para registrar su contraseña.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <fieldset className="fieldset">
          <legend className="fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest">
            Nombre completo
          </legend>
          <input
            type="text"
            className="input w-full home font-light text-sm"
            placeholder="Nombre Apellido"
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            required
          />
        </fieldset>

        <fieldset className="fieldset">
          <legend className="fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest">
            Correo electrónico
          </legend>
          <input
            type="email"
            className="input w-full home font-light text-sm"
            placeholder="usuario@udlap.mx"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
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

        <FormActions
          isPending={isPending}
          submitLabel="Crear usuario"
          onCancel={onCancel}
        />
      </form>
    </div>
  );
}
