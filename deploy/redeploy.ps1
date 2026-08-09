# HATOMS quick redeploy to VPS (HTTP).
# Usage:
#   .\deploy\redeploy.ps1
#   .\deploy\redeploy.ps1 -NoCache
#   .\deploy\redeploy.ps1 -SkipBuild
#
# Credentials: deploy/server.local.env (gitignored).

param(
  [switch]$NoCache,
  [switch]$SkipBuild
)

$ErrorActionPreference = "Stop"
$DeployDir = $PSScriptRoot
$RootDir = Resolve-Path (Join-Path $DeployDir "..")
Set-Location $RootDir

$ServerEnvPath = Join-Path $DeployDir "server.local.env"
$ExamplePath = Join-Path $DeployDir "server.local.env.example"

function Read-EnvFile([string]$Path) {
  $map = @{}
  Get-Content -LiteralPath $Path | ForEach-Object {
    if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
    $parts = $_ -split '=', 2
    if ($parts.Count -eq 2) {
      $map[$parts[0].Trim()] = $parts[1].Trim()
    }
  }
  return $map
}

if (-not (Test-Path -LiteralPath $ServerEnvPath)) {
  if (Test-Path -LiteralPath $ExamplePath) {
    Copy-Item -LiteralPath $ExamplePath -Destination $ServerEnvPath
    Write-Host "Created deploy/server.local.env - fill SERVER_PASSWORD and re-run." -ForegroundColor Yellow
    exit 1
  }
  throw "Missing deploy/server.local.env"
}

$cfg = Read-EnvFile $ServerEnvPath
$ServerHost = $cfg["SERVER_HOST"]
$ServerUser = $cfg["SERVER_USER"]
$ServerPassword = $cfg["SERVER_PASSWORD"]
$RemoteDir = if ($cfg["REMOTE_DIR"]) { $cfg["REMOTE_DIR"] } else { "/opt/hatoms" }

if ([string]::IsNullOrWhiteSpace($ServerHost) -or [string]::IsNullOrWhiteSpace($ServerUser) -or [string]::IsNullOrWhiteSpace($ServerPassword)) {
  throw "SERVER_HOST / SERVER_USER / SERVER_PASSWORD must be set in deploy/server.local.env"
}
if ($ServerPassword -eq "change-me") {
  throw "Set a real SERVER_PASSWORD in deploy/server.local.env"
}

Write-Host "==> HATOMS redeploy (HTTP)" -ForegroundColor Cyan
Write-Host ("    target: {0}@{1}:{2}" -f $ServerUser, $ServerHost, $RemoteDir)

if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
  throw "python is required (paramiko)"
}

$env:HATOMS_REDEPLOY_HOST = $ServerHost
$env:HATOMS_REDEPLOY_USER = $ServerUser
$env:HATOMS_REDEPLOY_PASSWORD = $ServerPassword
$env:HATOMS_REDEPLOY_REMOTE = $RemoteDir
$env:HATOMS_REDEPLOY_ROOT = "$RootDir"
$env:HATOMS_REDEPLOY_NO_CACHE = $(if ($NoCache) { "1" } else { "0" })
$env:HATOMS_REDEPLOY_SKIP_BUILD = $(if ($SkipBuild) { "1" } else { "0" })

$scriptPath = Join-Path $DeployDir "redeploy.py"
& python $scriptPath
$code = $LASTEXITCODE
if ($code -ne 0) {
  throw ("redeploy.py failed with exit code {0}" -f $code)
}
