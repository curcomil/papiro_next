"use client";

import { useCallback, useSyncExternalStore } from "react";

// La URL se trata como store externo: se lee con `useSyncExternalStore` (el
// snapshot del servidor evita el desajuste de hidratación) y se escribe con
// `pushState`, que no notifica por sí solo: de ahí el evento propio.

const PARAM = "s";
const URL_CHANGED_EVENT = "papiro:sectionchange";

function subscribe(onUrlChange: () => void) {
  window.addEventListener("popstate", onUrlChange);
  window.addEventListener(URL_CHANGED_EVENT, onUrlChange);
  return () => {
    window.removeEventListener("popstate", onUrlChange);
    window.removeEventListener(URL_CHANGED_EVENT, onUrlChange);
  };
}

function readSectionFromUrl(): string | null {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(PARAM);
}

export function useSectionParam(
  validSections: readonly string[],
  fallback: string,
): [string, (section: string) => void] {
  const section = useSyncExternalStore(
    subscribe,
    () => {
      const current = readSectionFromUrl();
      return current && validSections.includes(current) ? current : fallback;
    },
    () => fallback,
  );

  const navigate = useCallback((next: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set(PARAM, next);
    window.history.pushState(null, "", `?${params.toString()}`);
    window.dispatchEvent(new Event(URL_CHANGED_EVENT));
  }, []);

  return [section, navigate];
}
