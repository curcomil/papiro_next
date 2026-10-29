"use client";

import { useState } from "react";
import type {
  CampoMetadato,
  ValoresMetadatos,
} from "../../domain/campo-metadato";
import {
  agruparParaClasificar,
  CAMPO_PORTADA,
  listaDe,
  valorDe,
} from "../../domain/campo-metadato";
import { CampoTextarea, CampoTexto, Etiqueta } from "../components/Campos";
import type { EstadoMetadatos } from "../use-coleccion-detalle";

const LEYENDA =
  "fieldset-legend home text-xs font-normal text-base-content/50 uppercase tracking-widest";

const DESHABILITADO =
  "disabled:cursor-not-allowed disabled:bg-base-200 disabled:opacity-50";

const REJILLA =
  "grid grid-cols-1 gap-x-5 gap-y-5 md:grid-cols-2 xl:grid-cols-3";

interface Props {
  estado: EstadoMetadatos;
  valores: ValoresMetadatos;
  onChange: (valores: ValoresMetadatos) => void;
  /** Claves de `campo` que deben quedar inhabilitadas. */
  deshabilitados?: readonly string[];
}

export default function MetadatosSection({
  estado,
  valores,
  onChange,
  deshabilitados = [],
}: Props) {
  // RegistroForm remonta la sección con `key={coleccionId}`, así que esto
  // vuelve a false al cambiar de colección sin necesidad de un efecto.
  const [clasificado, setClasificado] = useState(false);

  const campos = estado.tipo === "success" ? estado.schema : [];

  // Primero solo lo indispensable: obligatorios + portada. El resto se revela
  // con "Clasificar" para no abrumar de entrada.
  const iniciales = [
    ...campos.filter((campo) => campo.requerido),
    ...campos.filter(
      (campo) => !campo.requerido && campo.campo === CAMPO_PORTADA,
    ),
  ];
  const adicionales = campos.filter(
    (campo) => !campo.requerido && campo.campo !== CAMPO_PORTADA,
  );
  const { textos, textareas, multiples } = agruparParaClasificar(adicionales);

  const renderizar = (campo: CampoMetadato) => (
    <CampoDeMetadato
      key={campo.campo}
      campo={campo}
      valores={valores}
      onChange={onChange}
      deshabilitado={deshabilitados.includes(campo.campo)}
    />
  );

  return (
    <fieldset
      className="fieldset"
      aria-disabled={estado.tipo !== "success"}
      aria-busy={estado.tipo === "loading"}
    >
      <legend className={LEYENDA}>
        <span>Metadatos</span>
        {estado.tipo === "success" && estado.schema.length > 0 && (
          <span className="home text-xs font-normal normal-case tracking-normal text-base-content/40">
            {estado.schema.length} campos
          </span>
        )}
      </legend>

      {estado.tipo === "idle" && (
        <p className="home py-6 text-sm font-light text-base-content/50">
          Selecciona la Colección y Subcolección para continuar...
        </p>
      )}

      {estado.tipo === "loading" && (
        <div className="flex justify-center py-10">
          <span className="loading loading-bars loading-xl"></span>
        </div>
      )}

      {estado.tipo === "error" && (
        <p className="home py-6 text-sm font-light text-error">
          {estado.message}
          {estado.status > 0 ? ` (status ${estado.status})` : null}
        </p>
      )}

      {estado.tipo === "success" &&
        (campos.length === 0 ? (
          <p className="home py-6 text-sm font-light text-base-content/50">
            Esta colección no tiene schema definido.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            <div className={REJILLA}>{iniciales.map(renderizar)}</div>

            {adicionales.length > 0 && (
              <div>
                <button
                  type="button"
                  className="btn btn-outline btn-primary btn-sm home font-normal"
                  onClick={() => setClasificado((valor) => !valor)}
                  aria-expanded={clasificado}
                >
                  {clasificado ? "Ocultar" : "Clasificar"}
                </button>
              </div>
            )}

            {clasificado && (
              <>
                {textos.length > 0 && (
                  <div className={REJILLA}>{textos.map(renderizar)}</div>
                )}
                {textareas.length > 0 && (
                  <div className={REJILLA}>{textareas.map(renderizar)}</div>
                )}
                {multiples.length > 0 && (
                  <div className={REJILLA}>{multiples.map(renderizar)}</div>
                )}
              </>
            )}
          </div>
        ))}
    </fieldset>
  );
}

interface CampoProps {
  campo: CampoMetadato;
  valores: ValoresMetadatos;
  onChange: (valores: ValoresMetadatos) => void;
  deshabilitado: boolean;
}

function CampoDeMetadato({
  campo,
  valores,
  onChange,
  deshabilitado,
}: CampoProps) {
  const valor = valorDe(valores, campo);
  const esTextarea = campo.tipoInput === "textarea";

  if (!campo.esMultiple) {
    const texto = typeof valor === "string" ? valor : (valor[0] ?? "");
    const cambiar = (nuevo: string) =>
      onChange({ ...valores, [campo.campo]: nuevo });

    return esTextarea ? (
      <CampoTextarea
        label={campo.label}
        value={texto}
        onChange={cambiar}
        required={campo.requerido}
        disabled={deshabilitado}
      />
    ) : (
      <CampoTexto
        label={campo.label}
        value={texto}
        onChange={cambiar}
        required={campo.requerido}
        disabled={deshabilitado}
      />
    );
  }

  const lista = listaDe(valor);

  const actualizar = (indice: number, nuevo: string) => {
    const siguiente = [...lista];
    siguiente[indice] = nuevo;
    onChange({ ...valores, [campo.campo]: siguiente });
  };

  const agregar = () => onChange({ ...valores, [campo.campo]: [...lista, ""] });

  const eliminar = (indice: number) =>
    onChange({
      ...valores,
      [campo.campo]: lista.filter((_, i) => i !== indice),
    });

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <Etiqueta required={campo.requerido}>{campo.label}</Etiqueta>
        <button
          type="button"
          className="btn btn-ghost btn-xs home font-normal normal-case text-primary"
          onClick={agregar}
          disabled={deshabilitado}
        >
          + Agregar
        </button>
      </div>

      {lista.map((texto, indice) => (
        // El required solo se exige en el primer renglón: basta con al menos uno.
        <div key={indice} className="flex items-start gap-2">
          {esTextarea ? (
            <textarea
              className={`textarea w-full home font-light text-sm ${DESHABILITADO}`}
              value={texto}
              onChange={(event) => actualizar(indice, event.target.value)}
              required={campo.requerido && indice === 0}
              rows={3}
              disabled={deshabilitado}
            />
          ) : (
            <input
              type="text"
              className={`input w-full home font-light text-sm ${DESHABILITADO}`}
              value={texto}
              onChange={(event) => actualizar(indice, event.target.value)}
              required={campo.requerido && indice === 0}
              disabled={deshabilitado}
            />
          )}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => eliminar(indice)}
            disabled={deshabilitado || lista.length === 1}
            aria-label={`Eliminar ${campo.label} ${indice + 1}`}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
