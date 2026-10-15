"use client";

import { useRef, useState } from "react";
import { FormCard } from "../components/FormCard";
import { CampoBooleano, CampoSelect, CampoTexto } from "../components/Campos";
import type { OpcionSelect } from "../components/Campos";
import {
  DUBLIN_CORE_NONE,
  LABEL_OTRO,
  etiquetaDeCampo,
  labelsDeCampo,
} from "../../domain/campo";
import { ORIGENES } from "../../domain/nueva-coleccion";
import {
  ETIQUETAS_DUBLIN_CORE,
  valorFijoVacio,
} from "../../domain/valores-fijos";
import type { ValorFijo } from "../../domain/valores-fijos";
import type { CampoSchema } from "../../domain/schema-coleccion";
import { campoSchemaVacio, hayCampoLleno } from "../../domain/schema-coleccion";
import { useCampos } from "../use-campos";
import { useCrearColeccion } from "../use-crear-coleccion";
import type { FormularioProps } from "./tipos";

const LEYENDA =
  "fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest";

const AGREGAR =
  "btn btn-ghost btn-xs home font-normal normal-case tracking-normal text-primary";

const OPCIONES_ORIGEN: OpcionSelect[] = ORIGENES.map((origen) => ({
  value: origen,
  label: origen,
}));

const OPCIONES_ETIQUETA: OpcionSelect[] = ETIQUETAS_DUBLIN_CORE.map(
  (etiqueta) => ({ value: etiqueta, label: etiqueta }),
);

