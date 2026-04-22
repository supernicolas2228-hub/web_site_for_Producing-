export type Theme = "light" | "dark";

const STORAGE_KEY = "sell-is-life-theme";

export function getStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(STORAGE_KEY);
  if (v === "light" || v === "dark") return v;
  return null;
}

export function setStoredTheme(theme: Theme): void {
  localStorage.setItem(STORAGE_KEY, theme);
}

export function applyThemeClass(theme: Theme): void {
  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);
}

/** Скрипт для <head>: без мигания до гидрации */
export function themeInitInlineScript(): string {
  return `(function(){try{var k='${STORAGE_KEY}';var s=localStorage.getItem(k);var d=document.documentElement;if(s==='light'||s==='dark'){d.classList.add(s);return;}d.classList.add('dark');}catch(e){document.documentElement.classList.add('dark');}})();`;
}
