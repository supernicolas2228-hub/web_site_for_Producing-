# Sync project to Linux VPS: tgz (no node_modules/.next/.git/.env), extract, npm ci, build, pm2 restart or start.
# Requires OpenSSH. Server: Node 18+, pm2.
#
# Example:
#   .\scripts\deploy-vps.ps1 -SshTarget "root@138.124.90.218"
#
# env: DEPLOY_SSH_TARGET, DEPLOY_REMOTE_DIR, DEPLOY_PM2_NAME

param(
  [string] $SshTarget = $(if ($env:DEPLOY_SSH_TARGET) { $env:DEPLOY_SSH_TARGET } else { "root@138.124.90.218" }),
  [string] $RemoteDir = $(if ($env:DEPLOY_REMOTE_DIR) { $env:DEPLOY_REMOTE_DIR } else { $null }),
  [string] $Pm2Name = $(if ($env:DEPLOY_PM2_NAME) { $env:DEPLOY_PM2_NAME } else { $null })
)

$ErrorActionPreference = "Stop"

if (-not $SshTarget) {
  Write-Error "Set -SshTarget user@host or `$env:DEPLOY_SSH_TARGET."
}

if (-not $RemoteDir) {
  $RemoteDir = "/var/www/business-card-site"
}

if (-not $Pm2Name) {
  $Pm2Name = "business-card-site"
}

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$installScript = Join-Path $PSScriptRoot "vps-remote-install.sh"
$ensureIngressScript = Join-Path $PSScriptRoot "vps-ensure-public-ingress.sh"
if (-not (Test-Path -LiteralPath $installScript)) {
  Write-Error "Missing scripts/vps-remote-install.sh"
}
if (-not (Test-Path -LiteralPath $ensureIngressScript)) {
  Write-Error "Missing scripts/vps-ensure-public-ingress.sh"
}

$stamp = Get-Date -Format "yyyyMMddHHmmss"
$archiveName = "sell-is-life-deploy-$stamp.tgz"
$archivePath = Join-Path $env:TEMP $archiveName
$remoteArchive = "~/sell-is-life-deploy.tgz"
$remoteInstall = "/tmp/sil-vps-install-$stamp.sh"

Push-Location $projectRoot
try {
  Write-Host "Archive: excludes node_modules, .next, .git, .env (*.db). Server .env is not overwritten."

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

  Write-Host "scp archive -> ${SshTarget}:${remoteArchive}"
  scp $archivePath "${SshTarget}:${remoteArchive}"
  if ($LASTEXITCODE -ne 0) { throw "scp exit $LASTEXITCODE" }

  Write-Host "scp install script -> ${SshTarget}:${remoteInstall}"
  scp $installScript "${SshTarget}:${remoteInstall}"
  if ($LASTEXITCODE -ne 0) { throw "scp install script exit $LASTEXITCODE" }

  $remoteEnsure = "/tmp/vps-ensure-public-ingress.sh"
  Write-Host "scp ensure-public-ingress -> ${SshTarget}:${remoteEnsure}"
  scp $ensureIngressScript "${SshTarget}:${remoteEnsure}"
  if ($LASTEXITCODE -ne 0) { throw "scp vps-ensure-public-ingress.sh exit $LASTEXITCODE" }

  $destEsc = $RemoteDir -replace "'", "'\''"
  Write-Host "ssh: vps-remote-install.sh (DEST=$RemoteDir PM2=$Pm2Name)"
  ssh $SshTarget "chmod +x $remoteInstall $remoteEnsure && export DEST='$destEsc' PM2_NAME='$Pm2Name' ARCHIVE=`$HOME/sell-is-life-deploy.tgz PORT=3000 && bash $remoteInstall; ec=`$?; rm -f $remoteInstall; exit `$ec"
  if ($LASTEXITCODE -ne 0) { throw "ssh exit $LASTEXITCODE" }

  Write-Host "Done."
}
finally {
  Pop-Location
  Remove-Item -LiteralPath $archivePath -ErrorAction SilentlyContinue
}
