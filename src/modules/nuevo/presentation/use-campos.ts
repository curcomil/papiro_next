"use client";

import { useEffect, useMemo, useState } from "react";
import type { CampoApi } from "../domain/campo";
import { createCamposUseCases } from "../application/list-campos";
import { createCamposRepository } from "../infrastructure/server-action-campos-repository";

export interface UseCamposResult {
  campos: CampoApi[];
  cargando: boolean;
  error: string;
}

export function useCampos(): UseCamposResult {
  const useCases = useMemo(
    () => createCamposUseCases(createCamposRepository()),
    [],
  );
  const [campos, setCampos] = useState<CampoApi[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let vigente = true;

    useCases.listCampos().then((result) => {
      if (!vigente) return;
      setCampos(result.campos);
      setError(result.success ? "" : result.message);
      setCargando(false);
    });

    return () => {
      vigente = false;
    };
  }, [useCases]);

  return { campos, cargando, error };
}
