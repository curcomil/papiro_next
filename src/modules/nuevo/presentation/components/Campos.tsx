import type { ReactNode } from "react";

function Etiqueta({ children }: { children: ReactNode }) {
  return (
    <span className="home text-xs font-normal text-base-content/50 uppercase tracking-widest">
      {children}
    </span>
  );
}

interface CampoTextoProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}

export function CampoTexto({
  label,
  value,
  onChange,
  placeholder,
  required,
}: CampoTextoProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <Etiqueta>{label}</Etiqueta>
      <input
        type="text"
        className="input w-full home font-light text-sm"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        required={required}
      />
    </label>
  );
}

export interface OpcionSelect {
  value: string;
  label: string;
}

interface CampoSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  opciones?: readonly OpcionSelect[];
  /**
   * Opción vacía inicial. Omítelo cuando el valor siempre venga resuelto
   * (como Dublin Core, que arranca con la etiqueta del campo).
   */
  placeholder?: string;
}

export function CampoSelect({
  label,
  value,
  onChange,
  opciones = [],
  placeholder,
}: CampoSelectProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <Etiqueta>{label}</Etiqueta>
      <select
        className="select w-full home font-light text-sm"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {opciones.map((opcion) => (
          <option key={opcion.value} value={opcion.value}>
            {opcion.label}
          </option>
        ))}
      </select>
    </label>
  );
}

interface CampoBooleanoProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CampoBooleano({
  label,
  checked,
  onChange,
}: CampoBooleanoProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className="toggle toggle-primary toggle-sm"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <Etiqueta>{label}</Etiqueta>
    </label>
  );
}
