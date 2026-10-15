// La entidad User y sus roles viven en el dominio del módulo de usuarios.
import type { User, UserRole } from "@/modules/users/domain/user";

export type { User, UserRole };

export interface UsersResponse {
  success: boolean;
  message: string;
  data: User[];
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
}

export interface Coordinators {
  _id: string;
  name: string;
  email: string;
  username: string;
}

export interface CoordinatorsResponse {
  success: boolean;
  message: string;
  data: Coordinators[];
}
