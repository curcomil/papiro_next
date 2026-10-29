import type { RegistroRepository } from "../domain/registro-repository";
import { crearItem, subirZip } from "./registro-api";

export function createRegistroRepository(): RegistroRepository {
  return {
    subirZip,
    crear: crearItem,
  };
}
