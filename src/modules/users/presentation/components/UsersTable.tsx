"use client";

import type { User } from "../../domain/user";
import { roleBadgeClass, roleLabel } from "../../domain/user";

interface Props {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const COLUMNS = ["Usuario", "Nombre", "Rol", "Colecciones", ""];

export function UsersTable({ users, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto rounded-sm">
      <table className="table home font-light text-sm border border-primary/50">
        <thead>
          <tr className="border-base-300">
            {COLUMNS.map((column) => (
              <th
                key={column}
                className="home text-xs uppercase tracking-widest font-normal text-base-content/50"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              className="border-base-300 hover:bg-base-200 transition-colors"
            >
              <td className="text-base-content font-normal">{user.username}</td>
              <td className="text-base-content/70">{user.name}</td>
              <td>
                <span
                  className={`badge badge-md badge-soft ${roleBadgeClass(user.role)}`}
                >
                  {roleLabel(user.role)}
                </span>
              </td>
              <td className="text-base-content/50">
                {user.assignedCollections.length > 0
                  ? user.assignedCollections.join(", ")
                  : "—"}
              </td>
              <td>
                <button
                  onClick={() => onEdit(user)}
                  className="btn btn-outline btn-primary btn-sm font-light"
                >
                  Editar
                </button>
                <button
                  className="btn btn-sm btn-soft btn-error font-light ml-3"
                  onClick={() => onDelete(user._id)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
