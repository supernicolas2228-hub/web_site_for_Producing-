import { isEmbeddedWebViewOrMessenger } from "@/lib/webview-env";

/**
 * Тяжёлый GSAP-прелоадер пропускаем там, где он чаще «висит»:
 * встроенные браузеры, экономия трафика, очень медленный канал (часто совпадает с VPN).
 */
export function shouldSkipHeavyPreloader(): boolean {
  if (typeof window === "undefined") return false;
  if (isEmbeddedWebViewOrMessenger()) return true;
  try {
    if (new URLSearchParams(window.location.search).has("nofx")) return true;
  } catch {
    /* ignore */
  }
  try {
    const nav = navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
      mozConnection?: { saveData?: boolean; effectiveType?: string };
      webkitConnection?: { saveData?: boolean; effectiveType?: string };
    };
    const c = nav.connection || nav.mozConnection || nav.webkitConnection;
    if (c?.saveData) return true;
    const et = c?.effectiveType;
    if (et === "slow-2g" || et === "2g") return true;
  } catch {
    /* ignore */
  }
  return false;
}
