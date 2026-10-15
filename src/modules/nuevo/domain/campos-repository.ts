import type { CampoApi } from "./campo";

export interface CamposListResult {
  success: boolean;
  message: string;
  campos: CampoApi[];
}

export interface CamposRepository {
  list(): Promise<CamposListResult>;
}
