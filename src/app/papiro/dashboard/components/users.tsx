"use client";

import { useEffect, useState } from "react";
import type { User } from "../../services/users.types";
import type { FetchStatus } from "../page";

interface Props {
  users: User[];
  FetchStatus: FetchStatus;
}
export default function UsersTable({ users, FetchStatus }: Props) {
  if (!FetchStatus.success) {
    return (
      <p className="home text-sm text-error">
        Error al cargar usuarios {FetchStatus.message}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="home text-sm text-base-content/50 font-light">
          {users.length} usuarios registrados
        </p>
        <button className="btn btn-primary btn-sm home font-normal">
          + Nuevo usuario
        </button>
      </div>

      <div className="overflow-x-auto rounded-sm border border-base-300">
        <table className="table home font-light text-sm">
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
                <td className="text-base-content font-normal">@{u.username}</td>

                <td className="text-base-content/70">{u.name}</td>

                <td>
                  <span className="badge badge-sm font-light">{u.role}</span>
                </td>

                <td className="text-base-content/50">
                  {u.assignedCollections.length > 0
                    ? u.assignedCollections.join(", ")
                    : "—"}
                </td>

                <td>
                  <button className="btn btn-ghost btn-xs home font-light text-base-content/40">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
