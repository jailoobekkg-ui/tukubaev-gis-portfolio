"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";

/** Theme switch for the admin area, which has no site I18nProvider. */
export function ThemeToggleStandalone() {
  const [dark, setDark] = useState(true);
  useEffect(() => setDark(document.documentElement.classList.contains("dark")), []);
  return (
    <button
      type="button"
      aria-label="Тема"
      className="rounded-lg p-2 text-muted hover:text-accent"
      onClick={() => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
        try {
          localStorage.setItem("theme", next ? "dark" : "light");
        } catch {
          /* storage unavailable */
        }
      }}
    >
      <Icon name={dark ? "sun" : "moon"} />
    </button>
  );
}
