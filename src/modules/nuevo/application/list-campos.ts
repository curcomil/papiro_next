import type {
  CamposListResult,
  CamposRepository,
} from "../domain/campos-repository";

export interface CamposUseCases {
  listCampos(): Promise<CamposListResult>;
}

export function createCamposUseCases(
  repository: CamposRepository,
): CamposUseCases {
  return {
    listCampos: () => repository.list(),
  };
}
