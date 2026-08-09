# HATOMS one-shot production deploy (Windows / PowerShell)
# Usage from repo root:
#   .\deploy\deploy.ps1
#   .\deploy\deploy.ps1 -Pull
#   .\deploy\deploy.ps1 -NoCache

param(
  [switch]$Pull,
  [switch]$NoCache
)

$ErrorActionPreference = "Stop"
$RootDir = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $RootDir

$ComposeFile = "docker-compose.prod.yml"
$EnvFile = ".env"

Write-Host "==> HATOMS deploy"
Write-Host "    root: $RootDir"

if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
  throw "docker is not installed or not in PATH"
}

docker compose version | Out-Null

if (-not (Test-Path $EnvFile)) {
  if (Test-Path ".env.example") {
    Copy-Item ".env.example" $EnvFile
    Write-Host "Created $EnvFile from .env.example"
    Write-Host "Edit secrets (POSTGRES_PASSWORD, ADMIN_TOKEN, CORS_ORIGINS) and re-run."
    exit 1
  }
  throw "Missing $EnvFile"
}

Get-Content $EnvFile | ForEach-Object {
  if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
  $parts = $_ -split '=', 2
  if ($parts.Count -eq 2) {
    [System.Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1].Trim(), "Process")
  }
}

$required = @("POSTGRES_DB", "POSTGRES_USER", "POSTGRES_PASSWORD", "ADMIN_TOKEN", "CORS_ORIGINS")
foreach ($key in $required) {
  $value = [System.Environment]::GetEnvironmentVariable($key, "Process")
  if ([string]::IsNullOrWhiteSpace($value)) {
    throw "$key is empty in $EnvFile"
  }
}

if ($Pull -and (Test-Path ".git")) {
  Write-Host "==> git pull"
  git pull --ff-only
}

$buildArgs = @("-f", $ComposeFile, "build")
if ($NoCache) { $buildArgs += "--no-cache" }

Write-Host "==> docker compose build"
docker compose @buildArgs

Write-Host "==> docker compose up"
docker compose -f $ComposeFile up -d --remove-orphans

Start-Sleep -Seconds 3
$webPort = if ($env:WEB_PORT) { $env:WEB_PORT } else { "80" }

try {
  $health = Invoke-RestMethod "http://127.0.0.1:$webPort/health"
  Write-Host "Health OK: $($health | ConvertTo-Json -Compress)"
} catch {
  Write-Host "WARNING: /health is not ready yet. Check logs:"
  Write-Host "  docker compose -f $ComposeFile logs -f api"
}

Write-Host ""
Write-Host "Deploy finished."
Write-Host "  Site:    http://SERVER_IP:$webPort/"
Write-Host "  Admin:   http://SERVER_IP:$webPort/admin"
Write-Host "  Swagger: http://SERVER_IP:$webPort/docs"
Write-Host ""
docker compose -f $ComposeFile ps
