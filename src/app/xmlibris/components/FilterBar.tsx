import { useRef } from "react";

type Filtro = { label: string; value: string };

type FilterBarProps = {
  filtroActivo: string;
  filtros: Filtro[];
  nombreDefault: string;
  filterFormRef: React.RefObject<HTMLFormElement>;
  onFiltroChange: (value: string) => void;
  onReset: () => void;
};

export function FilterBar({
  filtroActivo,
  filtros,
  nombreDefault,
  filterFormRef,
  onFiltroChange,
  onReset,
}: FilterBarProps) {
  return (
    <div className="flex-none mb-2">
      <p className="text-xs font-semibold text-base-content/50 uppercase tracking-wider mb-1">
        Filtrar por
      </p>
      <form
        ref={filterFormRef}
        className="filter"
        onSubmit={(e) => e.preventDefault()}
      >
        <div
          className={`btn btn-xs 2xl:btn-sm btn-primary ${filtroActivo && "hidden"}`}
        >
          {nombreDefault}
        </div>
        <input
          className="btn btn-xs 2xl:btn-sm btn-square btn-outline btn-primary"
          type="reset"
          value="×"
          title="Limpiar filtro"
          onClick={() => {
            onReset();
            filterFormRef.current?.reset();
          }}
        />
        {filtros.map((f) => (
          <input
            key={f.value}
            type="radio"
            name="filtro"
            value={f.value}
            aria-label={f.label}
            onClick={() => onFiltroChange(f.value)}
            className={`btn btn-xs 2xl:btn-sm btn-primary ${
              filtroActivo === f.value ? "" : "btn-outline"
            }`}
          />
        ))}
      </form>
    </div>
  );
}
