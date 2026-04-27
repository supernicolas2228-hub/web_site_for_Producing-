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
    if ($line -match '^(BEGET_SSH|BEGET_SSH_USER|BEGET_SSH_HOST|BEGET_SSH_IDENTITY|BEGET_UNPACK_PATHS|NEXT_PUBLIC_DEPLOY_REF|NEXT_PUBLIC_SITE_URL)=(.*)$') {
      $k = $Matches[1]
      $v = $Matches[2].Trim()
      $q2 = [char]34; $q1 = [char]39
      if (($v.StartsWith($q2) -and $v.EndsWith($q2)) -or ($v.StartsWith($q1) -and $v.EndsWith($q1))) {
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

Write-Host "=== static build (Beget) ==="
& node (Join-Path $here "scripts\build-beget-static.cjs")
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

$out = Join-Path $here "out"
if (-not (Test-Path $out)) {
  Write-Error "Missing out/ after build."
  exit 1
}

$tarball = Join-Path $here "beget-out.tar.gz"
if (Test-Path $tarball) { Remove-Item $tarball -Force }
# Windows 10+ / Server 2016+ : tar в PATH
$tar = Get-Command tar -ErrorAction SilentlyContinue
if (-not $tar) {
  Write-Error "tar not found. Install Git for Windows or use Windows 10+."
  exit 1
}
Push-Location $here
& tar -czf $tarball -C $out .
Pop-Location
Write-Host "=== created $tarball ==="

$target = [Environment]::GetEnvironmentVariable("BEGET_SSH", "Process")
$user = [Environment]::GetEnvironmentVariable("BEGET_SSH_USER", "Process")
$begetHost = [Environment]::GetEnvironmentVariable("BEGET_SSH_HOST", "Process")
if ($target) {
  # ok
} elseif ($user -and $begetHost) {
  $target = "$user@$begetHost"
}
if (-not $target) {
  Write-Host ""
  Write-Host "BEGET_SSH is not set. Set BEGET_SSH or BEGET_SSH_USER+BEGET_SSH_HOST in .env, then: npm run deploy:beget"
  Write-Host "Archive for manual upload: $tarball  (unpack into public_html in panel)"
  exit 0
}

function Get-BegetSshIdentity {
  $e = [Environment]::GetEnvironmentVariable("BEGET_SSH_IDENTITY", "Process")
  if ($e) {
    if (Test-Path -LiteralPath $e) { return $e }
  }
  foreach ($c in @(
    (Join-Path $env:USERPROFILE ".ssh\id_ed25519_beget_supernh5"),
    (Join-Path $env:USERPROFILE ".ssh\id_ed25519_beget")
  )) {
    if (Test-Path -LiteralPath $c) { return $c }
  }
  return $null
}
$begetId = Get-BegetSshIdentity

Write-Host "=== scp $tarball -> ${target}:~/ ==="
if ($begetId) {
  & scp -i $begetId -o BatchMode=yes -o IdentitiesOnly=yes $tarball "${target}:~/"
} else {
  & scp -o BatchMode=yes -o IdentitiesOnly=yes $tarball "${target}:~/"
}
if ($LASTEXITCODE -ne 0) {
  Write-Error "scp failed. Set BEGET_SSH_IDENTITY or add id_ed25519_beget* to $env:USERPROFILE\.ssh. Manual archive: $tarball"
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
# One bash for-loop; $ is literal for remote shell (see string concat above).
$remoteCmd = 'for d in ' + $quoted + '; do mkdir -p "$d" && rm -rf "$d"/* && tar -xzf "$HOME/beget-out.tar.gz" -C "$d" && echo "unpacked: $d"; done; rm -f "$HOME/beget-out.tar.gz"'

Write-Host "=== ssh: unpack to public_html ==="
if ($begetId) {
  & ssh -i $begetId -o BatchMode=yes -o IdentitiesOnly=yes $target $remoteCmd
} else {
  & ssh -o BatchMode=yes -o IdentitiesOnly=yes $target $remoteCmd
}
if ($LASTEXITCODE -ne 0) {
  Write-Error "ssh failed with $LASTEXITCODE. Archive may still be in home on server."
  exit $LASTEXITCODE
}

Write-Host "=== OK: open https://sanchaevkirill.ru/ (Ctrl+F5) ==="
exit 0
