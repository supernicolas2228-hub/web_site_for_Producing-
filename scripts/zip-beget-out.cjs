/**
 * Архив содержимого out/ для ручной загрузки в public_html Beget (файл-менеджер / FTP).
 */
const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const root = path.join(__dirname, "..");
const out = path.join(root, "out");
if (!fs.existsSync(out)) {
  console.error("[zip-beget-out] Нет папки out/. Сначала: npm run build:beget");
  process.exit(1);
}

const pad = (n) => String(n).padStart(2, "0");
const d = new Date();
const stamp = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}`;
const zipName = `beget-upload-${stamp}.zip`;
const zipPath = path.join(root, zipName);

if (fs.existsSync(zipPath)) fs.unlinkSync(zipPath);

if (process.platform === "win32") {
  const ps = `Compress-Archive -Path "${out}\\*" -DestinationPath "${zipPath}" -Force`;
  const r = spawnSync("powershell.exe", ["-NoProfile", "-Command", ps], {
    stdio: "inherit",
    shell: false,
  });
  if (r.status !== 0) process.exit(r.status ?? 1);
} else {
  const r = spawnSync("zip", ["-r", "-q", zipPath, "."], { cwd: out, stdio: "inherit" });
  if (r.status !== 0) process.exit(r.status ?? 1);
}

console.log(`[zip-beget-out] Готово: ${zipName}`);
console.log(`[zip-beget-out] В панели Beget: распакуйте в public_html (или замените файлы из папки out/).`);
