#!/usr/bin/env bash
set -euo pipefail
V="/etc/nginx/sites-enabled/business-card-site"
rm -f /etc/nginx/sites-enabled/business-card-site.bak.* 2>/dev/null || true
[ -f "$V" ] || exit 1
sed -i 's|proxy_pass http://127.0.0.1:3000;|proxy_pass http://127.0.0.1:3030;|g' "$V"
sed -i 's|proxy_pass http://127.0.0.1:3002;|proxy_pass http://127.0.0.1:3030;|g' "$V"
nginx -t && systemctl reload nginx && echo OK
