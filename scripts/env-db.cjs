/**
 * Подгрузка .env: значения из файла перекрывают окружение (локальный .env — истина).
 */
function loadDotEnvFile() {
  const fs = require("node:fs");
  const path = require("node:path");
  const fp = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(fp)) return;
  const text = fs.readFileSync(fp, "utf8");
  for (const line of text.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    const key = t.slice(0, i).trim();
    let val = t.slice(i + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    process.env[key] = val;
  }
}

function syncDatabaseUrlFromHostEnv() {
  if (process.env.DATABASE_URL?.trim()) return;
  const alt = process.env.DB_CONNECTION_STRING?.trim();
  if (alt) {
    process.env.DATABASE_URL = alt;
  }
}

function isSqliteUrl() {
  const u = (process.env.DATABASE_URL || "").trim().toLowerCase();
  return u.startsWith("file:");
}

/** На Windows библиотечный движок (.dll.node) часто даёт EPERM при rename — binary обходит это */
function applyWindowsPrismaBinaryEngineDefault() {
  if (process.platform === "win32" && !process.env.PRISMA_CLIENT_ENGINE_TYPE?.trim()) {
    process.env.PRISMA_CLIENT_ENGINE_TYPE = "binary";
  }
}

module.exports = {
  loadDotEnvFile,
  syncDatabaseUrlFromHostEnv,
  isSqliteUrl,
  applyWindowsPrismaBinaryEngineDefault,
};
