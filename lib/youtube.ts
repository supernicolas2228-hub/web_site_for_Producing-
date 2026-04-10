/**
 * Приводит ссылку YouTube (watch или embed) к embed URL для iframe
 */
export function toYouTubeEmbedUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  try {
    if (trimmed.includes("youtube-nocookie.com/embed/")) {
      return trimmed.includes("?") ? trimmed : `${trimmed}?rel=0`;
    }
    if (trimmed.includes("/embed/")) {
      const u = new URL(trimmed);
      const id = u.pathname.split("/embed/")[1]?.split("/")[0];
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
    }
    const u = new URL(trimmed);
    const host = u.hostname.replace("www.", "");
    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split("/")[0];
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?rel=0`;
    }
    if (host.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return `https://www.youtube-nocookie.com/embed/${v}?rel=0`;
    }
  } catch {
    /* fallback */
  }
  return trimmed;
}

/** Реальный id ролика — обычно 11 символов [A-Za-z0-9_-] */
function isValidYoutubeVideoId(id: string): boolean {
  if (!id || /replace/i.test(id)) return false;
  if (id.length < 10 || id.length > 12) return false;
  return /^[a-zA-Z0-9_-]+$/.test(id);
}

/**
 * true — вместо iframe показываем заглушку (заглушка в ссылке, битый URL и т.п.)
 */
export function isYoutubeEmbedUnavailable(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return true;
  const lower = trimmed.toLowerCase();
  if (lower.includes("replace_me")) return true;

  try {
    const u = new URL(trimmed);
    const host = u.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = u.pathname.replace(/^\//, "").split("/")[0] ?? "";
      return !isValidYoutubeVideoId(id);
    }

    if (host.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return !isValidYoutubeVideoId(v);

      const embed = u.pathname.match(/\/embed\/([^/?]+)/);
      if (embed?.[1]) return !isValidYoutubeVideoId(embed[1]);

      return true;
    }
  } catch {
    return true;
  }

  return false;
}
