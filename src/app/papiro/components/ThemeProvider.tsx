"use client";

import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"xmlibris" | "xmlibris-dark">("xmlibris");

  useEffect(() => {
    const saved = localStorage.getItem("theme") as
      | "xmlibris"
      | "xmlibris-dark"
      | null;
    if (saved) setTheme(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div data-theme={theme} className="min-h-screen">
      {children}
    </div>
  );
}
