"use client";

import { useRef, useState } from "react";
import Swal from "sweetalert2";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  rectSortingStrategy,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import VolverPendientes from "@/modules/pendientes/presentation/VolverPendientes";
import {
  esImagen,
  esPdf,
  nuevoIdSeccion,
  seccionesDe,
  type PaginaItem,
  type SeccionItem,
} from "../domain/contenido-item";
import { seccionesParaGuardar } from "../domain/actualizar-item";
import type { Item } from "../domain/item";
import { nombrePortada } from "../domain/metadata-item";
import { rutaArchivo } from "../infrastructure/item-file-url";
import FilaSeccion from "./FilaSeccion";
import TarjetaPagina from "./TarjetaPagina";
import { AVISO_SUSTITUIR } from "./textos";
import { useActualizarContenido } from "./use-actualizar-contenido";
import { useActualizarItem } from "./use-actualizar-item";

const CONFIRM_COLOR = "oklch(42% 0.09 330)";

/** Rearma el `number` de las páginas de una sección: 1..n, en su orden actual. */
function renumerar(pages: PaginaItem[]): PaginaItem[] {
  return pages.map((pagina, indice) => ({ ...pagina, number: indice + 1 }));
}

const ICONO_MAS = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="size-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 4.5v15m7.5-7.5h-15"
    />
  </svg>
);

const ICONO_LAPIZ = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="size-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
    />
  </svg>
);

const ICONO_PAPELERA = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="size-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.2v.916m7.5 0a48.667 48.667 0 00-7.5 0"
    />
  </svg>
);

const ICONO_AYUDA = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="size-5"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
    />
  </svg>
);

const ICONO_INFO = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="size-4 shrink-0"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
    />
  </svg>
);

interface Props {
  item: Item;
}

