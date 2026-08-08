from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator, model_validator


RequestType = Literal["idea", "help"]


class ApplicationCreate(BaseModel):
    request_type: RequestType
    project_name: str | None = Field(default=None, max_length=255)
    organization: str | None = Field(default=None, max_length=512)
    idea: str | None = None
    services: list[str] = Field(default_factory=list)
    other_service: str | None = Field(default=None, max_length=255)
    challenge: str | None = None
    phone: str | None = Field(default=None, max_length=64)
    email: EmailStr | None = None
    telegram: str | None = Field(default=None, max_length=128)

    @field_validator(
        "project_name",
        "organization",
        "idea",
        "other_service",
        "challenge",
        "phone",
        "telegram",
        "email",
        mode="before",
    )
    @classmethod
    def empty_str_to_none(cls, value: object) -> object:
        if isinstance(value, str) and not value.strip():
            return None
        if isinstance(value, str):
            return value.strip()
        return value

    @field_validator("services", mode="before")
    @classmethod
    def normalize_services(cls, value: object) -> object:
        if value is None:
            return []
        if isinstance(value, list):
            return [item.strip() for item in value if isinstance(item, str) and item.strip()]
        return value

    @model_validator(mode="after")
    def validate_payload(self) -> "ApplicationCreate":
        if not any([self.phone, self.email, self.telegram]):
            raise ValueError("Укажите хотя бы один способ связи: phone, email или telegram")

        if self.request_type == "idea":
            missing = [
                name
                for name, value in (
                    ("project_name", self.project_name),
                    ("organization", self.organization),
                    ("idea", self.idea),
                )
                if not value
            ]
            if missing:
                raise ValueError(f"Для типа idea обязательны поля: {', '.join(missing)}")
        else:
            if not self.challenge:
                raise ValueError("Для типа help обязательно поле challenge")

        return self


class ApplicationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    request_type: RequestType
    project_name: str | None
    organization: str | None
    idea: str | None
    services: list[str] | None
    other_service: str | None
    challenge: str | None
    phone: str | None
    email: str | None
    telegram: str | None
    created_at: datetime


class ApplicationListResponse(BaseModel):
    items: list[ApplicationRead]
    total: int
