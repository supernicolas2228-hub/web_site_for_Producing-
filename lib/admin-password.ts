/**
 * Пароль админки из окружения. Ключ собирается строкой, чтобы Next.js не «запёк»
 * значение в бандл при `next build` — после смены ADMIN_PASSWORD в .env на сервере
 * достаточно `pm2 restart`, без полной пересборки.
 */
export function getAdminPassword(): string | undefined {
  const v = process.env["ADMIN" + "_PASSWORD"];
  return typeof v === "string" ? v.trim() : undefined;
}
