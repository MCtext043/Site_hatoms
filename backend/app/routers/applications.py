from datetime import date, datetime, time, timezone

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, or_, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import require_admin
from app.models import Application
from app.schemas import (
    ApplicationArchiveUpdate,
    ApplicationCreate,
    ApplicationListResponse,
    ApplicationRead,
)

router = APIRouter(prefix="/applications", tags=["Applications"])


def _start_of_day(value: date) -> datetime:
    return datetime.combine(value, time.min, tzinfo=timezone.utc)


def _end_of_day(value: date) -> datetime:
    return datetime.combine(value, time.max, tzinfo=timezone.utc)


@router.post(
    "",
    response_model=ApplicationRead,
    status_code=status.HTTP_201_CREATED,
    summary="Создать заявку",
    description="Публичный эндпоинт для отправки заявки с сайта.",
)
def create_application(payload: ApplicationCreate, db: Session = Depends(get_db)) -> Application:
    application = Application(
        request_type=payload.request_type,
        project_name=payload.project_name,
        organization=payload.organization,
        idea=payload.idea,
        services=payload.services,
        other_service=payload.other_service,
        challenge=payload.challenge,
        phone=payload.phone,
        email=str(payload.email) if payload.email else None,
        telegram=payload.telegram,
        is_archived=False,
    )
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@router.get(
    "",
    response_model=ApplicationListResponse,
    summary="Список заявок",
    description=(
        "Админский список заявок с поиском, фильтром по датам и статусу архива. "
        "Требует Bearer-токен."
    ),
    dependencies=[Depends(require_admin)],
)
def list_applications(
    q: str | None = Query(default=None, description="Поиск по названию, организации, идее, контактам"),
    date_from: date | None = Query(default=None, description="Начало периода (включительно), YYYY-MM-DD"),
    date_to: date | None = Query(default=None, description="Конец периода (включительно), YYYY-MM-DD"),
    request_type: str | None = Query(default=None, pattern="^(idea|help)$", description="Фильтр по типу заявки"),
    scope: str = Query(
        default="active",
        pattern="^(active|archived)$",
        description="active — активные заявки, archived — архив",
    ),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=200),
    db: Session = Depends(get_db),
) -> ApplicationListResponse:
    if date_from and date_to and date_from > date_to:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="date_from не может быть позже date_to",
        )

    want_archived = scope == "archived"
    filters = [Application.is_archived.is_(want_archived)]

    if request_type:
        filters.append(Application.request_type == request_type)

    if date_from:
        filters.append(Application.created_at >= _start_of_day(date_from))
    if date_to:
        filters.append(Application.created_at <= _end_of_day(date_to))

    if q and q.strip():
        pattern = f"%{q.strip()}%"
        filters.append(
            or_(
                Application.project_name.ilike(pattern),
                Application.organization.ilike(pattern),
                Application.idea.ilike(pattern),
                Application.challenge.ilike(pattern),
                Application.other_service.ilike(pattern),
                Application.phone.ilike(pattern),
                Application.email.ilike(pattern),
                Application.telegram.ilike(pattern),
            )
        )

    base = select(Application).where(*filters)

    total = db.scalar(select(func.count()).select_from(base.subquery())) or 0
    items = list(
        db.scalars(base.order_by(Application.created_at.desc()).offset(skip).limit(limit)).all()
    )

    return ApplicationListResponse(items=items, total=total)


@router.get(
    "/{application_id}",
    response_model=ApplicationRead,
    summary="Получить заявку",
    description="Админский просмотр одной заявки. Требует Bearer-токен.",
    dependencies=[Depends(require_admin)],
)
def get_application(application_id: int, db: Session = Depends(get_db)) -> Application:
    application = db.get(Application, application_id)
    if application is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заявка не найдена")
    return application


@router.patch(
    "/{application_id}/archive",
    response_model=ApplicationRead,
    summary="Архивировать / разархивировать заявку",
    description="Перемещает заявку в архив или возвращает в активные. Требует Bearer-токен.",
    dependencies=[Depends(require_admin)],
)
def set_application_archive(
    application_id: int,
    payload: ApplicationArchiveUpdate,
    db: Session = Depends(get_db),
) -> Application:
    application = db.get(Application, application_id)
    if application is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Заявка не найдена")

    application.is_archived = payload.is_archived
    application.archived_at = datetime.now(timezone.utc) if payload.is_archived else None
    db.commit()
    db.refresh(application)
    return application
