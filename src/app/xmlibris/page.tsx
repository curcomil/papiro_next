"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { amcService } from "./services/amc_xlibris";
import type { Carpeta, Item } from "./services/amc_xlibris";
import { EditForm } from "./components/edit_form";

type FetchState = "loading" | "success" | "error";

export default function Home_xmlibris() {
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
  const [respuestaTypeItem, setRespuestaTypeItem] = useState<boolean>(false);
  // Guardamos los items de búsqueda separados de los items de carpeta
  const [itemsBusqueda, setItemsBusqueda] = useState<Item[]>([]);
  const [itemBusquedaSeleccionado, setItemBusquedaSeleccionado] =
    useState<Item | null>(null);

  const modalCarpetaRef = useRef<HTMLDialogElement>(null);
  const modalItemRef = useRef<HTMLDialogElement>(null);

  const carpeta = {
    nombre: "carpeta",
    filtros: [
      { label: "Notas", value: "notas" },
      { label: "Palabras clave", value: "keywords" },
    ],
  };
  const item = {
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

  const [filter, setFilter] = useState(carpeta);
  const [query, setQuery] = useState<string>("");
  const [queryActivo, setQueryActivo] = useState<string>(""); // ← guarda el query del último submit para el badge
  const [filtroActivo, setFiltroActivo] = useState<string>("");
  const filterFormRef = useRef<HTMLFormElement>(null);

  // Resetea el estado de búsqueda y vuelve al modo normal
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
    const filtro_final = !filtroActivo
      ? filter.nombre === "carpeta"
        ? "nombre_expediente_normalizado"
        : "titulo"
      : filtroActivo;

    const payload = { type: filter.nombre, query, filtro: filtro_final };
    console.log(payload);
    setQueryActivo(query);
    setFetchState("loading");

    amcService
      .findbyfilter(payload)
      .then((data) => {
        if (data?.resultado[0]?.type === "item") {
          setRespuestaTypeItem(true);
          setItemsBusqueda(data.resultado);
          setItemBusquedaSeleccionado(data.resultado[0] ?? null);
          setCarpetaSeleccionada(data?.resultado[0].carpeta_padre ?? null);
        } else {
          setRespuestaTypeItem(false);
          setCarpetas(data.resultado);
          setCarpetaSeleccionada(data.resultado[0] ?? null);
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

    amcService
      .getCarpetas()
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

    amcService
      .getItems(carpeta_seleccionada._id)
      .then((data) => {
        setItems(data);
        setItemsFetchState("success");
      })
      .catch(() => setItemsFetchState("error"));
  }, [carpeta_seleccionada]);

  const LoadingZone = ({
    children,
    state,
    error,
    minHeight = "h-32",
  }: {
    children: React.ReactNode;
    state: FetchState;
    error?: string;
    minHeight?: string;
  }) => {
    if (state === "loading") {
      return (
        <div className={`flex items-center justify-center ${minHeight} w-full`}>
          <span className="loading loading-ring loading-md text-[#4E4942]" />
        </div>
      );
    }
    if (state === "error") {
      return (
        <div
          className={`flex flex-col items-center justify-center gap-2 ${minHeight}`}
        >
          <p className="text-red-500 font-semibold text-xs">
            Error al cargar datos
          </p>
          {error && <p className="text-xs text-gray-500">{error}</p>}
          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-50 hover:bg-yellow-100 font-bold py-1 px-3 rounded-lg shadow text-xs transition"
          >
            Reintentar
          </button>
        </div>
      );
    }
    return <>{children}</>;
  };

  return (
    <div className="home h-screen overflow-hidden bg-[#F9E6C5] text-[#4E4942]">
      {isMobile ? (
        <div className="flex items-center justify-center h-full px-6">
          <p className="text-center text-base font-semibold">
            Esta aplicación está optimizada para pantallas más grandes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 h-full">
          {/* ══ Panel izquierdo ══ */}
          <div className="flex flex-col h-full p-3 2xl:p-5 overflow-hidden border-r border-[#e8d5b0]">
            {/* Header */}
            <div className="flex-none flex justify-between items-center mb-2 2xl:mb-4">
              <h1 className="font-bold text-lg 2xl:text-2xl">
                {respuestaTypeItem ? "Resultados" : "Carpetas"}
              </h1>
              <button
                type="button"
                className="text-xs 2xl:text-sm hover:cursor-pointer"
              >
                Cerrar sesión
              </button>
            </div>

            {/* Búsqueda + toggle */}
            <div className="flex-none flex items-center gap-2 mb-2">
              <form
                className="flex-1"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch();
                }}
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Buscar ${filter.nombre}...`}
                  className="w-full rounded-lg px-2.5 py-1.5 text-xs 2xl:text-sm bg-yellow-50 shadow focus:outline-none focus:ring-2 focus:ring-[#F9E6C5] transition"
                />
                <button type="submit" className="hidden" />
              </form>
              <label className="flex items-center gap-1.5 shrink-0 cursor-pointer">
                <input
                  type="checkbox"
                  className="toggle toggle-xs 2xl:toggle-sm"
                  onChange={(e) => {
                    const nuevoFiltro = e.target.checked ? item : carpeta;
                    setFilter(nuevoFiltro);
                    setFiltroActivo("");
                    setQuery("");
                    filterFormRef.current?.reset();
                    resetBusqueda();
                  }}
                />
                <span className="text-xs">Item</span>
              </label>
            </div>

            {/* Filtros */}
            <div className="flex-none mb-2">
              <p className="text-xs font-semibold text-[#4E4942]/50 uppercase tracking-wider mb-1">
                Filtrar por
              </p>
              <form
                ref={filterFormRef}
                className="filter"
                onSubmit={(e) => e.preventDefault()}
              >
                <div
                  className={`btn btn-xs btn-primary ${filtroActivo && "hidden"}`}
                >
                  {filter?.nombre === "carpeta"
                    ? "Nombre de la carpeta"
                    : "Título"}
                </div>
                <input
                  className="btn btn-xs btn-square"
                  type="reset"
                  value="×"
                  title="Limpiar filtro"
                  onClick={() => setFiltroActivo("")}
                />
                {filter.filtros.map((f: any) => (
                  <input
                    key={f.value}
                    className="btn btn-xs"
                    type="radio"
                    name="filtro"
                    value={f.value}
                    aria-label={f.label}
                    onChange={() => setFiltroActivo(f.value)}
                  />
                ))}
              </form>
            </div>

            {/* ── Badge de búsqueda activa + botón volver ── */}
            {respuestaTypeItem && (
              <div className="flex-none flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-1.5">
                  <span className="inline-flex items-center gap-1 bg-[#e8c97a]/40 text-[#4E4942] text-xs font-medium px-2 py-0.5 rounded-full">
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
                </div>
                <button
                  onClick={resetBusqueda}
                  className="text-xs text-[#4E4942]/60 hover:text-[#4E4942] flex items-center gap-1 transition"
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

            {/* ── Grid: carpetas o items de búsqueda ── */}
            <LoadingZone state={fetchState} error={errorMsg} minHeight="flex-1">
              <div className="flex-1 min-h-0 overflow-y-auto pr-1">
                {/* Modo carpetas */}
                {!respuestaTypeItem && (
                  <div className="grid grid-cols-3 2xl:grid-cols-4 gap-2">
                    {carpetas.map((c) => (
                      <div
                        key={c._id}
                        onClick={() => setCarpetaSeleccionada(c)}
                        className={`cursor-pointer rounded-xl p-2 2xl:p-3 transition-all flex flex-col items-center text-center gap-1 border
                          ${
                            c._id === carpeta_seleccionada?._id
                              ? "bg-[#f8ddae] border-[#e8c97a] shadow-md"
                              : "bg-yellow-50 border-transparent shadow-sm hover:shadow-md hover:border-[#e8c97a]"
                          }`}
                      >
                        <img
                          src="/xmlibris/carpeta.png"
                          alt="Carpeta"
                          className="w-10 h-10 2xl:w-14 2xl:h-14 object-contain"
                        />
                        <p className="font-semibold text-xs leading-tight line-clamp-2">
                          {c.nombre_expediente}
                        </p>
                        <p className="text-xs text-[#4E4942]/50">
                          {c.items.length} items
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Modo items de búsqueda */}
                {respuestaTypeItem && (
                  <div className="grid grid-cols-3 2xl:grid-cols-4 gap-2">
                    {itemsBusqueda.map((it) => (
                      <div
                        key={it._id}
                        onClick={() => {
                          setItemBusquedaSeleccionado(it);
                          setCarpetaSeleccionada(it.carpeta_padre);
                        }}
                        className={`cursor-pointer rounded-xl p-2 2xl:p-3 transition-all flex flex-col items-center text-center gap-1.5 border
                          ${
                            it._id === itemBusquedaSeleccionado?._id
                              ? "bg-[#f8ddae] border-[#e8c97a] shadow-md"
                              : "bg-yellow-50 border-transparent shadow-sm hover:shadow-md hover:border-[#e8c97a]"
                          }`}
                      >
                        {/* Imagen del item o placeholder */}
                        {it.imagen_url ? (
                          <img
                            src={it.imagen_url}
                            alt={it.titulo}
                            className="w-30 h-30 2xl:w-40 2xl:h-40 object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-10 h-10 2xl:w-14 2xl:h-14 bg-[#f8ddae] rounded-lg flex items-center justify-center shrink-0">
                            <svg
                              className="w-5 h-5 text-[#4E4942]/30"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        )}
                        <p className="font-semibold text-xs leading-tight line-clamp-2">
                          {it.titulo || "Sin título"}
                        </p>
                        {it.numero_inventario > 0 && (
                          <p className="text-xs text-[#4E4942]/50">
                            Inv. {it.numero_inventario}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </LoadingZone>
          </div>

          {/* ══ Panel derecho ══ */}
          <div className="bg-[#f8ddae] h-full p-3 2xl:p-5 flex flex-col overflow-hidden">
            {/* ── Modo normal: sección 1 (30%) + sección 2 (70%) fijas, separador, sección 3 flex ── */}
            {!respuestaTypeItem ? (
              <>
                {/* Sección 1 — Detalle carpeta */}
                <LoadingZone
                  state={fetchState}
                  error={errorMsg}
                  minHeight="h-28"
                >
                  {carpeta_seleccionada && (
                    <>
                      <div className="flex-none flex gap-3">
                        <img
                          className="w-12 h-12 2xl:w-16 2xl:h-16 object-contain shrink-0"
                          src="/xmlibris/carpeta.png"
                          alt="Carpeta"
                        />
                        <div className="flex flex-col flex-1 min-w-0 justify-between">
                          <div>
                            <h2 className="font-bold text-sm 2xl:text-xl leading-tight truncate">
                              {carpeta_seleccionada.nombre_expediente}
                            </h2>
                            <div className="mt-1 space-y-0.5">
                              <p className="text-xs 2xl:text-base truncate">
                                <span className="font-medium">Ubicación:</span>{" "}
                                {carpeta_seleccionada.ubicacion_fisica}
                              </p>
                              <p className="text-xs 2xl:text-base">
                                <span className="font-medium">Referencia:</span>{" "}
                                {carpeta_seleccionada.referencia_control ||
                                  "N/A"}
                              </p>
                              <p className="text-xs 2xl:text-base">
                                <span className="font-medium">Notas:</span>{" "}
                                {carpeta_seleccionada.notas || "N/A"}
                              </p>
                              <p className="text-xs 2xl:text-base">
                                <span className="font-medium">
                                  Palabras clave:
                                </span>{" "}
                                {carpeta_seleccionada.keywords?.join(", ") ||
                                  "N/A"}
                              </p>
                              <p className="text-xs 2xl:text-base">
                                <span className="font-medium">
                                  Total items:
                                </span>{" "}
                                {carpeta_seleccionada.items?.length}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 mt-2">
                            {carpeta_seleccionada.url && (
                              <Link
                                href={carpeta_seleccionada.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <button className="bg-yellow-50 hover:bg-yellow-100 text-[#4E4942] font-semibold py-1 px-2.5 rounded-lg shadow-sm text-xs transition 2xl:text-base">
                                  Ver en Catarina ↗
                                </button>
                              </Link>
                            )}
                            <button
                              onClick={() =>
                                modalCarpetaRef.current?.showModal()
                              }
                              className="bg-yellow-50 hover:bg-yellow-100 text-[#4E4942] font-semibold py-1 px-2.5 rounded-lg shadow-sm text-xs transition 2xl:text-base"
                            >
                              Editar carpeta
                            </button>
                          </div>
                        </div>
                      </div>

                      <dialog ref={modalCarpetaRef} className="modal">
                        <div className="modal-box w-11/12 max-w-2xl">
                          <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                              ✕
                            </button>
                          </form>
                          <EditForm
                            elemento={carpeta_seleccionada}
                            close_modal={() => modalCarpetaRef.current?.close()}
                            onUpdate={setCarpetaSeleccionada}
                          />
                        </div>
                      </dialog>
                    </>
                  )}
                </LoadingZone>

                <div className="flex-none h-px bg-yellow-50 my-2 2xl:my-3" />

                {/* Sección 2 — Items de carpeta */}
                <div className="flex-none flex items-center mb-1.5">
                  <h3 className="font-semibold text-xs 2xl:text-base">
                    Items
                    {itemsFetchState === "success" && (
                      <span className="ml-2 font-normal text-[#4E4942]/50">
                        {items.length} encontrados
                      </span>
                    )}
                  </h3>
                </div>

                <div className="flex-none h-44 2xl:h-64 overflow-y-auto pr-1">
                  <LoadingZone state={itemsFetchState} minHeight="h-full">
                    {items.length === 0 ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-xs text-gray-400">
                          Esta carpeta no tiene items
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 2xl:grid-cols-4 gap-1.5">
                        {items.map((it) => (
                          <div
                            key={it._id}
                            onClick={() => setItemSeleccionado(it)}
                            className={`cursor-pointer rounded-lg p-2 transition-all border
                              ${
                                it._id === item_seleccionado?._id
                                  ? "bg-[#F9E6C5] border-[#e8c97a] shadow"
                                  : "bg-yellow-50 border-transparent shadow-sm hover:shadow hover:border-[#e8c97a]"
                              }`}
                          >
                            <p className="text-xs font-bold truncate">
                              {it.titulo || "Sin título"}
                            </p>
                            <p className="text-xs text-gray-500 truncate mt-0.5">
                              {it.tipologia || "—"}
                            </p>
                            <p className="text-xs text-gray-400 truncate">
                              {it.autor || "—"}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </LoadingZone>
                </div>

                <div className="flex-none h-px bg-yellow-50 my-2 2xl:my-3" />

                {/* Sección 3 — Detalle item */}
                <div className="flex-1 min-h-0 overflow-y-auto">
                  {!item_seleccionado ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs text-gray-400">
                        Selecciona un item para ver sus detalles
                      </p>
                    </div>
                  ) : (
                    <div className="flex gap-3 2xl:gap-6">
                      <div className="shrink-0">
                        {item_seleccionado.imagen_url ? (
                          <img
                            src={item_seleccionado.imagen_url}
                            alt={item_seleccionado.titulo}
                            className="w-20 h-20 2xl:w-32 2xl:h-32 object-cover rounded-lg shadow"
                          />
                        ) : (
                          <div className="w-20 h-20 2xl:w-32 2xl:h-32 bg-yellow-50 rounded-lg shadow flex items-center justify-center">
                            <p className="text-xs text-gray-400 text-center">
                              Sin imagen
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5 flex-1 text-xs">
                        <h3 className="font-bold text-sm 2xl:text-base leading-tight mb-1">
                          {item_seleccionado.titulo || "Sin título"}
                        </h3>
                        <p>
                          <span className="font-semibold">Autor:</span>{" "}
                          {item_seleccionado.autor || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Tipología:</span>{" "}
                          {item_seleccionado.tipologia || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Fecha:</span>{" "}
                          {item_seleccionado.fecha || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Dimensiones:</span>{" "}
                          {item_seleccionado.dimensiones || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Descripción:</span>{" "}
                          {item_seleccionado.descripcion || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Notas:</span>{" "}
                          {item_seleccionado.notas || "N/A"}
                        </p>
                        <p>
                          <span className="font-semibold">Avalúo:</span>{" "}
                          {item_seleccionado.avaluo || "N/A"}
                        </p>
                        <div className="flex gap-2 mt-2">
                          {item_seleccionado.url && (
                            <Link
                              href={item_seleccionado.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="self-start bg-yellow-50 hover:bg-yellow-100 font-semibold py-1 px-2.5 rounded-lg shadow-sm text-xs transition"
                            >
                              Ver en Catarina ↗
                            </Link>
                          )}
                          <button
                            onClick={() => modalItemRef.current?.showModal()}
                            className="self-start bg-yellow-50 hover:bg-yellow-100 font-semibold py-1 px-2.5 rounded-lg shadow-sm text-xs transition"
                          >
                            Editar
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {item_seleccionado && (
                  <dialog ref={modalItemRef} className="modal">
                    <div className="modal-box w-11/12 max-w-2xl">
                      <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                          ✕
                        </button>
                      </form>
                      <EditForm
                        elemento={item_seleccionado}
                        close_modal={() => modalItemRef.current?.close()}
                        onUpdate={setItemSeleccionado}
                      />
                    </div>
                  </dialog>
                )}
              </>
            ) : (
              /* ── Modo búsqueda de items: sección 1 (30%) + sección 2 (70%) ── */
              <>
                {/* Sección 1 — Carpeta padre (30%) */}
                <div className="h-[30%] flex flex-col overflow-hidden">
                  <LoadingZone
                    state={fetchState}
                    error={errorMsg}
                    minHeight="h-full"
                  >
                    {carpeta_seleccionada && (
                      <div className="flex gap-3 h-full">
                        <img
                          className="w-12 h-12 2xl:w-16 2xl:h-16 object-contain shrink-0"
                          src="/xmlibris/carpeta.png"
                          alt="Carpeta"
                        />
                        <div className="flex flex-col flex-1 min-w-0 justify-between overflow-hidden">
                          <div>
                            {/* Pill indicando que es contexto de la búsqueda */}
                            <span className="inline-block text-xs bg-[#e8c97a]/40 px-2 py-0.5 rounded-full mb-1">
                              Carpeta padre
                            </span>
                            <h2 className="font-bold text-sm 2xl:text-base leading-tight truncate">
                              {carpeta_seleccionada.nombre_expediente}
                            </h2>
                            <div className="mt-1 space-y-0.5">
                              <p className="text-xs truncate">
                                <span className="font-medium">Ubicación:</span>{" "}
                                {carpeta_seleccionada.ubicacion_fisica}
                              </p>
                              <p className="text-xs">
                                <span className="font-medium">
                                  Total items:
                                </span>{" "}
                                {carpeta_seleccionada.items.length}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            {carpeta_seleccionada.url && (
                              <Link
                                href={carpeta_seleccionada.url}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <button className="bg-yellow-50 hover:bg-yellow-100 text-[#4E4942] font-semibold py-1 px-2.5 rounded-lg shadow-sm text-xs transition">
                                  Ver en Catarina ↗
                                </button>
                              </Link>
                            )}
                            <button
                              onClick={() =>
                                modalCarpetaRef.current?.showModal()
                              }
                              className="bg-yellow-50 hover:bg-yellow-100 text-[#4E4942] font-semibold py-1 px-2.5 rounded-lg shadow-sm text-xs transition"
                            >
                              Ver carpeta completa
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </LoadingZone>
                </div>

                <div className="flex-none h-px bg-yellow-50 my-2 2xl:my-3" />

                {/* Sección 2 — Detalle del item seleccionado (70%) */}
                <div className="h-[70%] flex flex-col overflow-hidden">
                  {!itemBusquedaSeleccionado ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-xs text-gray-400">
                        Selecciona un item para ver sus detalles
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col h-full overflow-y-auto">
                      <div className="flex gap-3 2xl:gap-5">
                        <div className="shrink-0">
                          {itemBusquedaSeleccionado.imagen_url ? (
                            <img
                              src={itemBusquedaSeleccionado.imagen_url}
                              alt={itemBusquedaSeleccionado.titulo}
                              className="w-24 h-24 2xl:w-32 2xl:h-32 object-cover rounded-lg shadow"
                            />
                          ) : (
                            <div className="w-24 h-24 2xl:w-32 2xl:h-32 bg-yellow-50 rounded-lg shadow flex items-center justify-center">
                              <svg
                                className="w-8 h-8 text-[#4E4942]/20"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5 flex-1 text-xs">
                          <h3 className="font-bold text-sm 2xl:text-base leading-tight mb-1">
                            {itemBusquedaSeleccionado.titulo || "Sin título"}
                          </h3>
                          <p>
                            <span className="font-semibold">Autor:</span>{" "}
                            {itemBusquedaSeleccionado.autor || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">Tipología:</span>{" "}
                            {itemBusquedaSeleccionado.tipologia || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">Fecha:</span>{" "}
                            {itemBusquedaSeleccionado.fecha || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">Dimensiones:</span>{" "}
                            {itemBusquedaSeleccionado.dimensiones || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">Descripción:</span>{" "}
                            {itemBusquedaSeleccionado.descripcion || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">Notas:</span>{" "}
                            {itemBusquedaSeleccionado.notas || "N/A"}
                          </p>
                          <p>
                            <span className="font-semibold">Avalúo:</span>{" "}
                            {itemBusquedaSeleccionado.avaluo || "N/A"}
                          </p>
                          {itemBusquedaSeleccionado.numero_inventario > 0 && (
                            <p>
                              <span className="font-semibold">Inventario:</span>{" "}
                              {itemBusquedaSeleccionado.numero_inventario}
                            </p>
                          )}
                          <div className="flex gap-2 mt-2">
                            {itemBusquedaSeleccionado.url && (
                              <Link
                                href={itemBusquedaSeleccionado.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="self-start bg-yellow-50 hover:bg-yellow-100 font-semibold py-1 px-2.5 rounded-lg shadow-sm text-xs transition"
                              >
                                Ver en Catarina ↗
                              </Link>
                            )}
                            <button
                              onClick={() => modalItemRef.current?.showModal()}
                              className="self-start bg-yellow-50 hover:bg-yellow-100 font-semibold py-1 px-2.5 rounded-lg shadow-sm text-xs transition"
                            >
                              Editar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {itemBusquedaSeleccionado && (
                  <dialog ref={modalItemRef} className="modal">
                    <div className="modal-box w-11/12 max-w-2xl">
                      <form method="dialog">
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                          ✕
                        </button>
                      </form>
                      <EditForm
                        elemento={itemBusquedaSeleccionado}
                        close_modal={() => modalItemRef.current?.close()}
                        onUpdate={setItemBusquedaSeleccionado}
                      />
                    </div>
                  </dialog>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
