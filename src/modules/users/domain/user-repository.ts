import type { User, UserChanges, UserDraft } from "./user";

export interface OperationResult {
  success: boolean;
  message: string;
}

export interface UserListResult extends OperationResult {
  users: User[];
}

export interface LoadStatus {
  success: boolean;
  message: string;
}

export interface UserRepository {
  list(): Promise<UserListResult>;
  create(draft: UserDraft): Promise<OperationResult>;
  update(id: string, changes: UserChanges): Promise<OperationResult>;
  remove(id: string): Promise<OperationResult>;
  resetCredentials(id: string): Promise<OperationResult>;
}