export default function LibroPanel({ item }: Props) {
  // Copia en memoria: la edición trabaja sobre este estado, no sobre el item.
  const [secciones, setSecciones] = useState(() => seccionesDe(item.content));
  const [metadata, setMetadata] = useState<Record<string, unknown>>(
    () => item.metadata,
  );
  const [seccionActiva, setSeccionActiva] = useState(0);
  const [paginaAbierta, setPaginaAbierta] = useState<PaginaItem | null>(null);
  const [editandoLabel, setEditandoLabel] = useState(false);
  const [modalNueva, setModalNueva] = useState(false);
  const [nombreNueva, setNombreNueva] = useState("");
  const [modalAyuda, setModalAyuda] = useState(false);
  /** Claves por `file_name`: el nombre es único dentro de un item. */
  const [seleccionadas, setSeleccionadas] = useState<Set<string>>(
    () => new Set(),
  );
  const [modalMover, setModalMover] = useState(false);
  const [destino, setDestino] = useState("");

  const seccion = secciones[seccionActiva];
  const portada = nombrePortada(metadata).toLowerCase();

  const { guardar, enviando } = useActualizarItem();
  const { guardarContenido, guardando } = useActualizarContenido();
  const ocupado = enviando || guardando;
  /** Portada con la que llegó el item: solo se guarda si cambia respecto a esta. */
  const portadaOriginal = useRef(nombrePortada(item.metadata));

  // 8 px de recorrido antes de arrastrar: así un clic en la miniatura abre el
  // modal en vez de convertirse en un arrastre involuntario.
  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  /** Portada registrada, buscada en todas las secciones. */
  const paginaPortada = portada
    ? secciones
        .flatMap((actual) => actual.pages)
        .find((pagina) => pagina.file_name.toLowerCase() === portada)
    : undefined;

  /**
   * Cambiar de sección invalida la selección: no se pueden mover páginas de
   * secciones distintas a la vez.
   */
  const irASeccion = (indice: number) => {
    setSeccionActiva(indice);
    setEditandoLabel(false);
    setSeleccionadas(new Set());
  };

  /** Nueva sección sin páginas: se llena moviendo archivos desde otra. */
  const agregarSeccion = () => {
    const label = nombreNueva.trim();
    if (!label) return;

    const numero =
      secciones.reduce((mayor, actual) => Math.max(mayor, actual.number ?? 0), 0) +
      1;

    setSecciones((prev) => [
      ...prev,
      { id: nuevoIdSeccion(), label, number: numero, pages: [] },
    ]);
    irASeccion(secciones.length);
    setNombreNueva("");
    setModalNueva(false);
  };

  const renombrarSeccion = (label: string) => {
    setSecciones((prev) =>
      prev.map((actual, indice) =>
        indice === seccionActiva ? { ...actual, label } : actual,
      ),
    );
  };

  /**
   * Una sección con páginas se rechaza: sacarlas del estado las volvería
   * huérfanas, porque `updatecontent` exige que toda página viva en una sección.
   */
  const eliminarSeccion = async () => {
    if (!seccion) return;

    if (seccion.pages.length > 0) {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Una sección con páginas no puede ser eliminada",
        confirmButtonColor: CONFIRM_COLOR,
      });
      return;
    }

    const restantes = secciones.filter(
      (_, indice) => indice !== seccionActiva,
    );

    setSecciones(restantes);
    irASeccion(Math.max(0, Math.min(seccionActiva, restantes.length - 1)));
  };

  const alternarPagina = (archivo: string) => {
    setSeleccionadas((prev) => {
      const siguiente = new Set(prev);
      if (siguiente.has(archivo)) siguiente.delete(archivo);
      else siguiente.add(archivo);
      return siguiente;
    });
  };

  /** Marca todas las páginas de la sección; si ya estaban, las desmarca. */
  const seleccionarTodas = (seccionActual: SeccionItem) => {
    const nombres = seccionActual.pages.map((pagina) => pagina.file_name);

    setSeleccionadas((prev) => {
      const siguiente = new Set(prev);
      const todas = nombres.every((nombre) => siguiente.has(nombre));

      for (const nombre of nombres) {
        if (todas) siguiente.delete(nombre);
        else siguiente.add(nombre);
      }

      return siguiente;
    });
  };

  /** Lleva las páginas marcadas a la sección elegida y vacía la selección. */
  const moverSeleccion = () => {
    const indiceDestino = Number(destino);
    if (!Number.isInteger(indiceDestino) || !secciones[indiceDestino]) return;

    const movidas: PaginaItem[] = [];

    const siguientes = secciones.map((actual) => {
      const quedan = actual.pages.filter((pagina) => {
        if (!seleccionadas.has(pagina.file_name)) return true;
        movidas.push(pagina);
        return false;
      });

      return quedan.length === actual.pages.length
        ? actual
        : { ...actual, pages: renumerar(quedan) };
    });

    if (movidas.length > 0) {
      const destinoSeccion = siguientes[indiceDestino];
      siguientes[indiceDestino] = {
        ...destinoSeccion,
        pages: renumerar([...destinoSeccion.pages, ...movidas]),
      };

      setSecciones(siguientes);
      irASeccion(indiceDestino);
    }

    setSeleccionadas(new Set());
    setDestino("");
    setModalMover(false);
  };

  /** Reordena dentro de la sección activa; el `number` se rearma al vuelo. */
  const reordenar = ({ active, over }: DragEndEvent) => {    if (!over || active.id === over.id || !seccion) return;

    const desde = seccion.pages.findIndex(
      (pagina) => pagina.file_name === String(active.id),
    );
    const hasta = seccion.pages.findIndex(
      (pagina) => pagina.file_name === String(over.id),
    );

    if (desde === -1 || hasta === -1) return;

    setSecciones((prev) =>
      prev.map((actual, indice) =>
        indice === seccionActiva
          ? {
              ...actual,
              pages: renumerar(arrayMove(actual.pages, desde, hasta)),
            }
          : actual,
      ),
    );
  };

  /** Reordena las secciones y renumera su `number`; la activa sigue siéndolo. */
  const reordenarSecciones = ({ active, over }: DragEndEvent) => {
    if (!over || active.id === over.id) return;

    const desde = secciones.findIndex(
      (actual) => actual.id === String(active.id),
    );
    const hasta = secciones.findIndex((actual) => actual.id === String(over.id));

    if (desde === -1 || hasta === -1) return;

    const activa = secciones[seccionActiva];
    const siguientes = arrayMove(secciones, desde, hasta).map(
      (actual, indice) => ({ ...actual, number: indice + 1 }),
    );

    setSecciones(siguientes);

    if (activa) {
      setSeccionActiva(
        Math.max(
          0,
          siguientes.findIndex((actual) => actual.id === activa.id),
        ),
      );
    }
  };

  /** Cambia la portada solo en memoria; el PUT sale al guardar. */
  const establecerPortada = (pagina: PaginaItem) => {
    setMetadata((prev) => ({ ...prev, portada: pagina.file_name }));
    setPaginaAbierta(null);
  };

  /**
   * El PUT de metadata va SIEMPRE antes del de content: si el item no está
   * pendiente, guardar las secciones renombra los archivos y reescribe
   * `metadata.portada`, así que invertir el orden dejaría la portada apuntando
   * a un nombre viejo. Devuelve `false` si falló, para no seguir con el
   * contenido.
   */
  const guardarPortada = async (): Promise<boolean> => {
    const nuevaPortada = nombrePortada(metadata);
    if (nuevaPortada === portadaOriginal.current) return true;

    const ok = await guardar({
      coleccionInternalId: item.coleccion.internalId,
      internalId: item.internalId,
      metadata: { portada: nuevaPortada },
    });

    if (ok) portadaOriginal.current = nuevaPortada;
    return ok;
  };

  const handleGuardar = async () => {
    if (ocupado) return;

    // 1. metadata.portada
    if (!(await guardarPortada())) return;

    // 2. content: secciones y páginas
    const ok = await guardarContenido({
      coleccionInternalId: item.coleccion.internalId,
      internalId: item.internalId,
      sections: seccionesParaGuardar(secciones),
    });

    if (!ok) return;

    // Refleja lo que quedó guardado: sin secciones vacías y con la numeración
    // definitiva, que es la que el backend persistió.
    const activa = secciones[seccionActiva];
    const guardadas = secciones
      .filter((actual) => actual.pages.length > 0)
      .map((actual, indice) => ({
        ...actual,
        number: indice + 1,
        pages: actual.pages.map((pagina, posicion) => ({
          ...pagina,
          number: posicion + 1,
        })),
      }));

    setSecciones(guardadas);

    const indiceActiva = guardadas.findIndex(
      (actual) => actual.id === activa?.id,
    );
    setSeccionActiva(indiceActiva === -1 ? 0 : indiceActiva);
  };

  return (
    <div className="flex h-screen w-full flex-col overflow-hidden">
      <header className="flex shrink-0 flex-wrap items-center gap-4 border-b border-primary/20 px-6 pt-6 pb-4 lg:px-10">
        <VolverPendientes className="shrink-0" />
        <div role="alert" className="alert alert-soft alert-info min-w-0">
          {ICONO_INFO}
          <p className="home text-sm font-light">{AVISO_SUSTITUIR}</p>
        </div>

        <button
          type="button"
          onClick={() => setModalAyuda(true)}
          aria-label="Ayuda"
          title="Ayuda"
          className="btn btn-ghost btn-sm home ml-auto shrink-0 gap-2 font-normal"
        >
          {ICONO_AYUDA}
          Ayuda
        </button>
      </header>

      {/* En móvil scrollea el grid completo; en lg cada columna lo hace sola. */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-8 overflow-y-auto px-6 py-6 lg:grid-cols-4 lg:overflow-hidden lg:px-10">
        {/* ── Secciones ── */}
        <aside className="flex flex-col gap-4 lg:col-span-1 lg:min-h-0 lg:overflow-y-auto lg:border-r lg:border-primary/20 lg:pr-6">
          <h1 className="login text-2xl text-base-content">Secciones</h1>

          <DndContext
            sensors={sensores}
            collisionDetection={closestCenter}
            onDragEnd={reordenarSecciones}
          >
            <SortableContext
              items={secciones.map((actual) => actual.id)}
              strategy={verticalListSortingStrategy}
            >
              <nav className="-mx-2 flex flex-col">
                {secciones.map((seccionItem, indice) => (
                  <FilaSeccion
                    key={seccionItem.id}
                    seccion={seccionItem}
                    activa={indice === seccionActiva}
                    onSeleccionar={() => irASeccion(indice)}
                  />
                ))}

                {secciones.length === 0 && (
                  <p className="home px-2 py-2 text-sm font-light text-base-content/50">
                    Este item no tiene secciones.
                  </p>
                )}
              </nav>
            </SortableContext>
          </DndContext>

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                setNombreNueva("");
                setModalNueva(true);
              }}
              className="btn btn-ghost btn-sm home h-9 w-full justify-start px-2 text-sm font-light text-primary"
            >
              Nueva Sección
              {ICONO_MAS}
            </button>
            <button
              type="button"
              onClick={() => paginaPortada && setPaginaAbierta(paginaPortada)}
              disabled={!paginaPortada}
              title={
                paginaPortada
                  ? "Ver la portada del item"
                  : "El item no tiene portada registrada"
              }
              className="btn btn-outline btn-primary btn-sm home h-9 w-full text-sm font-normal"
            >
              Ver Portada
            </button>
          </div>
        </aside>

        {/* ── Contenido de la sección ── */}
        <section className="flex min-w-0 flex-col gap-4 lg:col-span-3 lg:min-h-0 lg:overflow-y-auto">
          {seccion ? (
            <>
              <div className="flex items-center gap-2">
                {editandoLabel ? (
                  <input
                    autoFocus
                    defaultValue=""
                    placeholder={seccion.label}
                    aria-label="Nombre de la sección"
                    onBlur={(event) => {
                      const label = event.target.value.trim();
                      if (label) renombrarSeccion(label);
                      setEditandoLabel(false);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") event.currentTarget.blur();
                    }}
                    className="input h-10 w-72 max-w-full home text-lg font-light"
                  />
                ) : (
                  <h1 className="login min-w-0 truncate text-2xl text-base-content">
                    {seccion.label}
                  </h1>
                )}
                <button
                  type="button"
                  onClick={() => setEditandoLabel(true)}
                  aria-label="Editar sección"
                  title="Editar sección"
                  className="btn btn-ghost btn-xs btn-square shrink-0"
                >
                  {ICONO_LAPIZ}
                </button>
                <button
                  type="button"
                  onClick={eliminarSeccion}
                  aria-label="Eliminar sección"
                  title="Eliminar sección"
                  className="btn btn-ghost btn-xs btn-square shrink-0 text-base-content/50 hover:text-error"
                >
                  {ICONO_PAPELERA}
                </button>
              </div>

              <div className="flex w-full flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => seccion && seleccionarTodas(seccion)}
                  className="btn btn-outline btn-primary btn-sm home font-normal"
                >
                  Seleccionar todo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDestino("");
                    setModalMover(true);
                  }}
                  disabled={seleccionadas.size === 0 || secciones.length <= 1}
                  title={
                    secciones.length <= 1
                      ? "Necesitas al menos dos secciones para mover páginas"
                      : seleccionadas.size === 0
                        ? "Selecciona al menos una página"
                        : undefined
                  }
                  className="btn btn-outline btn-primary btn-sm home font-normal"
                >
                  Mover selección
                </button>
              </div>

              <DndContext
                sensors={sensores}
                collisionDetection={closestCenter}
                onDragEnd={reordenar}
              >
                <SortableContext
                  items={seccion.pages.map((pagina) => pagina.file_name)}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {seccion.pages.map((pagina) => (
                      <TarjetaPagina
                        key={pagina.file_name}
                        pagina={pagina}
                        url={rutaArchivo(item, pagina.file_name)}
                        seleccionada={seleccionadas.has(pagina.file_name)}
                        onSeleccionar={() => alternarPagina(pagina.file_name)}
                        onAbrir={() => setPaginaAbierta(pagina)}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>

              {seccion.pages.length === 0 && (
                <p className="home py-6 text-sm font-light text-base-content/50">
                  Esta sección no tiene páginas.
                </p>
              )}
            </>
          ) : (
            <p className="home py-6 text-sm font-light text-base-content/50">
              Selecciona una sección para ver su contenido.
            </p>
          )}
        </section>
      </div>

      <footer className="flex shrink-0 justify-end border-t border-primary/20 px-6 py-4 lg:px-10">
        <button
          type="button"
          onClick={handleGuardar}
          disabled={ocupado}
          className="btn btn-primary btn-md home px-6 font-normal"
        >
          {ocupado ? (
            <>
              <span className="loading loading-spinner loading-xs"></span>
              Guardando…
            </>
          ) : (
            "Guardar"
          )}
        </button>
      </footer>

      {paginaAbierta && (
        <ModalPagina
          pagina={paginaAbierta}
          url={rutaArchivo(item, paginaAbierta.file_name)}
          onCerrar={() => setPaginaAbierta(null)}
          onPortada={() => establecerPortada(paginaAbierta)}
        />
      )}

      {modalNueva && (
        <ModalNuevaSeccion
          nombre={nombreNueva}
          onNombre={setNombreNueva}
          onCrear={agregarSeccion}
          onCerrar={() => setModalNueva(false)}
        />
      )}

      {modalMover && (
        <ModalMoverSeleccion
          secciones={secciones}
          origen={seccionActiva}
          seleccionadas={seleccionadas.size}
          destino={destino}
          onDestino={setDestino}
          onMover={moverSeleccion}
          onCerrar={() => setModalMover(false)}
        />
      )}

      {modalAyuda && <ModalAyuda onCerrar={() => setModalAyuda(false)} />}
    </div>
  );
}

