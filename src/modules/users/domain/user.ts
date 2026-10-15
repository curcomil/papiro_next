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

export interface UserDraft {
  name: string;
  email: string;
  role: UserRole;
  assignedCollections: string[];
  isActive: boolean;
}

export interface UserChanges {
  name: string;
  role: UserRole;
  assignedCollections: string[];
  isActive: boolean;
}

export interface RoleOption {
  value: UserRole;
  label: string;
}

export const USER_ROLES: readonly RoleOption[] = [
  { value: "admin", label: "Administrador" },
  { value: "digitizer", label: "Digitalizador" },
  { value: "coordinator", label: "Coordinadora" },
  { value: "chief", label: "Jefatura" },
];

const ROLE_LABELS: Record<UserRole, string> = {
  admin: "Administrador",
  digitizer: "Digitalizador/a",
  coordinator: "Coordinador/a",
  chief: "Jefatura",
};

const ROLE_BADGE_CLASS: Record<UserRole, string> = {
  admin: "badge-primary",
  chief: "badge-secondary",
  coordinator: "badge-warning",
  digitizer: "badge-info",
};

export const AVAILABLE_COLLECTIONS: readonly string[] = [
  "AMC",
  "BF",
  "Periódicos",
  "Fototeca",
];

export function roleLabel(role: UserRole): string {
  return ROLE_LABELS[role] ?? role;
}

export function roleBadgeClass(role: UserRole): string {
  return ROLE_BADGE_CLASS[role] ?? "badge-info";
}

export function userInitials(name: string): string {
  return (name?.trim().charAt(0) || "?").toUpperCase();
}

export function emailLooksValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function toggleInList(list: string[], value: string): string[] {
  return list.includes(value)
    ? list.filter((item) => item !== value)
    : [...list, value];
}