export default function FormularioColeccion({ info }: FormularioProps) {
  const { campos, cargando, error: errorCampos } = useCampos();
  const { crearColeccion } = useCrearColeccion();
  const [titulo, setTitulo] = useState("");
  const [origen, setOrigen] = useState("");
  const [schema, setSchema] = useState<CampoSchema[]>([campoSchemaVacio(0)]);
  const [valoresFijos, setValoresFijos] = useState<ValorFijo[]>([
    valorFijoVacio(0),
  ]);
  const [intentado, setIntentado] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const nextId = useRef(1);
  const nextValorId = useRef(1);

  const schemaValido = hayCampoLleno(schema);

  // Mensaje derivado: se recalcula solo y desaparece en cuanto el campo se corrige.
  const errorValidacion = !origen
    ? "Selecciona un origen para la colección."
    : !schemaValido
      ? "El schema es obligatorio: captura al menos un campo completo."
      : "";

  const opcionesCampo: OpcionSelect[] = campos.map((item) => ({
    value: item.campo,
    label: item.campo,
  }));

  const actualizarFila = (id: number, cambios: Partial<CampoSchema>) =>
    setSchema((prev) =>
      prev.map((fila) => (fila.id === id ? { ...fila, ...cambios } : fila)),
    );

  /** Al cambiar de campo, el DC se re-resuelve y el label se limpia porque
   *  el catálogo de etiquetas es distinto para cada campo. */
  const seleccionarCampo = (id: number, campo: string) =>
    actualizarFila(id, {
      campo,
      dublinCore: etiquetaDeCampo(campos, campo) || DUBLIN_CORE_NONE,
      label: "",
      labelOtro: "",
    });

  const agregarFila = () =>
    setSchema((prev) => [...prev, campoSchemaVacio(nextId.current++)]);

  const eliminarFila = (id: number) =>
    setSchema((prev) => prev.filter((fila) => fila.id !== id));

  const actualizarValorFijo = (id: number, cambios: Partial<ValorFijo>) =>
    setValoresFijos((prev) =>
      prev.map((fila) => (fila.id === id ? { ...fila, ...cambios } : fila)),
    );

  const agregarValorFijo = () =>
    setValoresFijos((prev) => [...prev, valorFijoVacio(nextValorId.current++)]);

  const eliminarValorFijo = (id: number) =>
    setValoresFijos((prev) => prev.filter((fila) => fila.id !== id));

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIntentado(true);

    if (errorValidacion) return;

    setEnviando(true);
    const creada = await crearColeccion({
      titulo,
      origen,
      valoresFijos,
      schema,
    });

    // Si se creó, el hook ya navegó al panel y este componente se desmonta.
    if (!creada) setEnviando(false);
  };

  return (
    <FormCard titulo={info.tituloFormulario} descripcion={info.descripcion}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <CampoTexto
            label="Título"
            value={titulo}
            onChange={setTitulo}
            placeholder="Título de la colección"
            required
          />
          <CampoSelect
            label="Origen"
            value={origen}
            onChange={setOrigen}
            opciones={OPCIONES_ORIGEN}
            placeholder="Selecciona un origen"
          />
        </div>

        <fieldset className="fieldset">
          <legend className={LEYENDA}>
            <span>Schema</span>
            <button
              type="button"
              className={AGREGAR}
              onClick={agregarFila}
              aria-label="Agregar field al schema"
            >
              + Agregar field
            </button>
          </legend>

          {cargando && (
            <p className="home text-xs text-base-content/50 font-light">
              Cargando campos…
            </p>
          )}
          {!cargando && errorCampos && (
            <p className="home text-xs text-error font-light">{errorCampos}</p>
          )}

          <div className="flex flex-col gap-3">
            {schema.map((fila, index) => {
              const etiqueta = etiquetaDeCampo(campos, fila.campo);

              const opcionesDublinCore: OpcionSelect[] = [
                ...(etiqueta ? [{ value: etiqueta, label: etiqueta }] : []),
                { value: DUBLIN_CORE_NONE, label: "None" },
              ];

              const opcionesLabel: OpcionSelect[] = [
                ...labelsDeCampo(campos, fila.campo).map((item) => ({
                  value: item,
                  label: item,
                })),
                { value: LABEL_OTRO, label: "Otro" },
              ];

              return (
                <div
                  key={fila.id}
                  className="rounded-sm border border-primary/20 bg-base-200 p-4 flex flex-col gap-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                    <span className="home text-xs uppercase tracking-widest text-base-content/50">
                      Field {index + 1}
                    </span>
                    <div className="flex items-center gap-5">
                      <CampoBooleano
                        label="Múltiple"
                        checked={fila.multiple}
                        onChange={(valor) =>
                          actualizarFila(fila.id, { multiple: valor })
                        }
                      />
                      <CampoBooleano
                        label="Requerido"
                        checked={fila.requerido}
                        onChange={(valor) =>
                          actualizarFila(fila.id, { requerido: valor })
                        }
                      />
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        onClick={() => eliminarFila(fila.id)}
                        disabled={schema.length === 1}
                        aria-label={`Eliminar field ${index + 1}`}
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <CampoSelect
                      label="Campo"
                      value={fila.campo}
                      onChange={(valor) => seleccionarCampo(fila.id, valor)}
                      opciones={opcionesCampo}
                      placeholder="Selecciona un campo"
                    />
                    <CampoSelect
                      label="Dublin Core"
                      value={fila.dublinCore}
                      onChange={(valor) =>
                        actualizarFila(fila.id, { dublinCore: valor })
                      }
                      opciones={opcionesDublinCore}
                      // Con campo elegido el valor ya viene resuelto (etiqueta o None).
                      placeholder={fila.campo ? undefined : "Elige un campo"}
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <CampoSelect
                      label="Label"
                      value={fila.label}
                      onChange={(valor) =>
                        actualizarFila(fila.id, {
                          label: valor,
                          // Al salir de "Otro" se descarta el texto libre.
                          labelOtro: valor === LABEL_OTRO ? fila.labelOtro : "",
                        })
                      }
                      opciones={opcionesLabel}
                      placeholder="Selecciona una etiqueta"
                    />

                    {fila.label === LABEL_OTRO && (
                      <CampoTexto
                        label="Otro label"
                        value={fila.labelOtro}
                        onChange={(valor) =>
                          actualizarFila(fila.id, { labelOtro: valor })
                        }
                        placeholder="Escribe la etiqueta"
                        required
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </fieldset>

        <fieldset className="fieldset">
          <legend className={LEYENDA}>
            <span>Valores fijos</span>
            <button
              type="button"
              className={AGREGAR}
              onClick={agregarValorFijo}
              aria-label="Agregar valor fijo"
            >
              + Agregar valor
            </button>
          </legend>

          <div className="flex flex-col gap-3">
            {valoresFijos.map((fila, index) => (
              <div
                key={fila.id}
                className="rounded-sm border border-primary/20 bg-base-200 p-4 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="home text-xs uppercase tracking-widest text-base-content/50">
                    Valor {index + 1}
                  </span>
                  <button
                    type="button"
                    className="btn btn-ghost btn-xs"
                    onClick={() => eliminarValorFijo(fila.id)}
                    disabled={valoresFijos.length === 1}
                    aria-label={`Eliminar valor ${index + 1}`}
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <CampoSelect
                    label="Dublin Core"
                    value={fila.etiqueta}
                    onChange={(valor) =>
                      actualizarValorFijo(fila.id, { etiqueta: valor })
                    }
                    opciones={OPCIONES_ETIQUETA}
                    placeholder="Selecciona una etiqueta"
                  />
                  <CampoTexto
                    label="Valor por defecto"
                    value={fila.valor}
                    onChange={(valor) => actualizarValorFijo(fila.id, { valor })}
                    placeholder="Valor que se exportará"
                  />
                </div>
              </div>
            ))}
          </div>
        </fieldset>

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
              <span className="loading loading-spinner loading-xs" />
            ) : (
              "Crear colección"
            )}
          </button>
        </div>
      </form>
    </FormCard>
  );
}
