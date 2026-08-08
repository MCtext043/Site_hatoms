#!/usr/bin/env bash
# HATOMS one-shot production deploy
# Usage on the server (from repo root):
#   chmod +x deploy/deploy.sh
#   ./deploy/deploy.sh
#
# Optional:
#   ./deploy/deploy.sh --pull     # git pull before build
#   ./deploy/deploy.sh --no-cache # rebuild without Docker cache

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env"
DO_PULL=0
NO_CACHE=0

for arg in "$@"; do
  case "$arg" in
    --pull) DO_PULL=1 ;;
    --no-cache) NO_CACHE=1 ;;
    -h|--help)
      echo "Usage: ./deploy/deploy.sh [--pull] [--no-cache]"
      exit 0
      ;;
    *)
      echo "Unknown argument: $arg"
      exit 1
      ;;
  esac
done

echo "==> HATOMS deploy"
echo "    root: $ROOT_DIR"

if ! command -v docker >/dev/null 2>&1; then
  echo "ERROR: docker is not installed"
  exit 1
fi

if ! docker compose version >/dev/null 2>&1; then
  echo "ERROR: docker compose plugin is required"
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  if [[ -f .env.example ]]; then
    cp .env.example "$ENV_FILE"
    echo "Created $ENV_FILE from .env.example"
    echo "Edit secrets (POSTGRES_PASSWORD, ADMIN_TOKEN, CORS_ORIGINS) and re-run."
    exit 1
  fi
  echo "ERROR: missing $ENV_FILE"
  exit 1
fi

# shellcheck disable=SC1090
set -a
source "$ENV_FILE"
set +a

required_vars=(POSTGRES_DB POSTGRES_USER POSTGRES_PASSWORD ADMIN_TOKEN CORS_ORIGINS)
missing=0
for key in "${required_vars[@]}"; do
  if [[ -z "${!key:-}" ]]; then
    echo "ERROR: $key is empty in $ENV_FILE"
    missing=1
  fi
done
if [[ "$missing" -ne 0 ]]; then
  exit 1
fi

if [[ "$POSTGRES_PASSWORD" == "change-me-strong-password" || "$ADMIN_TOKEN" == "change-me-admin-token" ]]; then
  echo "WARNING: default secrets detected. Change POSTGRES_PASSWORD and ADMIN_TOKEN before public deploy."
fi

if [[ "$DO_PULL" -eq 1 ]]; then
  if [[ -d .git ]]; then
    echo "==> git pull"
    git pull --ff-only
  else
    echo "Skip --pull: not a git repository"
  fi
fi

BUILD_ARGS=( -f "$COMPOSE_FILE" build )
if [[ "$NO_CACHE" -eq 1 ]]; then
  BUILD_ARGS+=( --no-cache )
fi

echo "==> docker compose build"
docker compose "${BUILD_ARGS[@]}"

echo "==> docker compose up"
docker compose -f "$COMPOSE_FILE" up -d --remove-orphans

echo "==> waiting for health"
sleep 3
WEB_PORT_VALUE="${WEB_PORT:-80}"
if command -v curl >/dev/null 2>&1; then
  if curl -fsS "http://127.0.0.1:${WEB_PORT_VALUE}/health" >/dev/null; then
    echo "Health OK: http://127.0.0.1:${WEB_PORT_VALUE}/health"
  else
    echo "WARNING: /health is not ready yet. Check logs:"
    echo "  docker compose -f $COMPOSE_FILE logs -f api"
  fi
fi

echo
echo "Deploy finished."
echo "  Site:    http://SERVER_IP:${WEB_PORT_VALUE}/"
echo "  Admin:   http://SERVER_IP:${WEB_PORT_VALUE}/admin"
echo "  Swagger: http://SERVER_IP:${WEB_PORT_VALUE}/docs"
echo
docker compose -f "$COMPOSE_FILE" ps
