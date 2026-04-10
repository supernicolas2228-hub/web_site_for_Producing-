/**
 * NetAngels и часть других хостингов задают только `DB_CONNECTION_STRING`.
 * Prisma ожидает `DATABASE_URL` — подставляем до создания PrismaClient.
 */
export function syncDatabaseUrlFromHostEnv(): void {
  if (process.env.DATABASE_URL?.trim()) return;
  const alt = process.env.DB_CONNECTION_STRING?.trim();
  if (alt) {
    process.env.DATABASE_URL = alt;
  }
}
