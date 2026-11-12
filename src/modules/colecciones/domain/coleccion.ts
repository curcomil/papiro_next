/** Una colección asignada al usuario, tal como la devuelve `getmycollections`. */
export interface Coleccion {
  internalId: string;
  nombre: string;
  setspec: string;
  /** `app.miniatura`: puede venir vacía. */
  miniatura: string;
}
