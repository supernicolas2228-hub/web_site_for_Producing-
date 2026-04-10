/**
 * Публичная ссылка через Cloudflare Quick Tunnel (иногда 530 / «unregistered» — нестабильно).
 * Запуск: npm run dev:public:cf
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
console.log("— Cloudflare Tunnel, порт " + PORT + "…");
console.log("— Ссылка: https://….trycloudflare.com в логе.");
console.log("— При 530 / 1033 используйте основной: npm run dev:public (localtunnel).");
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
    console.log("==========  trycloudflare.com — скопируйте URL ниже  ==========");
    console.log("");
    tunnelProc = spawn(
      "npx",
      [
        "-y",
        "cloudflared",
        "tunnel",
        "--edge-ip-version",
        "4",
        "--protocol",
        "http2",
        "--url",
        `http://127.0.0.1:${PORT}`,
      ],
      {
        cwd: ROOT,
        stdio: "inherit",
        env: process.env,
        shell: SHELL,
        windowsHide: true,
      }
    );
    tunnelProc.on("error", (err) => {
      console.error("cloudflared:", err.message);
      shutdown(1);
    });
    tunnelProc.on("exit", (code) => {
      if (code !== 0 && code != null) {
        console.warn("Туннель завершился с кодом " + code);
      }
      shutdown(code ?? 0);
    });
  })
  .catch((e) => {
    console.error(e.message || e);
    killProcessTree(devProc?.pid);
    process.exit(1);
  });