function ModalAyuda({ onCerrar }: { onCerrar: () => void }) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Ayuda del panel"
      className="modal modal-open"
    >
      <div className="modal-box max-w-2xl">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 className="login text-xl text-base-content">
            Cómo funciona este panel
          </h2>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="btn btn-ghost btn-sm btn-square shrink-0"
          >
            ✕
          </button>
        </div>

        <div className="home flex flex-col gap-4 text-sm font-light text-base-content/80">
          <section>
            <h3 className="mb-0.5 text-sm font-normal text-base-content">
              Secciones
            </h3>
            <p>
              Un libro se organiza en secciones y cada sección agrupa sus
              páginas en un orden. Con «Nueva Sección» creas una vacía, el lápiz
              cambia su nombre y la papelera solo elimina secciones sin páginas.
            </p>
          </section>

          <section>
            <h3 className="mb-0.5 text-sm font-normal text-base-content">
              Seleccionar páginas
            </h3>
            <p>
              La casilla sobre la miniatura marca una página. «Seleccionar todo»
              marca o desmarca todas las de la sección actual. La selección
              pertenece a una sola sección: al cambiar de sección se reinicia.
            </p>
          </section>

          <section>
            <h3 className="mb-0.5 text-sm font-normal text-base-content">
              Mover páginas entre secciones
            </h3>
            <p>
              «Mover selección» lleva las páginas marcadas a otra sección.
              Necesitas al menos dos secciones y la sección de origen no aparece
              como destino.
            </p>
          </section>

          <section>
            <h3 className="mb-0.5 text-sm font-normal text-base-content">
              Reordenar
            </h3>
            <p>
              Arrastra el asa de seis puntos para cambiar el orden: la de cada
              sección, en la columna izquierda, reordena las secciones; la de
              cada miniatura reordena las páginas dentro de su sección. Los
              números se recalculan solos.
            </p>
          </section>

          <section>
            <h3 className="mb-0.5 text-sm font-normal text-base-content">
              Ver archivos y portada
            </h3>
            <p>
              Al hacer clic en la miniatura se abre el archivo en grande. Si es
              una imagen puedes marcarla como portada desde ese visor;
              «Ver Portada» abre la portada registrada.
            </p>
          </section>

          <section>
            <h3 className="mb-0.5 text-sm font-normal text-base-content">
              Sustituir archivos
            </h3>
            <p>
              {AVISO_SUSTITUIR}: la sustitución no está disponible desde este
              panel.
            </p>
          </section>

          <section>
            <h3 className="mb-0.5 text-sm font-normal text-base-content">
              Guardar
            </h3>
            <p>
              Los cambios se aplican al pulsar «Guardar». Si cierras la página
              antes, se pierden.
            </p>
          </section>
        </div>
      </div>

      <div className="modal-backdrop" onClick={onCerrar} />
    </div>
  );
}

