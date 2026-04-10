const http = require("node:http");
const { spawn, execSync } = require("node:child_process");
const path = require("node:path");

const PORT = parseInt(process.env.DEV_TUNNEL_PORT || "3030", 10) || 3030;
const ROOT = path.join(__dirname, "..");
const SHELL = process.platform === "win32";

function killProcessTree(pid) {
  if (!pid) return;
  try {
    if (process.platform === "win32") {
      execSync(`taskkill /PID ${pid} /T /F`, { stdio: "ignore" });
    } else {
      try {
        process.kill(-pid, "SIGTERM");
      } catch {
        process.kill(pid, "SIGTERM");
      }
    }
  } catch {
    /* ignore */
  }
}

function waitForNextReady(port = PORT) {
  const deadline = Date.now() + 180000;
  return new Promise((resolve, reject) => {
    function tryOnce() {
      const req = http.get(
        `http://127.0.0.1:${port}/`,
        { timeout: 2500 },
        (res) => {
          res.resume();
          resolve();
        }
      );
      req.on("error", () => {
        if (Date.now() > deadline) {
          reject(new Error("Next.js не ответил за 3 минуты."));
        } else {
          setTimeout(tryOnce, 500);
        }
      });
      req.on("timeout", () => {
        req.destroy();
        if (Date.now() > deadline) {
          reject(new Error("Next.js не ответил за 3 минуты."));
        } else {
          setTimeout(tryOnce, 500);
        }
      });
    }
    tryOnce();
  });
}

function spawnDevLan() {
  return spawn("npm", ["run", "dev:lan"], {
    cwd: ROOT,
    stdio: "inherit",
    env: process.env,
    shell: SHELL,
    windowsHide: true,
  });
}

module.exports = {
  PORT,
  ROOT,
  SHELL,
  killProcessTree,
  waitForNextReady,
  spawnDevLan,
};
