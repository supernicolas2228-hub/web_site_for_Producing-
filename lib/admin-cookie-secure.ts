/**
 * Cookie с флагом Secure на обычном HTTP не сохраняется (прокси отдаёт http).
 * Смотрим X-Forwarded-Proto от nginx — только тогда Secure.
 */
export function adminSessionCookieSecure(req: Request): boolean {
  const forwarded = req.headers.get("x-forwarded-proto");
  const proto = forwarded?.split(",")[0]?.trim().toLowerCase();
  if (proto === "https") return true;
  if (proto === "http") return false;
  try {
    return new URL(req.url).protocol === "https:";
  } catch {
    return false;
  }
}
