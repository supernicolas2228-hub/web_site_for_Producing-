# Синхронизация проекта на Linux VPS: архив (без node_modules/.next/.git/.env), распаковка, npm ci, build, pm2 restart.
# Нужен OpenSSH. На сервере: Node 18+, pm2, процесс с именем sell-is-life (или задайте -Pm2Name).
#
# Пример:
#   .\scripts\deploy-vps.ps1 -SshTarget "deploy@138.124.90.218" -RemoteDir "/home/deploy/sell-is-life"
#
# env: DEPLOY_SSH_TARGET, DEPLOY_REMOTE_DIR

param(
  [string] $SshTarget = $env:DEPLOY_SSH_TARGET,
  [string] $RemoteDir = $(if ($env:DEPLOY_REMOTE_DIR) { $env:DEPLOY_REMOTE_DIR } else { $null }),
  [string] $Pm2Name = "sell-is-life"
)

$ErrorActionPreference = "Stop"

if (-not $SshTarget) {
  Write-Error "Укажите -SshTarget user@host или `$env:DEPLOY_SSH_TARGET."
}

if (-not $RemoteDir) {
  $RemoteDir = "~/sell-is-life"
}

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$stamp = Get-Date -Format "yyyyMMddHHmmss"
$archiveName = "sell-is-life-deploy-$stamp.tgz"
$archivePath = Join-Path $env:TEMP $archiveName
$remoteArchive = "~/sell-is-life-deploy.tgz"
$remoteScript = "/tmp/sil-deploy-$stamp.sh"
$localSh = $null

Push-Location $projectRoot
try {
  Write-Host "Архив: без node_modules, .next, .git, .env (*.db). Серверный .env не затирается."

  $tarArgs = @(
    "-czf", $archivePath,
    "--exclude=node_modules",
    "--exclude=.next",
    "--exclude=.git",
    "--exclude=.env",
    "--exclude=*.db",
    "."
  )
  & tar @tarArgs
  if ($LASTEXITCODE -ne 0) { throw "tar exit $LASTEXITCODE" }

  Write-Host "scp архива -> $SshTarget`:$remoteArchive"
  scp $archivePath "${SshTarget}:${remoteArchive}"
  if ($LASTEXITCODE -ne 0) { throw "scp exit $LASTEXITCODE" }

  $bashLines = @(
    "set -e"
    "DEST=$RemoteDir"
    'DEST="${DEST/#\~/$HOME}"'
    'mkdir -p "$DEST"'
    'cd "$DEST"'
    "tar -xzf $remoteArchive"
    "rm -f $remoteArchive"
    "unset NODE_ENV"
    "npm ci"
    "export NODE_ENV=production"
    "npm run build"
    "pm2 restart $Pm2Name"
  )
  $bashScript = ($bashLines -join "`n") + "`n"

  $localSh = Join-Path $env:TEMP "sil-deploy-$stamp.sh"
  [System.IO.File]::WriteAllText($localSh, $bashScript, [System.Text.UTF8Encoding]::new($false))

  Write-Host "scp скрипта -> $remoteScript"
  scp $localSh "${SshTarget}:${remoteScript}"
  if ($LASTEXITCODE -ne 0) { throw "scp script exit $LASTEXITCODE" }

  Write-Host "ssh: npm ci + build + pm2 restart $Pm2Name"
  ssh $SshTarget "chmod +x $remoteScript && bash $remoteScript; ec=`$?; rm -f $remoteScript; exit `$ec"
  if ($LASTEXITCODE -ne 0) { throw "ssh exit $LASTEXITCODE" }

  Write-Host "Готово."
}
finally {
  Pop-Location
  Remove-Item -LiteralPath $archivePath -ErrorAction SilentlyContinue
  if ($localSh) { Remove-Item -LiteralPath $localSh -ErrorAction SilentlyContinue }
}
