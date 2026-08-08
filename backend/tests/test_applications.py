from datetime import datetime, timedelta, timezone

from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from app.models import Application


IDEA_PAYLOAD = {
    "request_type": "idea",
    "project_name": "Сервис доставки",
    "organization": "Логистика и e-commerce",
    "idea": "Нужен сайт и бот для заказов",
    "services": ["Сайт", "Telegram-бот"],
    "other_service": "",
    "phone": "+79991234567",
    "email": "client@example.com",
    "telegram": "@client",
}

HELP_PAYLOAD = {
    "request_type": "help",
    "challenge": "Хотим улучшить работу с клиентами",
    "organization": "Образовательный центр",
    "email": "help@example.com",
}


def test_health(client: TestClient) -> None:
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body["status"] in {"ok", "degraded"}
    assert "database" in body
    assert "environment" in body


def test_create_idea_application(client: TestClient) -> None:
    response = client.post("/api/applications", json=IDEA_PAYLOAD)
    assert response.status_code == 201
    data = response.json()
    assert data["id"] >= 1
    assert data["request_type"] == "idea"
    assert data["project_name"] == "Сервис доставки"
    assert data["services"] == ["Сайт", "Telegram-бот"]
    assert data["email"] == "client@example.com"
    assert data["is_archived"] is False
    assert data["archived_at"] is None
    assert "created_at" in data


def test_create_help_application(client: TestClient) -> None:
    response = client.post("/api/applications", json=HELP_PAYLOAD)
    assert response.status_code == 201
    data = response.json()
    assert data["request_type"] == "help"
    assert data["challenge"] == "Хотим улучшить работу с клиентами"
    assert data["project_name"] is None


def test_create_requires_contact(client: TestClient) -> None:
    payload = {**IDEA_PAYLOAD, "phone": "", "email": None, "telegram": None}
    response = client.post("/api/applications", json=payload)
    assert response.status_code == 422


def test_create_idea_requires_fields(client: TestClient) -> None:
    payload = {**IDEA_PAYLOAD, "project_name": None, "idea": None}
    response = client.post("/api/applications", json=payload)
    assert response.status_code == 422


def test_list_requires_auth(client: TestClient) -> None:
    response = client.get("/api/applications")
    assert response.status_code == 401


def test_list_rejects_bad_token(client: TestClient) -> None:
    response = client.get("/api/applications", headers={"Authorization": "Bearer wrong"})
    assert response.status_code == 401


def test_list_and_search(client: TestClient, admin_headers: dict[str, str]) -> None:
    client.post("/api/applications", json=IDEA_PAYLOAD)
    client.post("/api/applications", json=HELP_PAYLOAD)

    response = client.get("/api/applications", params={"scope": "active"}, headers=admin_headers)
    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 2
    assert len(body["items"]) == 2

    search = client.get(
        "/api/applications",
        params={"q": "доставки", "scope": "active"},
        headers=admin_headers,
    )
    assert search.status_code == 200
    search_body = search.json()
    assert search_body["total"] == 1
    assert search_body["items"][0]["project_name"] == "Сервис доставки"

    by_type = client.get(
        "/api/applications",
        params={"request_type": "help", "scope": "active"},
        headers=admin_headers,
    )
    assert by_type.json()["total"] == 1
    assert by_type.json()["items"][0]["request_type"] == "help"


def test_filter_by_dates(client: TestClient, admin_headers: dict[str, str], db_session: Session) -> None:
    old = Application(
        request_type="idea",
        project_name="Старый проект",
        organization="Org",
        idea="Старая идея",
        services=[],
        email="old@example.com",
        created_at=datetime.now(timezone.utc) - timedelta(days=10),
    )
    new = Application(
        request_type="help",
        challenge="Новая задача",
        email="new@example.com",
        created_at=datetime.now(timezone.utc),
    )
    db_session.add_all([old, new])
    db_session.commit()

    today = datetime.now(timezone.utc).date().isoformat()
    week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).date().isoformat()

    recent = client.get(
        "/api/applications",
        params={"date_from": week_ago, "date_to": today, "scope": "active"},
        headers=admin_headers,
    )
    assert recent.status_code == 200
    assert recent.json()["total"] == 1
    assert recent.json()["items"][0]["email"] == "new@example.com"

    invalid = client.get(
        "/api/applications",
        params={"date_from": today, "date_to": week_ago, "scope": "active"},
        headers=admin_headers,
    )
    assert invalid.status_code == 422


def test_get_application(client: TestClient, admin_headers: dict[str, str]) -> None:
    created = client.post("/api/applications", json=IDEA_PAYLOAD).json()
    response = client.get(f"/api/applications/{created['id']}", headers=admin_headers)
    assert response.status_code == 200
    assert response.json()["id"] == created["id"]

    missing = client.get("/api/applications/9999", headers=admin_headers)
    assert missing.status_code == 404


def test_archive_and_restore(client: TestClient, admin_headers: dict[str, str]) -> None:
    created = client.post("/api/applications", json=IDEA_PAYLOAD).json()
    application_id = created["id"]

    active = client.get("/api/applications", params={"scope": "active"}, headers=admin_headers)
    assert active.json()["total"] == 1
    assert active.json()["items"][0]["is_archived"] is False

    archived_empty = client.get("/api/applications", params={"scope": "archived"}, headers=admin_headers)
    assert archived_empty.json()["total"] == 0

    archived = client.patch(
        f"/api/applications/{application_id}/archive",
        json={"is_archived": True},
        headers=admin_headers,
    )
    assert archived.status_code == 200
    assert archived.json()["is_archived"] is True
    assert archived.json()["archived_at"] is not None

    assert client.get("/api/applications", params={"scope": "active"}, headers=admin_headers).json()["total"] == 0
    archive_list = client.get("/api/applications", params={"scope": "archived"}, headers=admin_headers)
    assert archive_list.json()["total"] == 1
    assert archive_list.json()["items"][0]["id"] == application_id

    restored = client.patch(
        f"/api/applications/{application_id}/archive",
        json={"is_archived": False},
        headers=admin_headers,
    )
    assert restored.status_code == 200
    assert restored.json()["is_archived"] is False
    assert restored.json()["archived_at"] is None
    assert client.get("/api/applications", params={"scope": "active"}, headers=admin_headers).json()["total"] == 1


def test_archive_requires_auth(client: TestClient) -> None:
    created = client.post("/api/applications", json=IDEA_PAYLOAD).json()
    response = client.patch(
        f"/api/applications/{created['id']}/archive",
        json={"is_archived": True},
    )
    assert response.status_code == 401


def test_openapi_docs_available(client: TestClient) -> None:
    docs = client.get("/docs")
    openapi = client.get("/openapi.json")
    assert docs.status_code == 200
    assert openapi.status_code == 200
    assert openapi.json()["info"]["title"] == "HATOMS Applications API"