interface MoverProps {
  secciones: SeccionItem[];
  /** Sección de la que salen las páginas: no aparece como destino. */
  origen: number;
  seleccionadas: number;
  destino: string;
  onDestino: (indice: string) => void;
  onMover: () => void;
  onCerrar: () => void;
}

function ModalMoverSeleccion({
  secciones,
  origen,
  seleccionadas,
  destino,
  onDestino,
  onMover,
  onCerrar,
}: MoverProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Mover selección"
      className="modal modal-open"
    >
      <div className="modal-box max-w-sm">
        <h2 className="login text-xl text-base-content">Mover selección</h2>
        <p className="home mt-1 text-sm font-light text-base-content/60">
          {seleccionadas === 1
            ? "1 página seleccionada"
            : `${seleccionadas} páginas seleccionadas`}
        </p>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onMover();
          }}
          className="mt-4 flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5">
            <span className="home text-xs font-normal tracking-widest text-base-content/50 uppercase">
              Sección destino
            </span>
            <select
              value={destino}
              onChange={(event) => onDestino(event.target.value)}
              className="select w-full home text-sm font-light"
            >
              <option value="">Selecciona una sección</option>
              {secciones.map((actual, indice) =>
                indice === origen ? null : (
                  <option key={`${actual.label}-${indice}`} value={indice}>
                    {actual.label}
                  </option>
                ),
              )}
            </select>
          </label>

          <div className="modal-action mt-0">
            <button
              type="button"
              onClick={onCerrar}
              className="btn btn-ghost btn-sm home font-normal"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!destino}
              className="btn btn-primary btn-sm home font-normal"
            >
              Mover
            </button>
          </div>
        </form>
      </div>

      <div className="modal-backdrop" onClick={onCerrar} />
    </div>
  );
}

