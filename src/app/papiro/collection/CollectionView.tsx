"use client";

import { useState, useEffect, useRef } from "react";
import { getCarpetas, getItems, findbyfilter } from "../services/amc_xlibris";
import type { Carpeta, Item } from "../services/amc_xlibris.types";
import { EditForm } from "../components/edit_form";
import { LoadingZone } from "../components/LoadingZone";
import { ThemeToggle } from "../components/ThemeToggle";
import { FilterBar } from "../components/FilterBar";
import { CarpetaCard } from "../components/CarpetaCard";
import { CarpetaDetail } from "../components/CarpetaDetail";
import { ItemSearchCard } from "../components/ItemSearchCard";
import { ItemRow } from "../components/ItemRow";
import { ItemDetail } from "../components/ItemDetail";

type FetchState = "loading" | "success" | "error";

type FilterConfig = {
  nombre: "carpeta" | "item";
  filtros: { label: string; value: string }[];
};

const FILTER_CARPETA: FilterConfig = {
  nombre: "carpeta",
  filtros: [
    { label: "Notas", value: "notas" },
    { label: "Palabras clave", value: "keywords" },
  ],
};

const FILTER_ITEM: FilterConfig = {
  nombre: "item",
  filtros: [
    { label: "Autor", value: "autor" },
    { label: "Tipología", value: "tipologia" },
    { label: "Descripción", value: "descripcion" },
    { label: "Notas", value: "notas" },
    { label: "Referencia", value: "referencia_control" },
    { label: "Palabras clave", value: "keywords" },
  ],
};

interface CollectionViewProps {
  coleccion: string;
}

