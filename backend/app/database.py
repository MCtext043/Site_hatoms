from collections.abc import Generator

from sqlalchemy import create_engine, inspect, text
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import get_settings


class Base(DeclarativeBase):
    pass


def _make_engine():
    settings = get_settings()
    if settings.is_sqlite:
        return create_engine(
            settings.database_url,
            connect_args={"check_same_thread": False},
        )
    return create_engine(
        settings.database_url,
        pool_pre_ping=True,
        pool_size=settings.db_pool_size,
        max_overflow=settings.db_max_overflow,
    )


engine = _make_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def _ensure_archive_columns() -> None:
    """Add archive columns to existing DBs created before this feature."""
    inspector = inspect(engine)
    if "applications" not in inspector.get_table_names():
        return

    existing = {column["name"] for column in inspector.get_columns("applications")}
    statements: list[str] = []

    if "is_archived" not in existing:
        if get_settings().is_sqlite:
            statements.append(
                "ALTER TABLE applications ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT 0"
            )
        else:
            statements.append(
                "ALTER TABLE applications ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE"
            )

    if "archived_at" not in existing:
        if get_settings().is_sqlite:
            statements.append("ALTER TABLE applications ADD COLUMN archived_at DATETIME")
        else:
            statements.append("ALTER TABLE applications ADD COLUMN archived_at TIMESTAMPTZ")

    if not statements:
        # Heal rows that somehow got NULL in is_archived
        with engine.begin() as connection:
            if get_settings().is_sqlite:
                connection.execute(
                    text("UPDATE applications SET is_archived = 0 WHERE is_archived IS NULL")
                )
            else:
                connection.execute(
                    text("UPDATE applications SET is_archived = FALSE WHERE is_archived IS NULL")
                )
        return

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))
        if get_settings().is_sqlite:
            connection.execute(
                text("UPDATE applications SET is_archived = 0 WHERE is_archived IS NULL")
            )
        else:
            connection.execute(
                text("UPDATE applications SET is_archived = FALSE WHERE is_archived IS NULL")
            )


def init_db() -> None:
    from app import models  # noqa: F401

    Base.metadata.create_all(bind=engine)
    _ensure_archive_columns()


def check_db_connection() -> bool:
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return True
    except Exception:
        return False
