/**
 * Встроенные браузеры мессенджеров и Android System WebView:
 * тяжёлый GSAP-прелоадер, storage и нестандартный lifecycle чаще ломают первый показ.
 */
export function isEmbeddedWebViewOrMessenger(): boolean {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  if (
    /Telegram|Instagram|FBAN|FBAV|FB_IAB|KAKAOTALK|Line\/|WhatsApp|Snapchat|Viber|WeChat|MicroMessenger|Discord|Slack|MicrosoftTeams/i.test(
      ua,
    )
  ) {
    return true;
  }
  if (/; wv\)/.test(ua)) {
    return true;
  }
  return false;
}
