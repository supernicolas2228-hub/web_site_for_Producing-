const path = require("node:path");
const { execSync } = require("node:child_process");
const {
  loadDotEnvFile,
  syncDatabaseUrlFromHostEnv,
  isSqliteUrl,
  applyWindowsPrismaBinaryEngineDefault,
} = require("./env-db.cjs");

loadDotEnvFile();
applyWindowsPrismaBinaryEngineDefault();
syncDatabaseUrlFromHostEnv();
if (!process.env.DATABASE_URL?.trim()) {
  process.env.DATABASE_URL = "file:./dev.db";
}

const root = path.join(__dirname, "..");
/** Относительные пути — корректно при пробелах в имени папки на Windows */
const schemaRel = isSqliteUrl() ? "prisma/sqlite/schema.prisma" : "prisma/schema.prisma";

const localBin = path.join(root, "node_modules", ".bin");
const sep = path.delimiter;
const env = {
  ...process.env,
  PATH: `${localBin}${sep}${process.env.PATH || ""}`,
};

execSync(`prisma generate --schema ${JSON.stringify(schemaRel)}`, {
  stdio: "inherit",
  cwd: root,
  env,
  shell: true,
});
