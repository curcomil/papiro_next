"use client";

import { useState } from "react";
import { FormCard } from "../components/FormCard";
import { CampoCheckbox, CampoSelect } from "@/modules/metadatos/presentation/components/Campos";
import type { OpcionSelect } from "@/modules/metadatos/presentation/components/Campos";
import type { ColeccionPadre } from "../../domain/coleccion-padre";
import {
  CAMPO_PORTADA,
  camposInhabilitados,
} from "@/modules/metadatos/domain/campo-metadato";
import type {
  ValorMetadato,
  ValoresMetadatos,
} from "@/modules/metadatos/domain/campo-metadato";
import type { TipoFormularioInfo } from "../../domain/tipo-formulario";
import { useColeccionDetalle } from "@/modules/metadatos/presentation/use-coleccion-detalle";
import { useCrearRegistro } from "../use-crear-registro";
import ArchivoSection from "./ArchivoSection";
import MetadatosSection from "@/modules/metadatos/presentation/components/MetadatosSection";

const LEYENDA =
  "fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest";

const EXTENSIONES_LIBRO = [".zip"];
const EXTENSIONES_SUELTAS = [".jpg", ".jpeg", ".png", ".pdf"];

interface Props {
  info: TipoFormularioInfo;
  colecciones: ColeccionPadre[];
  errorCarga: string;
}