interface NuevaProps {
  nombre: string;
  onNombre: (nombre: string) => void;
  onCrear: () => void;
  onCerrar: () => void;
}

function ModalNuevaSeccion({
  nombre,
  onNombre,
  onCrear,
  onCerrar,
}: NuevaProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Nueva sección"
      className="modal modal-open"
    >
      <div className="modal-box max-w-sm">
        <h2 className="login text-xl text-base-content">Nueva sección</h2>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            onCrear();
          }}
          className="mt-4 flex flex-col gap-4"
        >
          <label className="flex flex-col gap-1.5">
            <span className="home text-xs font-normal tracking-widest text-base-content/50 uppercase">
              Nombre
            </span>
            <input
              autoFocus
              value={nombre}
              onChange={(event) => onNombre(event.target.value)}
              placeholder="Ej. Preliminares"
              className="input w-full home text-sm font-light"
            />
          </label>

          <div className="modal-action mt-0">
            <button
              type="button"
              onClick={onCerrar}
              className="btn btn-ghost btn-sm home font-normal"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!nombre.trim()}
              className="btn btn-primary btn-sm home font-normal"
            >
              Crear
            </button>
          </div>
        </form>
      </div>

      <div className="modal-backdrop" onClick={onCerrar} />
    </div>
  );
}

