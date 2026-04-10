const path = require("node:path");
const { spawnSync } = require("node:child_process");
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
const localBin = path.join(root, "node_modules", ".bin");
const sep = path.delimiter;
const env = {
  ...process.env,
  PATH: `${localBin}${sep}${process.env.PATH || ""}`,
};

const schemaRel = isSqliteUrl() ? "prisma/sqlite/schema.prisma" : "prisma/schema.prisma";

const r = spawnSync("prisma", ["migrate", "deploy", "--schema", schemaRel], {
  stdio: "inherit",
  env,
  cwd: root,
  shell: true,
});

process.exit(r.status ?? 1);
