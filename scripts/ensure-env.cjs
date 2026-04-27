/**
 * Если нет .env — копирует из .env.example (первый клон / чистая папка).
 */
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const envPath = path.join(root, ".env");
const examplePath = path.join(root, ".env.example");

if (!fs.existsSync(envPath) && fs.existsSync(examplePath)) {
  fs.copyFileSync(examplePath, envPath);
  console.log("[ensure-env] Создан .env из .env.example — при необходимости отредактируйте.");
}
