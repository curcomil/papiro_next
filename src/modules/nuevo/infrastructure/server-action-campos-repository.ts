import type { CamposRepository } from "../domain/campos-repository";
import { getCampos } from "./campos-api";

export function createCamposRepository(): CamposRepository {
  return {
    async list() {
      const response = await getCampos();
      return {
        success: response.success,
        message: response.message,
        campos: response.data,
      };
    },
  };
}
