#!/usr/bin/env bash
# Публичный сайт: не сужать доступ к 80/443 allowlist'ом на «только мои IP»;
# датацентры и VPN — обычные посетители, их не отрезать UFW/iptables «по привычке».
# Запуск: от root; либо с passwordless sudo (деплой). Идемпотентно: правила ufw add повторяемо.
set -euo pipefail

vps_run() {
  if [ "$(id -u)" -eq 0 ]; then
    "$@"
  else
    sudo -n "$@" 2>/dev/null || return 0
  fi
}

# --- UFW (часто на Ubuntu/Debian): пока фаервол включён, открываем вход для всех, а не allowlist. ---
vps_ufw_public_www() {
  if ! command -v ufw >/dev/null 2>&1; then
    return 0
  fi
  if ! vps_run ufw status 2>/dev/null | grep -qE "^Status:[[:space:]]+active"; then
    return 0
  fi
  echo "vps-ensure-public-ingress: UFW active — public 22/tcp, 80/tcp, 443/tcp (any source, incl. VPN)" >&2
  vps_run ufw allow 22/tcp || true
  vps_run ufw allow 80/tcp || true
  vps_run ufw allow 443/tcp || true
}

# --- Nginx: предупредить, если в публичном server { } кто-то поставил allow 1.2.3.4; (остальные 403). ---
vps_warn_nginx_ip_allow() {
  local d="/etc/nginx/sites-enabled"
  if [ ! -d "$d" ]; then
    return 0
  fi
  if ! grep -RE --include="*.conf" '^\s*allow[[:space:]]+[0-9]' "$d" 2>/dev/null | head -1 | grep -q .; then
    return 0
  fi
  echo "vps-ensure-public-ingress: в $d есть 'allow <IP>' — публичный сайт может быть недоступен с чужих IP (VPN, моб. сети). Уберите allow для / или вынесите /admin в отдельный server" >&2
}

vps_ufw_public_www
vps_warn_nginx_ip_allow
