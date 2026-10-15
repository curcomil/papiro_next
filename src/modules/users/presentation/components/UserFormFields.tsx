"use client";

import type { UserRole } from "../../domain/user";
import { AVAILABLE_COLLECTIONS, USER_ROLES, toggleInList } from "../../domain/user";

export function RoleField({
  role,
  onChange,
}: {
  role: UserRole;
  onChange: (role: UserRole) => void;
}) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest">
        Rol
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {USER_ROLES.map((option) => (
          <label
            key={option.value}
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-sm border cursor-pointer transition-colors
              ${
                role === option.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-base-300 text-base-content/60 hover:border-base-content/30"
              }
            `}
          >
            <input
              type="radio"
              name="role"
              className="radio radio-primary radio-sm"
              value={option.value}
              checked={role === option.value}
              onChange={() => onChange(option.value)}
            />
            <span className="home text-sm font-light">{option.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CollectionsField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (collections: string[]) => void;
}) {
  return (
    <fieldset className="fieldset">
      <legend className="fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest">
        Colecciones asignadas
      </legend>
      <div className="flex flex-wrap gap-2 mt-1">
        {AVAILABLE_COLLECTIONS.map((collection) => {
          const active = value.includes(collection);
          return (
            <button
              key={collection}
              type="button"
              onClick={() => onChange(toggleInList(value, collection))}
              className={`
                px-3 py-1.5 rounded-sm border home text-xs font-light transition-colors
                ${
                  active
                    ? "bg-neutral text-neutral-content border-neutral"
                    : "border-base-300 text-base-content/50 hover:border-base-content/30"
                }
              `}
            >
              {active && <span className="mr-1.5">✓</span>}
              {collection}
            </button>
          );
        })}
      </div>
      {value.length === 0 && (
        <p className="home text-xs text-base-content/30 font-light mt-2">
          Sin colecciones asignadas
        </p>
      )}
    </fieldset>
  );
}

export function FormActions({
  isPending,
  submitLabel,
  onCancel,
}: {
  isPending: boolean;
  submitLabel: string;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-300">
      <button
        type="button"
        className="btn btn-ghost btn-sm home font-normal"
        onClick={onCancel}
        disabled={isPending}
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="btn btn-primary btn-sm home font-normal"
        disabled={isPending}
      >
        {isPending ? (
          <span className="loading loading-spinner loading-xs" />
        ) : (
          submitLabel
        )}
      </button>
    </div>
  );
}