interface ModalProps {
  pagina: PaginaItem;
  url: string;
  onCerrar: () => void;
  onPortada: () => void;
}

function ModalPagina({ pagina, url, onCerrar, onPortada }: ModalProps) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={pagina.file_name}
      className="modal modal-open"
    >
      <div className="modal-box w-11/12 max-w-6xl">
        <div className="mb-3 flex items-start justify-between gap-4">
          <p className="home truncate text-sm font-light text-base-content/70">
            {pagina.file_name}
          </p>
          <button
            type="button"
            onClick={onCerrar}
            aria-label="Cerrar"
            className="btn btn-ghost btn-sm btn-square shrink-0"
          >
            ✕
          </button>
        </div>

        {esPdf(pagina.file_name) ? (
          <iframe
            src={url}
            title={pagina.file_name}
            className="h-[72vh] w-full rounded-sm"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={pagina.file_name}
            className="mx-auto max-h-[72vh] w-auto max-w-full object-contain"
          />
        )}

        {esImagen(pagina.file_name) && (
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={onPortada}
              className="btn btn-outline btn-primary btn-sm home font-normal"
            >
              Establecer como portada
            </button>
          </div>
        )}
      </div>

      <div className="modal-backdrop" onClick={onCerrar} />
    </div>
  );
}
