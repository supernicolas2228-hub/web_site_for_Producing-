"use client";

import { useEffect, useState } from "react";
import { applyThemeClass, setStoredTheme, type Theme } from "@/lib/theme";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setTheme(isDark ? "dark" : "light");
    setReady(true);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyThemeClass(next);
    setStoredTheme(next);
  }

  const label = theme === "dark" ? "Включить светлую тему" : "Включить тёмную тему";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      disabled={!ready}
      className={[
        "inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full transition",
        "border border-stroke/20 bg-white/55 text-zinc-900 shadow-plate backdrop-blur-xl hover:border-accent/55 hover:text-accent dark:border-white/12 dark:bg-white/5 dark:text-white dark:hover:border-accent/45 dark:hover:text-sky-200",
        "disabled:opacity-40",
        className,
      ].join(" ")}
    >
      {theme === "dark" ? <IconSun /> : <IconMoon />}
    </button>
  );
}

function IconMoon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-current"
    >
      <path
        d="M21 14.5A9 9 0 018.5 3a7 7 0 1012.5 11.5z"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSun() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className="text-current"
    >
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="2.25" />
      <path
        d="M12 2v2.5M12 19.5V22M4.93 4.93l1.77 1.77M17.3 17.3l1.77 1.77M2 12h2.5M19.5 12H22M6.7 17.3l-1.77 1.77M19.07 4.93l-1.77 1.77"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
      />
    </svg>
  );
}
