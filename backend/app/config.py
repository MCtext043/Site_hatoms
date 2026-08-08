from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=(BACKEND_DIR / ".env", ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    app_name: str = "HATOMS Applications API"
    app_env: str = "development"
    admin_token: str = "change-me-admin-token"
    database_url: str = "postgresql+psycopg://hatoms:hatoms@localhost:5432/hatoms"
    cors_origins: str = "http://localhost:5173,http://127.0.0.1:5173"
    db_pool_size: int = 5
    db_max_overflow: int = 10

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def is_sqlite(self) -> bool:
        return self.database_url.startswith("sqlite")


@lru_cache
def get_settings() -> Settings:
    return Settings()
