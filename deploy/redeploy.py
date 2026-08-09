#!/usr/bin/env python3
"""Upload local tree to VPS and run HTTP deploy. Invoked by redeploy.ps1."""

from __future__ import annotations

import os
import sys
import tarfile
import time
from pathlib import Path

try:
    import paramiko
except ImportError:
    print("ERROR: paramiko is required. Run: pip install paramiko", file=sys.stderr)
    sys.exit(1)

HOST = os.environ["HATOMS_REDEPLOY_HOST"]
USER = os.environ["HATOMS_REDEPLOY_USER"]
PASSWORD = os.environ["HATOMS_REDEPLOY_PASSWORD"]
REMOTE_DIR = os.environ.get("HATOMS_REDEPLOY_REMOTE", "/opt/hatoms")
ROOT = Path(os.environ["HATOMS_REDEPLOY_ROOT"])
NO_CACHE = os.environ.get("HATOMS_REDEPLOY_NO_CACHE", "0") == "1"
SKIP_BUILD = os.environ.get("HATOMS_REDEPLOY_SKIP_BUILD", "0") == "1"

EXCLUDE_DIRS = {
    "node_modules",
    ".git",
    ".venv",
    "dist",
    "__pycache__",
    ".pytest_cache",
    "tmp",
    ".idea",
    ".vscode",
    ".cursor",
    "agent-transcripts",
}
EXCLUDE_FILES = {"hatoms-deploy.tgz", ".deploy-secrets.local"}


def run(client: paramiko.SSHClient, cmd: str, timeout: int = 900) -> tuple[int, str, str]:
    print(f">>> {cmd}", flush=True)
    _, stdout, stderr = client.exec_command(cmd, timeout=timeout)
    out = stdout.read().decode("utf-8", "replace")
    err = stderr.read().decode("utf-8", "replace")
    code = stdout.channel.recv_exit_status()
    if out:
        print(out[-12000:] if len(out) > 12000 else out, end="" if out.endswith("\n") else "\n", flush=True)
    if err.strip():
        print("ERR:", err[-6000:], flush=True)
    print("exit:", code, flush=True)
    return code, out, err


def make_archive(path: Path) -> None:
    print("Creating archive...", flush=True)
    with tarfile.open(path, "w:gz") as tar:
        for dirpath, dirnames, filenames in os.walk(ROOT):
            dirnames[:] = [d for d in dirnames if d not in EXCLUDE_DIRS]
            rel_dir = Path(dirpath).relative_to(ROOT)
            if any(p in EXCLUDE_DIRS for p in rel_dir.parts):
                continue
            for fn in filenames:
                if fn in EXCLUDE_FILES or fn.endswith((".pyc", ".pyo")):
                    continue
                if fn == "server.local.env":
                    continue
                full = Path(dirpath) / fn
                if rel_dir == Path("."):
                    arcname = f"hatoms/{fn}"
                else:
                    arcname = f"hatoms/{rel_dir.as_posix()}/{fn}"
                tar.add(full, arcname=arcname)
    print(f"Archive: {path} ({path.stat().st_size / (1024 * 1024):.1f} MB)", flush=True)


def ensure_remote_env(sftp: paramiko.SFTPClient) -> str:
    """Keep existing secrets; ensure HTTP WEB_PORT / CORS."""
    remote_env = f"{REMOTE_DIR}/.env"
    try:
        with sftp.file(remote_env, "r") as f:
            current = f.read().decode("utf-8", "replace")
    except OSError:
        current = ""

    lines = [ln for ln in current.splitlines() if ln.strip() and not ln.strip().startswith("#")]
    kv: dict[str, str] = {}
    for ln in lines:
        if "=" in ln:
            k, v = ln.split("=", 1)
            kv[k.strip()] = v.strip()

    kv.setdefault("POSTGRES_DB", "hatoms")
    kv.setdefault("POSTGRES_USER", "hatoms")
    kv.setdefault("DB_POOL_SIZE", "5")
    kv.setdefault("DB_MAX_OVERFLOW", "5")
    kv["WEB_PORT"] = kv.get("WEB_PORT") or "8080"
    # Drop HTTPS-only leftovers
    kv.pop("PUBLIC_DOMAIN", None)
    kv.pop("ACME_EMAIL", None)
    kv.pop("PUBLIC_HOST", None)

    web_port = kv["WEB_PORT"]
    origins = [
        f"http://{HOST}:{web_port}",
        f"http://{HOST}",
        f"http://127.0.0.1:{web_port}",
        "http://localhost:8080",
    ]
    parts = [p.strip() for p in kv.get("CORS_ORIGINS", "").split(",") if p.strip()]
    # Prefer HTTP origins; drop https:// for this host to avoid mixed-mode confusion
    parts = [p for p in parts if not p.startswith(f"https://{HOST}")]
    for origin in origins:
        if origin not in parts:
            parts.append(origin)
    kv["CORS_ORIGINS"] = ",".join(parts)

    if "POSTGRES_PASSWORD" not in kv or "ADMIN_TOKEN" not in kv:
        print("ERROR: remote .env missing POSTGRES_PASSWORD or ADMIN_TOKEN", file=sys.stderr)
        sys.exit(1)

    body = "\n".join(f"{k}={v}" for k, v in kv.items()) + "\n"
    with sftp.file(remote_env, "w") as f:
        f.write(body)
    print(f"Updated remote .env (HTTP WEB_PORT={web_port})", flush=True)
    return web_port