export default function RegistroForm({
  info,
  colecciones,
  errorCarga,
}: Props) {
  const [coleccionId, setColeccionId] = useState("");
  const [subcoleccionId, setSubcoleccionId] = useState("");
  const [esLibro, setEsLibro] = useState(true);
  const [esOtro, setEsOtro] = useState(false);
  const [valoresMetadatos, setValoresMetadatos] = useState<ValoresMetadatos>(
    {},
  );
  const [intentado, setIntentado] = useState(false);
  const [archivo, setArchivo] = useState<File | null>(null);
  const [errorArchivo, setErrorArchivo] = useState("");

  const { crearRegistro, progreso, enviando, cancelar } = useCrearRegistro();

  const estadoMetadatos = useColeccionDetalle(coleccionId, subcoleccionId);

  // En "Otro" la portada no se escribe: es el nombre del archivo cargado. Solo
  // se envía si el schema de la colección declara el campo, porque la API
  // valida `metadata` con extra="forbid" y rechazaría la clave sobrante.
  const campoPortada =
    estadoMetadatos.tipo === "success"
      ? estadoMetadatos.schema.find((campo) => campo.campo === CAMPO_PORTADA)
      : undefined;

  const portadaDelArchivo: ValorMetadato | undefined =
    esOtro && archivo && campoPortada
      ? campoPortada.esMultiple
        ? [archivo.name]
        : archivo.name
      : undefined;

  /** Lo que se pinta y se envía: la portada derivada pisa lo capturado. */
  const valoresMostrados: ValoresMetadatos =
    portadaDelArchivo === undefined
      ? valoresMetadatos
      : { ...valoresMetadatos, [CAMPO_PORTADA]: portadaDelArchivo };

  const opcionesColeccion: OpcionSelect[] = colecciones.map((coleccion) => ({
    value: coleccion.internalId,
    label: coleccion.nombre,
  }));

  const subcolecciones =
    colecciones.find((coleccion) => coleccion.internalId === coleccionId)
      ?.subcolecciones ?? [];

  const opcionesSubcoleccion: OpcionSelect[] = subcolecciones.map((sub) => ({
    value: sub.internalId,
    label: sub.nombre,
  }));

  /** Al cambiar de colección el catálogo de subcolecciones y el schema cambian,
   *  así que se descarta la selección y lo ya capturado. */
  const seleccionarColeccion = (id: string) => {
    setColeccionId(id);
    setSubcoleccionId("");
    setValoresMetadatos({});
  };

  /** Si el schema no declara "portada", limpiarla añadiría una clave extra que
   *  la API rechaza con 422. */
  const limpiarPortada = () => {
    if (!campoPortada) return;
    setValoresMetadatos((prev) => ({ ...prev, [CAMPO_PORTADA]: "" }));
  };

  /** El tipo de registro decide qué archivo se admite: al cambiarlo se descarta. */
  const limpiarArchivo = () => {
    setArchivo(null);
    setErrorArchivo("");
  };

  const seleccionarArchivo = (nuevo: File | null) => {
    setErrorArchivo("");

    if (!nuevo) {
      setArchivo(null);
      return;
    }

    const extension = `.${nuevo.name.split(".").pop()?.toLowerCase() ?? ""}`;
    const permitidas = esLibro ? EXTENSIONES_LIBRO : EXTENSIONES_SUELTAS;

    if (!permitidas.includes(extension)) {
      setArchivo(null);
      setErrorArchivo(
        esLibro
          ? "El libro debe ser un archivo .zip."
          : "El archivo debe ser .jpg, .jpeg, .png o .pdf.",
      );
      return;
    }

    setArchivo(nuevo);
  };

  /** Los dos checks son excluyentes: marcar uno desmarca el otro. */
  const marcarLibro = (marcado: boolean) => {
    setEsLibro(marcado);
    if (marcado) {
      setEsOtro(false);
    } else {
      // "portada" solo aplica a libros: al dejar de serlo se descarta lo capturado.
      limpiarPortada();
    }
    limpiarArchivo();
  };

  const marcarOtro = (marcado: boolean) => {
    setEsOtro(marcado);
    if (marcado) {
      setEsLibro(false);
      limpiarPortada();
    }
    limpiarArchivo();
  };

  const errorValidacion = !coleccionId
    ? "Selecciona una colección."
    : !subcoleccionId
      ? "Selecciona una subcolección."
      : !esLibro && !esOtro
        ? "Indica el tipo de registro: Libro u Otro."
        : !archivo
          ? esLibro
            ? "Adjunta el ZIP del libro."
            : "Adjunta el archivo del registro."
          : "";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIntentado(true);

    if (errorValidacion || enviando) return;

    const coleccion = colecciones.find(
      (item) => item.internalId === coleccionId,
    );
    const subcoleccion = coleccion?.subcolecciones.find(
      (item) => item.internalId === subcoleccionId,
    );

    if (!coleccion || !subcoleccion) return;

    await crearRegistro(
      { coleccion, subcoleccion, libro: esLibro, metadata: valoresMostrados },
      archivo,
    );
  };

  return (
    <FormCard titulo={info.tituloFormulario} descripcion={info.descripcion}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CampoSelect
            label="Colección"
            value={coleccionId}
            onChange={seleccionarColeccion}
            opciones={opcionesColeccion}
            placeholder="Selecciona una colección"
          />
          <CampoSelect
            label="Subcolección"
            value={subcoleccionId}
            onChange={setSubcoleccionId}
            opciones={opcionesSubcoleccion}
            placeholder={
              coleccionId
                ? "Selecciona una subcolección"
                : "Elige una colección primero"
            }
            disabled={!coleccionId}
          />
        </div>

        {coleccionId && subcolecciones.length === 0 && (
          <p className="home text-xs font-light text-base-content/50">
            Esta colección no tiene subcolecciones.
          </p>
        )}

        {errorCarga && (
          <p className="home text-xs font-light text-error">{errorCarga}</p>
        )}

        <hr className="border-t border-primary/20" />

        <fieldset className="fieldset">
          <legend className={LEYENDA}>
            Tipo de registro
            <span className="text-error" aria-hidden="true">
              {" *"}
            </span>
          </legend>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2 pt-1">
            <CampoCheckbox
              label="Libro"
              checked={esLibro}
              onChange={marcarLibro}
            />
            <CampoCheckbox
              label="Otro"
              checked={esOtro}
              onChange={marcarOtro}
            />
          </div>
        </fieldset>

        <hr className="border-t border-primary/20" />

        <ArchivoSection
          libro={esLibro}
          archivo={archivo}
          onArchivoChange={seleccionarArchivo}
          progreso={progreso}
          enviando={enviando}
          onCancelar={cancelar}
          error={errorArchivo}
        />

        <hr className="border-t border-primary/20" />

        <MetadatosSection
          key={coleccionId}
          estado={estadoMetadatos}
          valores={valoresMostrados}
          onChange={setValoresMetadatos}
          deshabilitados={camposInhabilitados(esLibro)}
        />

        <div className="sticky bottom-0 z-10 -mx-6 -mb-6 mt-2 flex flex-wrap items-center justify-between gap-3 rounded-b-box border-t border-primary/20 bg-base-100 px-6 py-4">
          {intentado && errorValidacion && (
            <p className="home text-sm font-light text-error">
              {errorValidacion}
            </p>
          )}
          <button
            type="submit"
            className="btn btn-primary btn-sm home font-normal ml-auto"
            disabled={enviando}
          >
            {enviando ? (
              <>
                <span className="loading loading-spinner loading-xs"></span>
                Enviando…
              </>
            ) : (
              "Crear registro"
            )}
          </button>
        </div>
      </form>
    </FormCard>
  );
}
