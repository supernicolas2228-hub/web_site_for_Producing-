# Dev server on 0.0.0.0:3030 + Windows Firewall rule + print LAN URLs (same Wi-Fi as PC)
$ErrorActionPreference = "Continue"
$projectRoot = Split-Path -Parent $PSScriptRoot
Set-Location $projectRoot

$ip = $null
try {
  $route = Get-NetRoute -DestinationPrefix "0.0.0.0/0" -ErrorAction SilentlyContinue | Sort-Object RouteMetric | Select-Object -First 1
  if ($route) {
    $ip = (Get-NetIPAddress -InterfaceIndex $route.ifIndex -AddressFamily IPv4 -ErrorAction SilentlyContinue).IPAddress
  }
} catch { }

if (-not $ip) {
  $cfg = Get-NetIPConfiguration -ErrorAction SilentlyContinue | Where-Object { $_.IPv4DefaultGateway -and $_.NetAdapter.Status -eq "Up" } | Select-Object -First 1
  if ($cfg) {
    $ip = $cfg.IPv4Address.IPAddress
  }
}

if (-not $ip) {
  $ip = (Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue | Where-Object {
      $_.IPAddress -match '^(192\.168\.|10\.)' -and $_.PrefixOrigin -ne "WellKnown"
    } | Select-Object -First 1).IPAddress
}

Write-Host ""
Write-Host ("Phone (Wi-Fi):  SITE      http://{0}:3030/" -f $ip) -ForegroundColor Cyan
Write-Host ("Phone (Wi-Fi):  ADMIN     http://{0}:3030/admin" -f $ip) -ForegroundColor Cyan
Write-Host ("Phone (Wi-Fi):  LOGIN     http://{0}:3030/admin/login" -f $ip) -ForegroundColor Cyan
Write-Host "This PC:                       http://127.0.0.1:3030/" -ForegroundColor DarkGray
Write-Host ""

$ruleName = "SellIsLife-Dev3030-TCP"
$existing = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
if ($existing) {
  Write-Host "Firewall: rule OK ($ruleName)." -ForegroundColor DarkGreen
} else {
  try {
    New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Protocol TCP -LocalPort 3030 -Action Allow -Profile Private, Public, Domain -ErrorAction Stop | Out-Null
    Write-Host "Firewall: inbound TCP 3030 allowed." -ForegroundColor Green
  } catch {
    Write-Host "Firewall: ACCESS DENIED - phone may not load. Run PowerShell as Administrator once:" -ForegroundColor Yellow
    Write-Host '  New-NetFirewallRule -DisplayName "SellIsLife-Dev3030-TCP" -Direction Inbound -Protocol TCP -LocalPort 3030 -Action Allow -Profile Private,Public,Domain' -ForegroundColor Gray
    Write-Host ""
  }
}

npm run dev:lan
