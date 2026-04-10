const SALT = "sell-is-life-admin-salt";

export const ADMIN_COOKIE = "sell_admin_session";

export async function makeAdminSessionToken(password: string): Promise<string> {
  const buf = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(password + SALT),
  );
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function verifyAdminCookie(
  cookieValue: string | undefined,
  adminPassword: string | undefined,
): Promise<boolean> {
  if (!cookieValue || !adminPassword) return false;
  const expected = await makeAdminSessionToken(adminPassword);
  return cookieValue.length === expected.length && timingSafeEqual(cookieValue, expected);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let x = 0;
  for (let i = 0; i < a.length; i++) x |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return x === 0;
}