export default function CollectionView({ coleccion }: CollectionViewProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [carpetas, setCarpetas] = useState<Carpeta[]>([]);
  const [carpeta_seleccionada, setCarpetaSeleccionada] = useState<
    Carpeta | null | undefined
  >(null);
  const [items, setItems] = useState<Item[]>([]);
  const [item_seleccionado, setItemSeleccionado] = useState<Item | null>(null);
  const [fetchState, setFetchState] = useState<FetchState>("loading");
  const [itemsFetchState, setItemsFetchState] = useState<FetchState>("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [respuestaTypeItem, setRespuestaTypeItem] = useState(false);
  const [itemsBusqueda, setItemsBusqueda] = useState<Item[]>([]);
  const [itemBusquedaSeleccionado, setItemBusquedaSeleccionado] =
    useState<Item | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [filter, setFilter] = useState(FILTER_CARPETA);
  const [query, setQuery] = useState("");
  const [queryActivo, setQueryActivo] = useState("");
  const [filtroActivo, setFiltroActivo] = useState("");

  const modalCarpetaRef = useRef<any>(null);
  const modalItemRef = useRef<any>(null);
  const filterFormRef = useRef<any>(null);

  const resetBusqueda = () => {
    setRespuestaTypeItem(false);
    setItemsBusqueda([]);
    setItemBusquedaSeleccionado(null);
    setItemSeleccionado(null);
    setQueryActivo("");
    setQuery("");
    setFiltroActivo("");
    filterFormRef.current?.reset();
  };

  const handleSearch = () => {
    const filtro_final =
      filtroActivo ||
      (filter.nombre === "carpeta" ? "subcoleccion_normalizada" : "titulo");
    setQueryActivo(query);
    setFetchState("loading");

    findbyfilter(coleccion, {
      type: filter.nombre,
      query,
      filtro: filtro_final,
    })
      .then((data) => {
        if (data?.data[0]?.type === "item") {
          setRespuestaTypeItem(true);
          setItemsBusqueda(data.data as Item[]);
          const firstItem = (data.data as Item[])[0] ?? null;
          setItemBusquedaSeleccionado(firstItem);
          const cp = firstItem?.carpeta_padre;
          setCarpetaSeleccionada(cp && typeof cp !== "string" ? cp : null);
        } else {
          setRespuestaTypeItem(false);
          setCarpetas(data.data as Carpeta[]);
          setCarpetaSeleccionada((data.data as Carpeta[])[0] ?? null);
        }
        setFetchState("success");
      })
      .catch((err: Error) => {
        setErrorMsg(err.message);
        setFetchState("error");
      });
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1080);
    handleResize();
    window.addEventListener("resize", handleResize);

    getCarpetas(coleccion)
      .then((data) => {
        setCarpetas(data);
        setCarpetaSeleccionada(data[0] ?? null);
        setFetchState("success");
      })
      .catch((err: Error) => {
        setErrorMsg(err.message);
        setFetchState("error");
      });

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!carpeta_seleccionada || respuestaTypeItem) return;
    setItems([]);
    setItemSeleccionado(null);
    setItemsFetchState("loading");
    getItems(coleccion, carpeta_seleccionada.subcoleccion_normalizada)
      .then((data) => {
        setItems(data);
        setItemsFetchState("success");
      })
      .catch(() => setItemsFetchState("error"));
  }, [carpeta_seleccionada]);

  const Modal = ({
    dialogRef,
    children,
  }: {
    dialogRef: React.RefObject<HTMLDialogElement>;
    children: React.ReactNode;
  }) => (
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

  return (
    <div className="home h-screen overflow-hidden bg-base-100 text-base-content">
      {isMobile ? (
        <div className="flex items-center justify-center h-full px-6">
          <p className="text-center text-base font-semibold">
            Esta aplicación está optimizada para pantallas más grandes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 h-full">
          {/* ══ Panel izquierdo ══ */}
          <div className="flex flex-col h-full p-3 2xl:p-5 overflow-hidden border-r border-primary/20 bg-base-100">
            {/* Header */}
            <div className="flex-none flex justify-between items-center mb-2 2xl:mb-4">
              <h1 className="font-bold text-lg 2xl:text-2xl">
                {respuestaTypeItem ? "Resultados" : "Carpetas"}
              </h1>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button type="button" className="btn btn-xs btn-ghost">
                  Cerrar sesión
                </button>
              </div>
            </div>

            {/* Búsqueda + toggle */}
            <div className="flex mb-2">
              <form
                className="mr-4 w-80"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
              >
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Buscar ${filter.nombre}...`}
                  className="input input-sm 2xl:input-md input-primary"
                />
                <button type="submit" className="hidden" />
              </form>
              <label className="flex items-center gap-1.5 shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  className="toggle toggle-xs 2xl:toggle-sm toggle-primary"
                  onChange={(e) => {
                    setFilter(e.target.checked ? FILTER_ITEM : FILTER_CARPETA);
                    setFiltroActivo("");
                    setQuery("");
                    filterFormRef.current?.reset();
                    resetBusqueda();
                  }}
                />
                <span className="text-xs 2xl:text-sm">Item</span>
              </label>
            </div>

            {/* Filtros */}
            <FilterBar
              filtroActivo={filtroActivo}
              filtros={filter.filtros}
              nombreDefault={
                filter.nombre === "carpeta" ? "Nombre de la carpeta" : "Título"
              }
              filterFormRef={filterFormRef}
              onFiltroChange={setFiltroActivo}
              onReset={() => setFiltroActivo("")}
            />

            {/* Badge búsqueda activa */}
            {respuestaTypeItem && (
              <div className="flex-none flex items-center justify-between my-2 px-1">
                <span className="badge badge-soft badge-primary gap-1 text-xs">
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  {itemsBusqueda.length} resultado
                  {itemsBusqueda.length !== 1 ? "s" : ""} para &ldquo;
                  {queryActivo}&rdquo;
                </span>
                <button
                  onClick={resetBusqueda}
                  className="btn btn-sm w-40 gap-1"
                >
                  <svg
                    className="w-3 h-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                  </svg>
                  Volver
                </button>
              </div>
            )}

            {/* Grid */}
            <LoadingZone state={fetchState} error={errorMsg} minHeight="flex-1">
              <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                {!respuestaTypeItem ? (
                  <div className="grid grid-cols-3 2xl:grid-cols-4 gap-2">
                    {carpetas.map((c) => (
                      <CarpetaCard
                        key={c._id}
                        carpeta={c}
                        seleccionada={c._id === carpeta_seleccionada?._id}
                        onClick={() => setCarpetaSeleccionada(c)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-3 2xl:grid-cols-4 gap-2">
                    {itemsBusqueda.map((it) => (
                      <ItemSearchCard
                        key={it._id}
                        item={it}
                        seleccionado={it._id === itemBusquedaSeleccionado?._id}
                        onClick={() => {
                          setItemBusquedaSeleccionado(it);
                          const cp = it.carpeta_padre;
                          setCarpetaSeleccionada(
                            cp && typeof cp !== "string" ? cp : null,
                          );
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </LoadingZone>
          </div>

          {/* ══ Panel derecho ══ */}
          <div className="bg-base-200 h-full p-3 2xl:p-5 flex flex-col overflow-hidden">
            {!respuestaTypeItem ? (
              <>
                <LoadingZone
                  state={fetchState}
                  error={errorMsg}
                  minHeight="h-28"
                >
                  {carpeta_seleccionada && (
                    <>
                      <CarpetaDetail
                        carpeta={carpeta_seleccionada}
                        onEditar={() => modalCarpetaRef.current?.showModal()}
                      />
                      <Modal dialogRef={modalCarpetaRef}>
                        <EditForm
                          key={carpeta_seleccionada._id}
                          coleccion={coleccion}
                          elemento={carpeta_seleccionada}
                          close_modal={() => modalCarpetaRef.current?.close()}
                          onUpdate={setCarpetaSeleccionada}
                        />
                      </Modal>
                    </>
                  )}
                </LoadingZone>

                <div className="divider my-1 2xl:my-2" />

                <div className="flex-none flex items-center mb-1.5">
                  <h3 className="font-semibold text-xs 2xl:text-base">
                    Items
                    {itemsFetchState === "success" && (
                      <span className="ml-2 font-normal text-base-content/50">
                        {items.length} encontrados
                      </span>
                    )}
                  </h3>
                </div>

                <div className="flex-none h-44 2xl:h-64 overflow-y-auto pr-1">
                  <LoadingZone state={itemsFetchState} minHeight="h-full">
                    {items.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-xs text-base-content/40">
                          Esta carpeta no tiene items
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 2xl:grid-cols-4 gap-1.5">
                        {items.map((it) => (
                          <ItemRow
                            key={it._id}
                            item={it}
                            seleccionado={it._id === item_seleccionado?._id}
                            onClick={() => setItemSeleccionado(it)}
                          />
                        ))}
                      </div>
                    )}
                  </LoadingZone>
                </div>

                <div className="divider my-1 2xl:my-2" />

                <div className="flex-1 min-h-0 overflow-y-auto">
                  {!item_seleccionado ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs text-base-content/40">
                        Selecciona un item para ver sus detalles
                      </p>
                    </div>
                  ) : (
                    <>
                      <ItemDetail
                        item={item_seleccionado}
                        onEditar={() => modalItemRef.current?.showModal()}
                      />
                      <Modal dialogRef={modalItemRef}>
                        <EditForm
                          key={item_seleccionado._id}
                          coleccion={coleccion}
                          elemento={item_seleccionado}
                          close_modal={() => modalItemRef.current?.close()}
                          onUpdate={setItemSeleccionado}
                        />
                      </Modal>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="h-[30%] flex flex-col overflow-hidden">
                  <LoadingZone
                    state={fetchState}
                    error={errorMsg}
                    minHeight="h-full"
                  >
                    {carpeta_seleccionada && (
                      <>
                        <CarpetaDetail
                          carpeta={carpeta_seleccionada}
                          onEditar={() => modalCarpetaRef.current?.showModal()}
                        />
                        <Modal dialogRef={modalCarpetaRef}>
                          <EditForm
                            key={carpeta_seleccionada._id}
                            coleccion={coleccion}
                            elemento={carpeta_seleccionada}
                            close_modal={() => modalCarpetaRef.current?.close()}
                            onUpdate={setCarpetaSeleccionada}
                          />
                        </Modal>
                      </>
                    )}
                  </LoadingZone>
                </div>

                <div className="divider my-1 2xl:my-2" />

                <div className="h-[70%] flex flex-col overflow-hidden">
                  {!itemBusquedaSeleccionado ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs text-base-content/40">
                        Selecciona un item para ver sus detalles
                      </p>
                    </div>
                  ) : (
                    <>
                      <ItemDetail
                        item={itemBusquedaSeleccionado}
                        onEditar={() => modalItemRef.current?.showModal()}
                      />
                      <Modal dialogRef={modalItemRef}>
                        <EditForm
                          key={itemBusquedaSeleccionado._id}
                          coleccion={coleccion}
                          elemento={itemBusquedaSeleccionado}
                          close_modal={() => modalItemRef.current?.close()}
                          onUpdate={setItemBusquedaSeleccionado}
                        />
                      </Modal>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
