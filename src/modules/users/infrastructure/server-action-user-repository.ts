import {
  createUser,
  deleteUser,
  getUsers,
  reset_credentials,
  updateUser,
} from "@/app/papiro/services/users";
import type { UserRepository } from "../domain/user-repository";

export function createUserRepository(): UserRepository {
  return {
    async list() {
      const response = await getUsers();
      return {
        success: response.success,
        message: response.message,
        users: response.data ?? [],
      };
    },

    create: (draft) => createUser(draft),

    update: (id, changes) => updateUser(id, changes),

    remove: (id) => deleteUser(id),

    resetCredentials: (id) => reset_credentials(id),
  };
}
