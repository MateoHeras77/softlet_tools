"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const themes = [
  { name: "Midnight", bg: "#1e1e2e", text: "#cdd6f4", card: "#282840", border: "#3b3b5c" },
  { name: "Forest", bg: "#1e2e2a", text: "#c8d6d0", card: "#283b34", border: "#3b5c4e" },
  { name: "Plum", bg: "#2a1e2e", text: "#d6c8d6", card: "#382840", border: "#5c3b5c" },
  { name: "Ocean", bg: "#1e2636", text: "#c8d4e0", card: "#283348", border: "#3b4f6e" },
  { name: "Ember", bg: "#2e2420", text: "#d6cec8", card: "#403028", border: "#5c483b" },
] as const;

const STORAGE_KEY = "softlet-bg-theme";

export function ThemeSelector() {
  const [activeTheme, setActiveTheme] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      const idx = parseInt(saved, 10);
      if (idx >= 0 && idx < themes.length) {
        setActiveTheme(idx);
        applyTheme(idx);
      }
    } else {
      applyTheme(0);
    }
  }, []);

  function applyTheme(idx: number) {
    const theme = themes[idx];
    const root = document.documentElement;
    root.style.setProperty("--background", theme.bg);
    root.style.setProperty("--foreground", theme.text);
    root.style.setProperty("--card", theme.card);
    root.style.setProperty("--card-foreground", theme.text);
    root.style.setProperty("--popover", theme.card);
    root.style.setProperty("--popover-foreground", theme.text);
    root.style.setProperty("--muted", theme.card);
    root.style.setProperty("--muted-foreground", theme.text + "aa");
    root.style.setProperty("--accent", theme.card);
    root.style.setProperty("--accent-foreground", theme.text);
    root.style.setProperty("--border", theme.border);
    root.style.setProperty("--input", theme.border);
    root.style.setProperty("--sidebar", theme.card);
    root.style.setProperty("--sidebar-foreground", theme.text);
    root.style.setProperty("--sidebar-accent", theme.border);
    root.style.setProperty("--sidebar-accent-foreground", theme.text);
    root.style.setProperty("--sidebar-border", theme.border);
  }

  function selectTheme(idx: number) {
    setActiveTheme(idx);
    applyTheme(idx);
    localStorage.setItem(STORAGE_KEY, String(idx));
  }

  return (
    <div className="flex items-center gap-2">
      {themes.map((theme, idx) => (
        <button
          key={theme.name}
          title={theme.name}
          onClick={() => selectTheme(idx)}
          className={cn(
            "h-8 w-8 md:h-6 md:w-6 rounded-full border-2 transition-all hover:scale-110",
            activeTheme === idx
              ? "border-white scale-110 ring-2 ring-white/30"
              : "border-transparent opacity-70 hover:opacity-100"
          )}
          style={{ backgroundColor: theme.bg }}
        />
      ))}
    </div>
  );
}
