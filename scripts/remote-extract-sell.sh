#!/bin/bash
set -eu
APP=/var/www/sell-is-life
STAMP=$(date +%s)
BK=/tmp/sil-env-$STAMP
test -f /tmp/sil-deploy.tgz
if [ -f "$APP/.env" ]; then cp -a "$APP/.env" "$BK"; fi
pm2 stop sell-is-life || true
if [ -d "$APP" ]; then mv "$APP" "${APP}.bak.$STAMP"; fi
mkdir -p "$APP"
tar -xzf /tmp/sil-deploy.tgz -C "$APP"
rm -f /tmp/sil-deploy.tgz
if [ -f "$BK" ]; then mv -f "$BK" "$APP/.env"; fi
cd "$APP"
export NODE_ENV=production
export PORT=3030
export HOSTNAME=127.0.0.1
pm2 delete sell-is-life 2>/dev/null || true
pm2 start server.js --name sell-is-life --cwd "$APP"
pm2 save || true
pm2 list
