import type { ReactNode } from "react";

interface Props {
  titulo: string;
  descripcion?: string;
  children: ReactNode;
}

export function FormCard({ titulo, descripcion, children }: Props) {
  return (
    <div className="card w-full bg-base-100 card-md shadow-sm">
      <div className="card-body">
        <div className="pb-5 border-b border-primary/20">
          <h2 className="login text-2xl text-base-content">{titulo}</h2>
          {descripcion && (
            <p className="home text-xs text-base-content/40 font-light mt-0.5">
              {descripcion}
            </p>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
