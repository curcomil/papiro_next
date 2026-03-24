"use client";

import { useState } from "react";
import type { User } from "../../services/users.types";
import type { FetchStatus } from "../page";
import { openModal, closeModal } from "../../utils/modal";
import Edit_user_form from "./edit_user_form";
import Create_user_form from "./new_user_form";
import { deleteUser } from "../../services/users";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

interface Props {
  users: User[];
  FetchStatus: FetchStatus;
}

function roles_map(rol: string): string {
  const map: Record<string, string> = {
    admin: "Administrador",
    digitizer: "Digitalizador/a",
    coordinator: "Coordinador/a",
    chief: "Jefatura",
  };

  return map[rol] || "";
}

export default function UsersTable({ users, FetchStatus }: Props) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const router = useRouter();

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    openModal("edit_user");
  };

  if (!FetchStatus.success) {
    return (
      <p className="home text-sm text-error">
        Error al cargar usuarios {FetchStatus.message}
      </p>
    );
  }

  const handle_delete = async (user_id: string) => {
    const confirm = await Swal.fire({
      title: "¿Deseas eliminar este usuario?",
      showDenyButton: true,
      confirmButtonText: "Eliminar",
      denyButtonText: "Cancelar",
      confirmButtonColor: "oklch(42% 0.09 330)",
    });

    if (!confirm.isConfirmed) return;

    const result = await deleteUser(user_id);

    if (result.success) {
      await Swal.fire({
        icon: "success",
        title: "Usuario eliminado",
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
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="home text-sm text-base-content/50 font-light">
          {users.length} usuarios registrados
        </p>
        <button
          onClick={() => openModal("create_user")}
          className="btn btn-primary btn-sm home font-normal"
        >
          + Nuevo usuario
        </button>
        <dialog id="create_user" className="modal">
          <div className="modal-box w-11/12 max-w-2xl">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <Create_user_form onClose={() => closeModal("create_user")} />
          </div>
        </dialog>
      </div>

      <div className="overflow-x-auto rounded-sm">
        <table className="table home font-light text-sm border border-primary/50">
          <thead>
            <tr className="border-base-300">
              {["Usuario", "Nombre", "Rol", "Colecciones", ""].map((h) => (
                <th
                  key={h}
                  className="home text-xs uppercase tracking-widest font-normal text-base-content/50"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {users.map((u) => (
              <tr
                key={u._id}
                className="border-base-300 hover:bg-base-200 transition-colors"
              >
                <td className="text-base-content font-normal">{u.username}</td>
                <td className="text-base-content/70">{u.name}</td>
                <td>
                  <span className="badge badge-md badge-soft badge-info">
                    {roles_map(u.role)}
                  </span>
                </td>
                <td className="text-base-content/50">
                  {u.assignedCollections.length > 0
                    ? u.assignedCollections.join(", ")
                    : "—"}
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(u)}
                    key={u._id}
                    className="btn btn-outline btn-primary btn-sm font-light"
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-error font-bold ml-3"
                    onClick={() => handle_delete(u._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Un solo modal fuera de la tabla */}
      <dialog id="edit_user" className="modal">
        <div className="modal-box w-11/12 max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          {selectedUser && (
            <Edit_user_form
              key={selectedUser._id}
              user={selectedUser}
              onClose={() => closeModal("edit_user")}
            />
          )}
        </div>
      </dialog>
    </div>
  );
}
