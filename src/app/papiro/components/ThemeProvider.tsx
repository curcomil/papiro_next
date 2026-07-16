"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "xmlibris" | "xmlibris-dark";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("xmlibris");

  // Restaurar preferencia guardada al montar
  useEffect(() => {
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved === "xmlibris" || saved === "xmlibris-dark") {
      setThemeState(saved);
    }
  }, []);

  // Persistir en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  const setTheme = (next: Theme) => setThemeState(next);

  const toggleTheme = () =>
    setThemeState((prev) =>
      prev === "xmlibris" ? "xmlibris-dark" : "xmlibris"
    );

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, isDark: theme === "xmlibris-dark", toggleTheme }}
    >
      <div data-theme={theme} className="min-h-screen">
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