def main() -> None:
    archive = ROOT / "hatoms-deploy.tgz"
    make_archive(archive)

    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(
        HOST,
        username=USER,
        password=PASSWORD,
        timeout=30,
        allow_agent=False,
        look_for_keys=False,
    )

    run(
        client,
        "cd /opt/furniture && docker compose -f docker-compose.server.yml stop "
        "minio rabbitmq planner-service cutting-service assets-service catalog-service auth-service "
        "2>/dev/null || true",
    )
    run(client, "sync; echo 3 > /proc/sys/vm/drop_caches 2>/dev/null || true; free -h")

    print("Uploading...", flush=True)
    sftp = client.open_sftp()
    sftp.put(str(archive), "/tmp/hatoms-deploy.tgz")

    run(client, f"mkdir -p {REMOTE_DIR} && cp -a {REMOTE_DIR}/.env /tmp/hatoms.env.bak 2>/dev/null || true")
    run(
        client,
        "rm -rf /opt/hatoms.new && mkdir -p /opt/hatoms.new && "
        "tar -xzf /tmp/hatoms-deploy.tgz -C /opt/hatoms.new && "
        "rm -f /tmp/hatoms-deploy.tgz && "
        f"rm -rf {REMOTE_DIR} && mv /opt/hatoms.new/hatoms {REMOTE_DIR} && "
        "rm -rf /opt/hatoms.new",
    )
    run(client, f"cp -a /tmp/hatoms.env.bak {REMOTE_DIR}/.env 2>/dev/null || true")
    web_port = ensure_remote_env(sftp)
    sftp.close()

    run(client, f"ufw allow {web_port}/tcp || true")
    run(client, f"chmod +x {REMOTE_DIR}/deploy/deploy.sh")

    # Remove old HTTPS caddy stack leftovers
    run(
        client,
        f"cd {REMOTE_DIR} && docker compose -f docker-compose.prod.yml stop caddy 2>/dev/null || true; "
        f"docker rm -f hatoms-prod-caddy-1 2>/dev/null || true",
    )

    if SKIP_BUILD:
        code, _, _ = run(
            client,
            f"cd {REMOTE_DIR} && docker compose -f docker-compose.prod.yml up -d --remove-orphans",
        )
    else:
        build_extra = " --no-cache" if NO_CACHE else ""
        code, _, _ = run(
            client,
            f"cd {REMOTE_DIR} && DOCKER_BUILDKIT=1 docker compose -f docker-compose.prod.yml build{build_extra} api",
            timeout=1200,
        )
        if code != 0:
            sys.exit(code)
        code, _, _ = run(
            client,
            f"cd {REMOTE_DIR} && DOCKER_BUILDKIT=1 docker compose -f docker-compose.prod.yml build{build_extra} web",
            timeout=1200,
        )
        if code != 0:
            sys.exit(code)
        code, _, _ = run(
            client,
            f"cd {REMOTE_DIR} && docker compose -f docker-compose.prod.yml up -d --remove-orphans",
            timeout=600,
        )
    if code != 0:
        run(client, f"cd {REMOTE_DIR} && docker compose -f docker-compose.prod.yml logs --tail=80")
        sys.exit(code)

    for _ in range(20):
        _, out, _ = run(client, f"curl -fsS -m 5 http://127.0.0.1:{web_port}/health || true")
        if out.strip().startswith("{") or "ok" in out.lower():
            print("HEALTH", out, flush=True)
            break
        time.sleep(3)
    else:
        run(client, f"cd {REMOTE_DIR} && docker compose -f docker-compose.prod.yml ps")
        run(client, f"cd {REMOTE_DIR} && docker compose -f docker-compose.prod.yml logs --tail=100 api web")

    run(client, f"cd {REMOTE_DIR} && docker compose -f docker-compose.prod.yml ps")
    run(
        client,
        "cd /opt/furniture && docker compose -f docker-compose.server.yml start "
        "minio rabbitmq planner-service cutting-service assets-service catalog-service auth-service "
        "2>/dev/null || true",
    )

    client.close()
    try:
        archive.unlink(missing_ok=True)
    except OSError:
        pass

    print()
    print("REDEPLOY_OK")
    print(f"Site:  http://{HOST}:{web_port}/")
    print(f"Admin: http://{HOST}:{web_port}/admin")


if __name__ == "__main__":
    main()
