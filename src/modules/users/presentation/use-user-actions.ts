"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import type { UserChanges, UserDraft } from "../domain/user";
import { createUserUseCases } from "../application/user-use-cases";
import { createUserRepository } from "../infrastructure/server-action-user-repository";

const CONFIRM_COLOR = "oklch(42% 0.09 330)";

export interface UserActions {
  createUser(draft: UserDraft): Promise<boolean>;
  updateUser(id: string, changes: UserChanges): Promise<boolean>;
  deleteUser(id: string): Promise<boolean>;
  resetUserCredentials(id: string): Promise<boolean>;
}

export function useUserActions(): UserActions {
  const router = useRouter();
  const useCases = useMemo(() => createUserUseCases(createUserRepository()), []);

  return useMemo<UserActions>(() => {
    const error = (title: string, message: string) =>
      Swal.fire({
        icon: "error",
        title,
        text: message,
        confirmButtonColor: CONFIRM_COLOR,
      });

    const success = (title: string, text?: string) =>
      Swal.fire({
        icon: "success",
        title,
        ...(text ? { text } : {}),
        timer: text ? 2000 : 1200,
        showConfirmButton: false,
        timerProgressBar: true,
      });

    const confirm = (title: string, text?: string) =>
      Swal.fire({
        title,
        ...(text ? { text } : {}),
        showDenyButton: true,
        confirmButtonText: "Eliminar",
        denyButtonText: "Cancelar",
        confirmButtonColor: CONFIRM_COLOR,
      });

    return {
      async createUser(draft) {
        const result = await useCases.createUser(draft);
        if (!result.success) {
          await error("Error al crear usuario", result.message);
          return false;
        }
        await success(
          "Usuario creado",
          "Se le enviará un correo para que active su cuenta.",
        );
        router.refresh();
        return true;
      },

      async updateUser(id, changes) {
        const result = await useCases.updateUser(id, changes);
        if (!result.success) {
          await error("Error al actualizar", result.message);
          return false;
        }
        await success("Usuario actualizado");
        router.refresh();
        return true;
      },

      async deleteUser(id) {
        const answer = await confirm("¿Deseas eliminar este usuario?");
        if (!answer.isConfirmed) return false;

        const result = await useCases.deleteUser(id);
        if (!result.success) {
          await error("Error al eliminar", result.message);
          return false;
        }
        await success("Usuario eliminado");
        router.refresh();
        return true;
      },

      async resetUserCredentials(id) {
        const answer = await confirm(
          "¿Eliminar credenciales?",
          "El usuario tendrá que realizar el registro nuevamente",
        );
        if (!answer.isConfirmed) return false;

        const result = await useCases.resetUserCredentials(id);
        if (!result.success) {
          await error("Error al eliminar", result.message);
          return false;
        }
        await success("Credenciales eliminadas");
        router.refresh();
        return true;
      },
    };
  }, [useCases, router]);
}
