# git push + выкладка на VPS (текущее состояние папки на диске).
$ErrorActionPreference = "Stop"
$here = Split-Path $PSScriptRoot -Parent
Set-Location $here

git push
if ($LASTEXITCODE -ne 0) {
  Write-Host "git push failed (exit $LASTEXITCODE). Fix and retry, or run only: npm run deploy:vps"
  exit $LASTEXITCODE
}

npm run deploy:vps
exit $LASTEXITCODE
