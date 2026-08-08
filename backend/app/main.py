from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.database import check_db_connection, init_db
from app.routers import applications_router


@asynccontextmanager
async def lifespan(_: FastAPI):
    init_db()
    yield


settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    description=(
        "API для приёма заявок с сайта HATOMS и админского просмотра.\n\n"
        "**Публично:** `POST /api/applications`\n\n"
        "**Админ (Bearer-токен):**\n"
        "- `GET /api/applications` — список, поиск и фильтры\n"
        "- `GET /api/applications/{id}` — одна заявка"
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(applications_router, prefix="/api")


@app.get("/health", tags=["Health"], summary="Проверка работоспособности")
def health() -> dict[str, str]:
    db_ok = check_db_connection()
    return {
        "status": "ok" if db_ok else "degraded",
        "database": "up" if db_ok else "down",
        "environment": settings.app_env,
    }
