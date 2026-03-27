// services/users.types.ts — sin directiva, solo tipos
export type UserRole = "digitizer" | "coordinator" | "chief" | "admin";

export interface User {
  _id: string;
  name: string;
  email: string;
  username: string;
  password: boolean;
  role: UserRole;
  assignedCollections: string[];
  accessibleRoles: UserRole[];
  isActive: boolean;
}

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
