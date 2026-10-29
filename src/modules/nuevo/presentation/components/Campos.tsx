import type { ReactNode } from "react";

interface EtiquetaProps {
  children: ReactNode;
  /** Añade el asterisco de campo obligatorio. */
  required?: boolean;
}

export function Etiqueta({ children, required }: EtiquetaProps) {
  return (
    <span className="home text-xs font-normal text-base-content/50 uppercase tracking-widest">
      {children}
      {required && (
        <span className="text-error" aria-hidden="true">
          {" *"}
        </span>
      )}
    </span>
  );
}

interface CampoTextoProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
}

export function CampoTexto({
  label,
  value,
  onChange,
  placeholder,
  required,
  disabled,
}: CampoTextoProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <Etiqueta required={required}>{label}</Etiqueta>
      <input
        type="text"
        className="input w-full home font-light text-sm disabled:cursor-not-allowed disabled:bg-base-200 disabled:opacity-50"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        disabled={disabled}
      />
    </label>
  );
}

interface CampoReferenciaProps {
  label: string;
  value: string;
}

/** Valor de solo lectura, alineado a la altura de un input pero sin ser editable. */
export function CampoReferencia({ label, value }: CampoReferenciaProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <Etiqueta>{label}</Etiqueta>
      <div className="flex h-10 min-w-0 items-center rounded-sm border border-primary/20 bg-base-200 px-3">
        <code className="truncate font-mono text-sm text-base-content/70">
          {value}
        </code>
      </div>
    </div>
  );
}

export interface OpcionSelect {
  value: string;
  label: string;
}

interface CampoTextareaProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  disabled?: boolean;
}

export function CampoTextarea({
  label,
  value,
  onChange,
  placeholder,
  required,
  rows = 3,
  disabled,
}: CampoTextareaProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <Etiqueta required={required}>{label}</Etiqueta>
      <textarea
        className="textarea w-full home font-light text-sm disabled:cursor-not-allowed disabled:bg-base-200 disabled:opacity-50"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        rows={rows}
        disabled={disabled}
      />
    </label>
  );
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
  disabled?: boolean;
}

export function CampoSelect({
  label,
  value,
  onChange,
  opciones = [],
  placeholder,
  disabled,
}: CampoSelectProps) {
  return (
    <label className="flex flex-col gap-1.5">
      <Etiqueta>{label}</Etiqueta>
      <select
        className="select w-full home font-light text-sm disabled:cursor-not-allowed disabled:bg-base-200 disabled:opacity-50"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
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

interface CampoCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/** Casilla cuadrada para opciones que se leen como una lista de selección. */
export function CampoCheckbox({
  label,
  checked,
  onChange,
}: CampoCheckboxProps) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        className="checkbox checkbox-primary checkbox-sm"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="home text-sm font-light text-base-content/80">
        {label}
      </span>
    </label>
  );
}
