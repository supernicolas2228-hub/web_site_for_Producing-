# Сборка статики (out/) и выкладка на Beget по SSH — как в .github/workflows/deploy-beget.yml
# Локально: задайте в сессии или в .env (не коммитьте пароли):
#   BEGET_SSH="user@host"  ИЛИ  BEGET_SSH_USER + BEGET_SSH_HOST
# Опционально: NEXT_PUBLIC_DEPLOY_REF для метки в подвале
$ErrorActionPreference = "Stop"
$here = Split-Path $PSScriptRoot -Parent
Set-Location $here

function Load-DotEnvBeget {
  $p = Join-Path $here ".env"
  if (-not (Test-Path $p)) { return }
  Get-Content $p -Encoding UTF8 | ForEach-Object {
    $line = $_.Trim()
    if ($line -match '^\s*#' -or $line -eq "") { return }
    if ($line -match '^(BEGET_SSH|BEGET_SSH_USER|BEGET_SSH_HOST|BEGET_UNPACK_PATHS|NEXT_PUBLIC_DEPLOY_REF|NEXT_PUBLIC_SITE_URL)=(.*)$') {
      $k = $Matches[1]
      $v = $Matches[2].Trim()
      if (($v.StartsWith('"') -and $v.EndsWith('"')) -or ($v.StartsWith("'") -and $v.EndsWith("'"))) {
        $v = $v.Substring(1, $v.Length - 2)
      }
      [Environment]::SetEnvironmentVariable($k, $v, "Process")
    }
  }
}

Load-DotEnvBeget

$deployRef = [Environment]::GetEnvironmentVariable("NEXT_PUBLIC_DEPLOY_REF", "Process")
if (-not $deployRef) {
  $d = Get-Date
  $deployRef = "{0:yyyy-MM-dd HH:mm} deploy-beget" -f $d
  [Environment]::SetEnvironmentVariable("NEXT_PUBLIC_DEPLOY_REF", $deployRef, "Process")
}
if (-not [Environment]::GetEnvironmentVariable("NEXT_PUBLIC_SITE_URL", "Process")) {
  [Environment]::SetEnvironmentVariable("NEXT_PUBLIC_SITE_URL", "https://sanchaevkirill.ru", "Process")
}

Write-Host "=== build-beget-static ==="
& node (Join-Path $here "scripts\build-beget-static.cjs")
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$out = Join-Path $here "out"
if (-not (Test-Path $out)) {
  Write-Error "Нет папки out/ после сборки."
  exit 1
}

$tarball = Join-Path $here "beget-out.tar.gz"
if (Test-Path $tarball) { Remove-Item $tarball -Force }
# Windows 10+ / Server 2016+ : tar в PATH
$tar = Get-Command tar -ErrorAction SilentlyContinue
if (-not $tar) {
  Write-Error "Команда tar не найдена. Установите Git for Windows / используйте Windows 10+."
  exit 1
}
Push-Location $here
& tar -czf $tarball -C $out .
Pop-Location
Write-Host "=== Создан $tarball ==="

$target = [Environment]::GetEnvironmentVariable("BEGET_SSH", "Process")
$user = [Environment]::GetEnvironmentVariable("BEGET_SSH_USER", "Process")
$hostS = [Environment]::GetEnvironmentVariable("BEGET_SSH_HOST", "Process")
if ($target) {
  # ok
} elseif ($user -and $hostS) {
  $target = "$user@$hostS"
}
if (-not $target) {
  Write-Host ""
  Write-Host "SSH-цель не задана. Задайте BEGET_SSH=user@host или BEGET_SSH_USER + BEGET_SSH_HOST (сессия или .env), затем снова npm run deploy:beget"
  Write-Host "Архив для ручной заливки: $tarball  (в панели: распаковать в public_html)"
  exit 0
}

Write-Host "=== scp $tarball -> ${target}:~/ ==="
& scp -o BatchMode=yes -o IdentitiesOnly=yes $tarball "${target}:~/"
if ($LASTEXITCODE -ne 0) {
  Write-Error "scp не удался (нужен SSH-ключ в агенте или ssh для Beget). Файл для ручной заливки: $tarball"
  exit $LASTEXITCODE
}

# Папки public_html: по умолчанию — техдомен + .ru. В .env: BEGET_UNPACK_PATHS=...|... (как $HOME/домен/public_html, разделитель |).
$unpackPaths = [Environment]::GetEnvironmentVariable("BEGET_UNPACK_PATHS", "Process")
if ($unpackPaths) {
  $parts = $unpackPaths -split '\|' | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
  $quoted = ($parts | ForEach-Object { "`"$_`"" }) -join " "
} else {
  $quoted = '"$HOME/supernh5.beget.tech/public_html" "$HOME/sanchaevkirill.ru/public_html"'
}
# Один for на bash; внешние кавычки PowerShell'ом не разворачивают $ (см. одинарные вокруг $d, $HOME).
$remoteCmd = 'for d in ' + $quoted + '; do mkdir -p "$d" && rm -rf "$d"/* && tar -xzf "$HOME/beget-out.tar.gz" -C "$d" && echo "unpacked: $d"; done; rm -f "$HOME/beget-out.tar.gz"'

Write-Host "=== ssh распаковка public_html ==="
& ssh -o BatchMode=yes -o IdentitiesOnly=yes $target $remoteCmd
if ($LASTEXITCODE -ne 0) {
  Write-Error "ssh завершился с кодом $LASTEXITCODE. Архив может быть в домашней папке на сервере."
  exit $LASTEXITCODE
}

Write-Host "=== Готово: https://sanchaevkirill.ru/ (Ctrl+F5) ==="
exit 0
