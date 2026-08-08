from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    request_type: Mapped[str] = mapped_column(String(16), nullable=False, index=True)
    project_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    organization: Mapped[str | None] = mapped_column(String(512), nullable=True)
    idea: Mapped[str | None] = mapped_column(Text, nullable=True)
    services: Mapped[list | None] = mapped_column(JSON, nullable=True)
    other_service: Mapped[str | None] = mapped_column(String(255), nullable=True)
    challenge: Mapped[str | None] = mapped_column(Text, nullable=True)
    phone: Mapped[str | None] = mapped_column(String(64), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    telegram: Mapped[str | None] = mapped_column(String(128), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=utc_now,
        index=True,
    )
