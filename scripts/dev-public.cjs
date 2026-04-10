/**
 * Основной способ «показать другу»: Next.js + localtunnel (стабильнее Cloudflare Quick Tunnel).
 * Запуск: npm run dev:public  →  https://….loca.lt в консоли
 *
 * Первая откладка loca.lt может показать предупреждение — нажмите Continue.
 * Альтернатива: npm run dev:public:cf (trycloudflare.com).
 */
const { spawn } = require("node:child_process");
const {
  PORT,
  ROOT,
  SHELL,
  killProcessTree,
  waitForNextReady,
  spawnDevLan,
} = require("./_tunnel-common.cjs");

let devProc = null;
let tunnelProc = null;

function shutdown(exitCode = 0) {
  if (tunnelProc && !tunnelProc.killed) {
    killProcessTree(tunnelProc.pid);
  }
  if (devProc && !devProc.killed) {
    killProcessTree(devProc.pid);
  }
  process.exit(exitCode);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

console.log("");
console.log("— Публичная ссылка (localtunnel), порт " + PORT + "…");
console.log("— Скопируйте https://….loca.lt из строк ниже.");
console.log("— Окно не закрывайте; ноутбук не в сон.");
console.log("");

devProc = spawnDevLan();

devProc.on("error", (err) => {
  console.error(err);
  process.exit(1);
});

devProc.on("exit", (code) => {
  if (code !== 0 && code != null) {
    console.error("Next.js завершился с кодом " + code);
    shutdown(code);
  }
});

waitForNextReady()
  .then(() => {
    console.log("");
    console.log("==========  Публичный URL — отправьте другу  ==========");
    console.log("");
    tunnelProc = spawn(
      "npx",
      ["-y", "localtunnel", "--port", String(PORT)],
      {
        cwd: ROOT,
        stdio: "inherit",
        env: process.env,
        shell: SHELL,
        windowsHide: true,
      }
    );
    tunnelProc.on("error", (err) => {
      console.error("localtunnel:", err.message);
      shutdown(1);
    });
    tunnelProc.on("exit", (code) => {
      if (code !== 0 && code != null) {
        console.warn("localtunnel завершился с кодом " + code);
      }
      shutdown(code ?? 0);
    });
  })
  .catch((e) => {
    console.error(e.message || e);
    killProcessTree(devProc?.pid);
    process.exit(1);
  });
