import { emailLooksValid } from "../domain/user";
import type { UserChanges, UserDraft } from "../domain/user";
import type {
  OperationResult,
  UserListResult,
  UserRepository,
} from "../domain/user-repository";

export interface UserUseCases {
  listUsers(): Promise<UserListResult>;
  createUser(draft: UserDraft): Promise<OperationResult>;
  updateUser(id: string, changes: UserChanges): Promise<OperationResult>;
  deleteUser(id: string): Promise<OperationResult>;
  resetUserCredentials(id: string): Promise<OperationResult>;
}

const INVALID: OperationResult = {
  success: false,
  message: "Usuario no identificado",
};

function validateDraft(draft: UserDraft): OperationResult | null {
  if (!draft.name.trim()) {
    return { success: false, message: "El nombre es obligatorio" };
  }
  if (!emailLooksValid(draft.email)) {
    return { success: false, message: "El correo electrónico no es válido" };
  }
  return null;
}

function validateChanges(changes: UserChanges): OperationResult | null {
  if (!changes.name.trim()) {
    return { success: false, message: "El nombre es obligatorio" };
  }
  return null;
}

export function createUserUseCases(repository: UserRepository): UserUseCases {
  return {
    listUsers: () => repository.list(),

    async createUser(draft) {
      const invalid = validateDraft(draft);
      if (invalid) return invalid;
      return repository.create({ ...draft, name: draft.name.trim() });
    },

    async updateUser(id, changes) {
      if (!id) return INVALID;
      const invalid = validateChanges(changes);
      if (invalid) return invalid;
      return repository.update(id, { ...changes, name: changes.name.trim() });
    },

    async deleteUser(id) {
      if (!id) return INVALID;
      return repository.remove(id);
    },

    async resetUserCredentials(id) {
      if (!id) return INVALID;
      return repository.resetCredentials(id);
    },
  };
}
