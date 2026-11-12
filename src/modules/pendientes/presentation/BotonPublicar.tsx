"use client";

import Swal from "sweetalert2";

const CONFIRM_COLOR = "oklch(42% 0.09 330)";

interface Props {
  /** Se dispara solo si el usuario confirma en el diálogo. */
  onConfirmar?: () => void;
}

/** Publicar pide confirmación: es una acción que saca el registro del panel. */
export default function BotonPublicar({ onConfirmar }: Props) {
  const publicar = async () => {
    const { isConfirmed } = await Swal.fire({
      icon: "warning",
      title: "¿Estás segurx que deseas publicar este registro?",
      showCancelButton: true,
      confirmButtonText: "Publicar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: CONFIRM_COLOR,
    });

    if (isConfirmed) onConfirmar?.();
  };

  return (
    <button
      type="button"
      onClick={publicar}
      className="btn btn-primary btn-sm home h-9 w-full text-sm font-normal"
    >
      Publicar
    </button>
  );
}
