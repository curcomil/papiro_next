"use client";

import { useRef, useState } from "react";
import type { User } from "../domain/user";
import type { LoadStatus } from "../domain/user-repository";
import { UsersTable } from "./components/UsersTable";
import { NewUserDialog } from "./components/NewUserDialog";
import { EditUserDialog } from "./components/EditUserDialog";
import { useUserActions } from "./use-user-actions";

interface Props {
  users: User[];
  status: LoadStatus;
}

export default function UsersPanel({ users, status }: Props) {
  const { deleteUser } = useUserActions();
  const createDialogRef = useRef<HTMLDialogElement>(null);
  const editDialogRef = useRef<HTMLDialogElement>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [createResetKey, setCreateResetKey] = useState(0);

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    editDialogRef.current?.showModal();
  };

  if (!status.success) {
    return (
      <p className="home text-sm text-error">
        Error al cargar usuarios {status.message}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="home text-sm text-base-content/50 font-light">
          {users.length} usuarios registrados
        </p>
        <button
          onClick={() => createDialogRef.current?.showModal()}
          className="btn btn-primary btn-sm home font-normal"
        >
          + Nuevo usuario
        </button>
      </div>

      <UsersTable users={users} onEdit={handleEdit} onDelete={deleteUser} />

      <NewUserDialog
        dialogRef={createDialogRef}
        resetKey={createResetKey}
        onCreated={() => {
          setCreateResetKey((key) => key + 1);
          createDialogRef.current?.close();
        }}
      />

      <EditUserDialog dialogRef={editDialogRef} user={selectedUser} />
    </div>
  );
}
