"use client";

import type { ReactNode, RefObject } from "react";

interface Props {
  dialogRef: RefObject<HTMLDialogElement | null>;
  children: ReactNode;
}

export function Dialog({ dialogRef, children }: Props) {
  return (
    <dialog ref={dialogRef} className="modal">
      <div className="modal-box w-11/12 max-w-2xl">
        <form method="dialog">
          <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
            ✕
          </button>
        </form>
        {children}
      </div>
    </dialog>
  );
}
