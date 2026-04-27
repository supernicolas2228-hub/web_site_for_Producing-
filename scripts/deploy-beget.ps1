# Сборка статики (out/) и выкладка на Beget по SSH (основной способ; CI для Beget отключён).
# Локально: задайте в сессии или в .env (не коммитьте пароли):
#   BEGET_SSH="user@host"  ИЛИ  BEGET_SSH_USER + BEGET_SSH_HOST
# Опционально: NEXT_PUBLIC_DEPLOY_REF для метки в подвале
# Только заливка готового архива (без сборки на этом ПК):  -UploadOnly  (ожидается ./beget-out.tar.gz)
param([switch]$UploadOnly)

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

$tarball = Join-Path $here "beget-out.tar.gz"

if ($UploadOnly) {
  Write-Host "=== UploadOnly: upload existing beget-out.tar.gz (no local build) ==="
  if (-not (Test-Path $tarball)) {
    Write-Error "Missing beget-out.tar.gz in project root. Add archive or run deploy:beget without -UploadOnly."
    exit 1
  }
} else {
  Write-Host "=== static build (Beget) ==="
  & node (Join-Path $here "scripts\build-beget-static.cjs")
  if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

  $out = Join-Path $here "out"
  if (-not (Test-Path $out)) {
    Write-Error "Missing out/ after build."
    exit 1
  }

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
}

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

$unpackPaths = [Environment]::GetEnvironmentVariable("BEGET_UNPACK_PATHS", "Process")
if ($unpackPaths) {
  $parts = @($unpackPaths.Split("|") | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" })
  $qch = [char]34
  $quoted = ($parts | ForEach-Object { $qch + $_ + $qch }) -join " "
} else {
  $dq = [char]34
  $bh = "`$HOME"
  $quoted = "${dq}${bh}/supernh5.beget.tech/public_html${dq} ${dq}${bh}/sanchaevkirill.ru/public_html${dq}"
}
$unpackTplPath = Join-Path $here "scripts\beget-unpack-remote.template.sh"
$unpackTpl = [System.IO.File]::ReadAllText($unpackTplPath, [System.Text.UTF8Encoding]::new($false))
$remoteCmd = $unpackTpl.Replace("__PATHS_Q__", $quoted).Trim()

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
