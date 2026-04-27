"""
One-off: append local SSH public key to ~/.ssh/authorized_keys on Beget (password auth).
Usage (PowerShell):
  $env:BEGET_SSH_PASSWORD = "..."
  python scripts/ssh-beget-add-pubkey.py
Optional:
  BEGET_SSH_HOST, BEGET_SSH_USER, BEGET_SSH_PUBKEY (path to .pub)
"""
from __future__ import annotations

import os
import sys

import paramiko

HOST = os.environ.get("BEGET_SSH_HOST", "supernh5.beget.tech")
USER = os.environ.get("BEGET_SSH_USER", "supernh5")


def main() -> int:
    password = (os.environ.get("BEGET_SSH_PASSWORD") or "").strip()
    if not password:
        print("Set BEGET_SSH_PASSWORD", file=sys.stderr)
        return 1

    pub_path = (os.environ.get("BEGET_SSH_PUBKEY") or "").strip()
    if not pub_path:
        home = os.path.expanduser("~")
        pub_path = os.path.join(
            home, ".ssh", "id_ed25519_beget_supernh5.pub"
        )
    with open(pub_path, encoding="utf-8") as f:
        pub = f.read().strip()
    if not pub or " " not in pub:
        print(f"Bad pubkey file: {pub_path}", file=sys.stderr)
        return 1

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        HOST,
        username=USER,
        password=password,
        timeout=30,
        allow_agent=False,
        look_for_keys=False,
    )

    try:
        b64 = __import__("base64").b64encode(pub.encode("utf-8")).decode("ascii")
        sh = f"""set -e
mkdir -p "$HOME/.ssh"
chmod 700 "$HOME/.ssh"
touch "$HOME/.ssh/authorized_keys"
LINE=$(printf '%s' '{b64}' | base64 -d)
if ! grep -qxF "$LINE" "$HOME/.ssh/authorized_keys" 2>/dev/null; then
  echo "$LINE" >> "$HOME/.ssh/authorized_keys"
fi
chmod 600 "$HOME/.ssh/authorized_keys"
echo ok
"""
        _stdin, stdout, stderr = client.exec_command(sh, get_pty=True)
        out = (stdout.read() or b"").decode("utf-8", errors="replace")
        err = (stderr.read() or b"").decode("utf-8", errors="replace")
        code = stdout.channel.recv_exit_status()
        if out.strip():
            print(out.strip())
        if err.strip():
            print(err.strip(), file=sys.stderr)
        return 0 if code == 0 and "ok" in out else 1
    finally:
        client.close()


if __name__ == "__main__":
    raise SystemExit(main())
