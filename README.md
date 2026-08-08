# HATOMS

Сайт digital-студии **HATOMS** и backend для приёма заявок с публичной формы.  
Клиенты оставляют заявку на лендинге — команда просматривает их в админ-панели с поиском и фильтрами.

---

## Содержание

- [Возможности](#возможности)
- [Стек](#стек)
- [Архитектура](#архитектура)
- [Структура репозитория](#структура-репозитория)
- [Локальный запуск](#локальный-запуск)
- [Тесты](#тесты)
- [Деплой на сервер](#деплой-на-сервер)
- [API и админка](#api-и-админка)
- [Переменные окружения](#переменные-окружения)

---

## Возможности

### Публичный сайт
- Лендинг с проектами, стеком технологий и событиями
- Модальная форма **«Оставить заявку»** (два сценария: *есть идея* / *нужна помощь*)
- Отправка заявки на backend с валидацией контактов

### Админ-панель (`/admin`)
- Вход по Bearer-токену администратора
- Список заявок в стилистике сайта
- Поиск по тексту (проект, организация, идея, контакты)
- Фильтрация по датам и типу заявки

### Backend API
- Публичное создание заявок
- Защищённый список и просмотр заявок
- Поиск, фильтр по датам и типу
- Автодокументация Swagger / OpenAPI
- Health-check с проверкой PostgreSQL

---

## Стек

| Слой | Технологии |
|------|------------|
| **Frontend** | React, TypeScript, Vite, Tailwind CSS v4, Framer Motion, Lenis, React Router |
| **Backend** | FastAPI, Pydantic v2, SQLAlchemy 2, Uvicorn |
| **БД** | PostgreSQL 16 |
| **Инфра** | Docker, Docker Compose, nginx |
| **Тесты** | Pytest + httpx / TestClient |

Тесты API используют in-memory SQLite, чтобы не требовать живую БД при CI/локальном прогоне.  
Рабочее окружение (dev и prod) — **только PostgreSQL**.

---

## Архитектура

```text
┌─────────────────────┐         ┌──────────────────────┐
│  React (Vite)       │  /api   │  FastAPI             │
│  лендинг + /admin   │ ──────► │  routers / schemas   │
└─────────────────────┘         └──────────┬───────────┘
                                           │ SQLAlchemy
                                           ▼
                                  ┌──────────────────┐
                                  │  PostgreSQL 16   │
                                  │  applications    │
                                  └──────────────────┘
```

### Backend — слои

```text
backend/app/
├── main.py           # FastAPI app, CORS, lifespan, /health
├── config.py         # Settings из .env (pydantic-settings)
├── database.py       # Engine, Session, init_db, health DB
├── models.py         # ORM-модель Application
├── schemas.py        # Pydantic DTO + валидация бизнес-правил
├── dependencies.py   # Bearer-проверка ADMIN_TOKEN
└── routers/
    └── applications.py   # HTTP-эндпоинты заявок
```

| Слой | Роль |
|------|------|
| **Router** | HTTP-контракт, query-параметры, статус-коды |
| **Schema** | Валидация входа/выхода (тип заявки, обязательные поля, контакт) |
| **Model** | Таблица `applications` в PostgreSQL |
| **Dependency** | Защита админских маршрутов токеном |
| **Config** | `DATABASE_URL`, `ADMIN_TOKEN`, `CORS_ORIGINS`, пул соединений |

### Поток заявки

1. Пользователь заполняет модалку на сайте  
2. Frontend шлёт `POST /api/applications`  
3. Pydantic проверяет тип (`idea` / `help`), поля и наличие контакта  
4. SQLAlchemy сохраняет запись в PostgreSQL  
5. Админ открывает `/admin`, авторизуется токеном и видит заявки  
6. Список запрашивается через `GET /api/applications?q=&date_from=&date_to=`

### Модель данных (`applications`)

| Поле | Описание |
|------|----------|
| `id` | PK |
| `request_type` | `idea` \| `help` |
| `project_name`, `organization`, `idea`, `services`, `other_service` | поля сценария «есть идея» |
| `challenge` | поле сценария «нужна помощь» |
| `phone`, `email`, `telegram` | контакты (хотя бы один) |
| `created_at` | UTC timestamp |

---

## Структура репозитория

```text
Site_hatoms/
├── src/                      # React-приложение
│   ├── pages/admin-page.tsx  # Админ-панель заявок
│   ├── lib/api.ts            # Клиент API
│   └── components/…          # UI лендинга
├── backend/                  # FastAPI
│   ├── app/                  # Код приложения
│   ├── tests/                # Pytest
│   ├── Dockerfile
│   ├── requirements.txt
│   └── .env.example
├── deploy/
│   ├── Dockerfile.frontend   # Сборка SPA + nginx
│   └── nginx.conf            # SPA + proxy /api → FastAPI
├── docker-compose.yml        # Локально: PostgreSQL (+ optional API)
├── docker-compose.prod.yml   # Прод: db + api + web
├── .env.example              # Env для Compose / сервера
└── README.md
```

---

## Локальный запуск

Нужны: **Node.js 20+**, **Python 3.12+**, **Docker** (для PostgreSQL).

### 1. Клонирование и окружение

```bash
git clone <repo-url> Site_hatoms
cd Site_hatoms

cp .env.example .env
cp backend/.env.example backend/.env
```

При желании смените `ADMIN_TOKEN` и пароль БД в обоих `.env`.

### 2. PostgreSQL

```bash
docker compose up -d db
# или: npm run db:up
```

Проверка: контейнер `hatoms-db` в статусе healthy, порт `5432`.

### 3. Backend

```bash
# из корня репозитория
python -m venv .venv

# Windows
.\.venv\Scripts\activate
# macOS / Linux
source .venv/bin/activate

pip install -r backend/requirements.txt
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

- API: http://127.0.0.1:8000  
- Swagger: http://127.0.0.1:8000/docs  
- Health: http://127.0.0.1:8000/health  

`DATABASE_URL` по умолчанию:  
`postgresql+psycopg://hatoms:hatoms@localhost:5432/hatoms`

### 4. Frontend

В новом терминале из корня:

```bash
npm install
npm run dev
```

Сайт: http://localhost:5173  
Админка: http://localhost:5173/admin  

Vite проксирует `/api` на `http://127.0.0.1:8000`.

### Альтернатива: API тоже в Docker

```bash
docker compose --profile full up -d --build
```

Поднятся PostgreSQL и FastAPI. Frontend по-прежнему через `npm run dev`.

### Остановка БД

```bash
docker compose down
# данные сохраняются в volume hatoms_pg_data
# полное удаление данных: docker compose down -v
```

---

## Тесты

Тесты не требуют PostgreSQL (изолированная SQLite in-memory):

```bash
# с активированным venv
cd backend
pytest -v
```

Покрыто: создание заявок `idea`/`help`, валидация, авторизация админа, поиск, фильтр по датам, OpenAPI.

---

## Деплой на сервер

Рекомендуемый способ — **Docker Compose (prod)**: PostgreSQL + FastAPI + nginx со статикой.

### 1. Подготовка сервера

- Docker + Docker Compose plugin  
- Открыт порт `80` (или свой `WEB_PORT`)  
- (Опционально) reverse-proxy / TLS снаружи (Caddy, Traefik, Cloudflare)

### 2. Конфиг

```bash
cp .env.example .env
nano .env
```

Обязательно задайте:

| Переменная | Зачем |
|------------|--------|
| `POSTGRES_PASSWORD` | Сильный пароль БД |
| `ADMIN_TOKEN` | Секрет входа в `/admin` |
| `CORS_ORIGINS` | Домены сайта, например `https://hatoms.example` |

### 3. Запуск

```bash
docker compose -f docker-compose.prod.yml up -d --build
```

Сервисы:

| Сервис | Роль |
|--------|------|
| `db` | PostgreSQL 16 |
| `api` | FastAPI (внутренняя сеть) |
| `web` | nginx: статика + proxy `/api`, `/docs`, `/health` |

Сайт: `http://<server>`  
Админка: `http://<server>/admin`  
Swagger: `http://<server>/docs`

### 4. Обновление

```bash
git pull
docker compose -f docker-compose.prod.yml up -d --build
```

### 5. Логи и статус

```bash
docker compose -f docker-compose.prod.yml ps
docker compose -f docker-compose.prod.yml logs -f api
```

Таблицы создаются автоматически при старте API (`create_all`).  
Для сложных миграций в будущем можно подключить Alembic — текущая схема укладывается в один bootstrap.

---

## API и админка

### Эндпоинты

| Метод | Путь | Доступ | Описание |
|-------|------|--------|----------|
| `POST` | `/api/applications` | публичный | Создать заявку |
| `GET` | `/api/applications` | Bearer | Список + `q`, `date_from`, `date_to`, `request_type` |
| `GET` | `/api/applications/{id}` | Bearer | Одна заявка |
| `GET` | `/health` | публичный | Статус приложения и БД |
| `GET` | `/docs` | публичный | Swagger UI |

### Пример создания заявки

```bash
curl -X POST http://127.0.0.1:8000/api/applications \
  -H "Content-Type: application/json" \
  -d '{
    "request_type": "idea",
    "project_name": "Сервис доставки",
    "organization": "E-commerce",
    "idea": "Сайт и Telegram-бот для заказов",
    "services": ["Сайт", "Telegram-бот"],
    "email": "client@example.com"
  }'
```

### Пример списка (админ)

```bash
curl "http://127.0.0.1:8000/api/applications?q=доставки&date_from=2026-01-01" \
  -H "Authorization: Bearer change-me-admin-token"
```

В UI админки тот же токен вводится на экране входа и хранится в `sessionStorage`.

---

## Переменные окружения

### Backend (`backend/.env`)

| Переменная | Описание | Пример |
|------------|----------|--------|
| `DATABASE_URL` | SQLAlchemy URL PostgreSQL | `postgresql+psycopg://hatoms:hatoms@localhost:5432/hatoms` |
| `ADMIN_TOKEN` | Токен админа | `super-secret` |
| `CORS_ORIGINS` | Разрешённые origins | `http://localhost:5173` |
| `APP_ENV` | `development` / `production` | `development` |
| `DB_POOL_SIZE` | Размер пула | `5` |
| `DB_MAX_OVERFLOW` | Overflow пула | `10` |

### Compose (корневой `.env`)

| Переменная | Описание |
|------------|----------|
| `POSTGRES_DB` / `USER` / `PASSWORD` | Учётные данные PostgreSQL |
| `POSTGRES_PORT` | Порт БД на хосте (локально) |
| `WEB_PORT` | Порт nginx в проде (по умолчанию 80) |
| `ADMIN_TOKEN` | Токен для API в проде |
| `CORS_ORIGINS` | Origins для CORS |

---

## Быстрый чеклист

**Локально**

1. `docker compose up -d db`  
2. `pip install -r backend/requirements.txt` → `uvicorn` из `backend/`  
3. `npm install` → `npm run dev`  
4. Открыть сайт и `/admin`

**Прод**

1. Заполнить `.env`  
2. `docker compose -f docker-compose.prod.yml up -d --build`  
3. Проверить `/health` и отправку тестовой заявки  

---

Сделано командой HATOMS. Вопросы по заявкам — через форму на сайте или Telegram менеджера.
