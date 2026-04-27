/**
 * Таймаут для fetch — на LTE и за прокси запрос не зависает надолго.
 */
export async function fetchWithTimeout(
  input: RequestInfo | URL,
  init: RequestInit | undefined,
  timeoutMs: number,
): Promise<Response> {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    return await fetch(input, { ...(init ?? {}), signal: ctrl.signal });
  } finally {
    clearTimeout(t);
  }
}
