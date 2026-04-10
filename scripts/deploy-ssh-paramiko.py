"""
One-off deploy: SFTP standalone .tgz, extract over PM2 app dir, pm2 restart.
Usage:
  set VPS_PASSWORD=...
  python scripts/deploy-ssh-paramiko.py [path/to/archive.tgz]
"""
from __future__ import annotations

import base64
import json
import os
import sys
from pathlib import Path

import paramiko

HOST = "138.124.90.218"
USER = "root"
PM2_NAME = "sell-is-life"


def main() -> int:
    password = (os.environ.get("VPS_PASSWORD") or "").strip()
    if not password:
        print("Set VPS_PASSWORD", file=sys.stderr)
        return 1

    root = Path(__file__).resolve().parent.parent
    if len(sys.argv) > 1:
        tgz = Path(sys.argv[1]).resolve()
    else:
        rel = root / "release"
        cands = sorted(rel.glob("sell-is-life-standalone-*.tgz"), key=lambda p: p.stat().st_mtime, reverse=True)
        if not cands:
            print("No archive in release/", file=sys.stderr)
            return 1
        tgz = cands[0]
    if not tgz.is_file():
        print(f"Missing file: {tgz}", file=sys.stderr)
        return 1

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, username=USER, password=password, timeout=30, allow_agent=False, look_for_keys=False)

    try:
        app_dir = detect_app_dir(client)
        print(f"app_dir={app_dir}")

        remote_tgz = f"/root/{tgz.name}"
        print(f"upload {tgz} -> {remote_tgz}")
        sftp = client.open_sftp()
        try:
            sftp.put(str(tgz), remote_tgz)
        finally:
            sftp.close()

        # Preserve .env: extract to temp then rsync/cp — simpler: backup .env, extract with strip, restore
        sh = f"""set -e
APP="{app_dir}"
BK="$APP/.env.server.bak"
if [ -f "$APP/.env" ]; then cp -a "$APP/.env" "$BK"; fi
mkdir -p "$APP"
cd "$APP"
tar -xzf {remote_tgz}
rm -f {remote_tgz}
if [ -f "$BK" ]; then mv -f "$BK" "$APP/.env"; fi
cd "$APP"
export NODE_ENV=production
pm2 restart {PM2_NAME} 2>/dev/null || pm2 start server.js --name {PM2_NAME} --cwd "$APP"
pm2 save 2>/dev/null || true
"""
        run_script(client, sh)
        print("done")
        return 0
    finally:
        client.close()


def detect_app_dir(client: paramiko.SSHClient) -> str:
    out, _, _ = run_raw_simple(client, "pm2 jlist 2>/dev/null || echo '[]'")
    raw = out.strip()
    if raw:
        try:
            apps = json.loads(raw)
            for app in apps:
                if app.get("name") == PM2_NAME:
                    pm_env = app.get("pm2_env", {})
                    cwd = pm_env.get("cwd") or pm_env.get("pm_cwd") or ""
                    if cwd:
                        return cwd.rstrip("/")
        except json.JSONDecodeError:
            pass

    for guess in ("/root/sell-is-life", "/var/www/sell-is-life", f"/root/{PM2_NAME}"):
        _, _, exit_status = run_raw_simple(client, f"test -d {guess} && test -f {guess}/server.js")
        if exit_status == 0:
            return guess

    _, stdout, _ = run_raw_simple(
        client,
        "find /root -maxdepth 5 -name server.js 2>/dev/null | grep -v node_modules | head -1",
    )
    first = stdout.strip().split("\n")[0].strip()
    if first:
        return str(Path(first).parent)

    return "/root/sell-is-life"


def run_script(client: paramiko.SSHClient, script: str) -> tuple[str, str, int]:
    b64 = base64.b64encode(script.encode("utf-8")).decode("ascii")
    cmd = f"echo {b64} | base64 -d | bash"
    stdin, stdout, stderr = client.exec_command(cmd)
    stdin.close()
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    code = stdout.channel.recv_exit_status()
    if code != 0:
        print(out, err, sep="\n", file=sys.stderr)
        raise SystemExit(f"remote exit {code}")
    return out, err, code


def run_raw_simple(client: paramiko.SSHClient, cmd: str) -> tuple[str, str, int]:
    stdin, stdout, stderr = client.exec_command(cmd)
    stdin.close()
    out = stdout.read().decode("utf-8", errors="replace")
    err = stderr.read().decode("utf-8", errors="replace")
    code = stdout.channel.recv_exit_status()
    return out, err, code


if __name__ == "__main__":
    raise SystemExit(main())
