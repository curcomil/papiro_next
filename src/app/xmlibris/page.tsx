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
  const [carpeta_seleccionada, setCarpetaSeleccionada] =
    useState<Carpeta | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [item_seleccionado, setItemSeleccionado] = useState<Item | null>(null);
  const [fetchState, setFetchState] = useState<FetchState>("loading");
  const [itemsFetchState, setItemsFetchState] = useState<FetchState>("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");

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
  const [filtroActivo, setFiltroActivo] = useState<string>("");
  const filterFormRef = useRef<HTMLFormElement>(null);

  const handleSearch = () => {
    const filtro_final = !filtroActivo
      ? filter.nombre === "carpeta"
        ? "nombre_expediente_normalizado"
        : "titulo"
      : filtroActivo;

    const payload = { type: filter.nombre, query, filtro: filtro_final };
    console.log(payload);

    setFetchState("loading");
    amcService
      .findbyfilter(payload)
      .then((data) => {
        setCarpetas(data.resultado);
        setCarpetaSeleccionada(data.resultado[0] ?? null);
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
    if (!carpeta_seleccionada) return;
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

  // ─────────────────────────────────────────────
  // Subcomponente: zona dinámica con estado
  // ─────────────────────────────────────────────
  const LoadingZone = ({
    children,
    state,
    error,
  }: {
    children: React.ReactNode;
    state: FetchState;
    error?: string;
  }) => {
    if (state === "loading") {
      return (
        <div className="flex-1 flex items-center justify-center">
          <span className="loading loading-ring loading-xl"></span>
          <h1>Cargando...</h1>
        </div>
      );
    }
    if (state === "error") {
      return (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <p className="text-red-500 font-semibold">Error al cargar datos</p>
          {error && <p className="text-sm text-gray-500">{error}</p>}
          <button
            onClick={() => window.location.reload()}
            className="bg-yellow-50 hover:bg-yellow-100 font-bold py-2 px-6 rounded-lg shadow text-sm"
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
        <h1 className="text-center mt-10">Hola mundo xmlibris "mobile"</h1>
      ) : (
        <div className="grid grid-cols-2 h-full">
          {/* ── Panel izquierdo ── */}
          <div className="flex flex-col h-full p-6 overflow-hidden">
            <div className="flex-none flex justify-between items-center">
              <h1 className="font-bold text-3xl">Carpetas</h1>
              <button type="button" className="text-lg hover:cursor-pointer">
                Cerrar sesión
              </button>
            </div>

            {/* Form 1 — búsqueda */}
            <div className="grid grid-cols-2 justify-between">
              <form
                className="flex-none flex items-center gap-3 mt-4"
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
                  className="focus:ring-2 focus:ring-[#F9E6C5] w-full rounded-lg p-2 bg-yellow-50 shadow"
                />
                <button type="submit" className="hidden" />
              </form>

              {/* Toggle */}
              <div className="flex-none flex items-center gap-2 ml-3 mt-4">
                <input
                  type="checkbox"
                  className="toggle toggle-lg"
                  onChange={(e) => {
                    const nuevoFiltro = e.target.checked ? item : carpeta;
                    setFilter(nuevoFiltro);
                    setFiltroActivo("");
                    setQuery("");
                    filterFormRef.current?.reset();
                  }}
                />
                <span>Buscar item</span>
              </div>
            </div>

            {/* Form 2 — filtros */}
            <h2 className="font-bold mt-3 text-lg">Filtros:</h2>
            <form
              ref={filterFormRef}
              className="filter flex-none mt-3"
              onSubmit={(e) => e.preventDefault()}
            >
              <div className={`btn btn-primary ${filtroActivo && "hidden"}`}>
                {filter?.nombre === "carpeta"
                  ? "Nombre de la carpeta"
                  : "Título"}
              </div>
              <input
                className="btn btn-square"
                type="reset"
                value="×"
                title="Limpiar filtro"
                onClick={() => setFiltroActivo("")}
              />
              {filter.filtros.map((f: any) => (
                <input
                  key={f.value}
                  className="btn"
                  type="radio"
                  name="filtro"
                  value={f.value}
                  aria-label={f.label}
                  onChange={() => setFiltroActivo(f.value)}
                />
              ))}
            </form>

            {/* ── Zona dinámica: lista de carpetas ── */}
            <LoadingZone state={fetchState} error={errorMsg}>
              <div className="flex-1 min-h-0 overflow-y-auto mt-4 pr-2">
                <div className="container_carpetas grid grid-cols-4 gap-3">
                  {carpetas.map((carpeta) => (
                    <div
                      key={carpeta._id}
                      onClick={() => setCarpetaSeleccionada(carpeta)}
                      className={`hover:cursor-pointer rounded-lg shadow p-4 hover:shadow-md transition flex flex-col items-center justify-between
                        ${carpeta._id === carpeta_seleccionada?._id ? "bg-[#f8ddae]" : "bg-yellow-50"}
                      `}
                    >
                      <img
                        src="/xmlibris/carpeta.png"
                        alt="Carpeta"
                        className="w-24 mb-4"
                      />
                      <h2 className="font-bold text-lg text-center">
                        {carpeta.nombre_expediente}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {carpeta.items.length} items
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </LoadingZone>
          </div>

          {/* ── Panel derecho ── */}
          <div className="bg-[#f8ddae] h-full p-6 flex flex-col overflow-hidden">
            {/* Sección 1 — Detalle carpeta */}
            <LoadingZone state={fetchState} error={errorMsg}>
              {carpeta_seleccionada && (
                <>
                  <div className="flex-none flex items-start justify-between">
                    <div className="flex items-center">
                      <img
                        className="w-20"
                        src="/xmlibris/carpeta.png"
                        alt="Carpeta"
                      />
                      <div className="flex flex-col ml-4">
                        <h1 className="font-bold text-2xl">
                          {carpeta_seleccionada.nombre_expediente}
                        </h1>
                        <p className="text-sm mt-1">
                          Ubicación: {carpeta_seleccionada.ubicacion_fisica}
                        </p>
                        <p className="text-sm">
                          Referencia:{" "}
                          {carpeta_seleccionada.referencia_control || "N/A"}
                        </p>
                        <p className="text-sm">
                          Notas: {carpeta_seleccionada.notas || "N/A"}
                        </p>
                        <p className="text-sm">
                          Palabras clave:{" "}
                          {carpeta_seleccionada.keywords?.join(", ") || "N/A"}
                        </p>
                        <p className="text-sm">
                          Total items: {carpeta_seleccionada.items.length}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0 ml-4">
                      {carpeta_seleccionada.url && (
                        <Link
                          href={carpeta_seleccionada.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <button className="bg-yellow-50 hover:bg-yellow-100 text-black font-bold py-2 px-4 rounded-lg shadow text-sm">
                            Ver en Catarina
                          </button>
                        </Link>
                      )}
                      <button
                        onClick={() => modalCarpetaRef.current?.showModal()}
                        className="bg-yellow-50 hover:bg-yellow-100 text-black font-bold py-2 px-4 rounded-lg shadow text-sm"
                      >
                        Editar
                      </button>
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

            {/* Separador 1 */}
            <div className="flex-none h-px bg-yellow-50 my-4" />

            {/* Sección 2 — Items */}
            <div className="flex-none">
              <h2 className="font-semibold mb-3">
                Items
                {itemsFetchState === "success" && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    {items.length} encontrados
                  </span>
                )}
              </h2>
            </div>

            <div className="flex-none h-75 overflow-y-auto pr-1">
              <LoadingZone state={itemsFetchState}>
                <>
                  {items.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-sm text-gray-400">
                        Esta carpeta no tiene items
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {items.map((item) => (
                        <div
                          key={item._id}
                          onClick={() => setItemSeleccionado(item)}
                          className={`hover:cursor-pointer rounded-lg p-3 shadow-sm hover:shadow-md transition flex flex-col gap-1
                            ${item._id === item_seleccionado?._id ? "bg-[#F9E6C5]" : "bg-yellow-50"}
                          `}
                        >
                          <p className="text-sm font-bold truncate">
                            {item.titulo || "Sin título"}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {item.tipologia || "—"}
                          </p>
                          <p className="text-xs text-gray-400 truncate">
                            {item.autor || "—"}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              </LoadingZone>
            </div>

            {/* Separador 2 */}
            <div className="flex-none h-px bg-yellow-50 my-4" />

            {/* Sección 3 — Detalle item */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              {!item_seleccionado ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-gray-400">
                    Selecciona un item para ver sus detalles
                  </p>
                </div>
              ) : (
                <div className="flex gap-6">
                  <div className="shrink-0 w-32">
                    {item_seleccionado.imagen_url ? (
                      <img
                        src={item_seleccionado.imagen_url}
                        alt={item_seleccionado.titulo}
                        className="w-32 h-32 object-cover rounded-lg shadow"
                      />
                    ) : (
                      <div className="w-32 h-32 bg-yellow-50 rounded-lg shadow flex items-center justify-center">
                        <p className="text-xs text-gray-400 text-center">
                          Sin imagen
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-1 flex-1 text-sm">
                    <h2 className="font-bold text-lg leading-tight">
                      {item_seleccionado.titulo || "Sin título"}
                    </h2>
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
                          className="self-start bg-yellow-50 hover:bg-yellow-100 font-bold py-1.5 px-4 rounded-lg shadow text-xs"
                        >
                          Ver en Catarina
                        </Link>
                      )}
                      <button
                        onClick={() => modalItemRef.current?.showModal()}
                        className="self-start bg-yellow-50 hover:bg-yellow-100 text-black font-bold py-1.5 px-4 rounded-lg shadow text-xs"
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
          </div>
        </div>
      )}
    </div>
  );
}
