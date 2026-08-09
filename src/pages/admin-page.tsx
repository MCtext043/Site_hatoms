import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Archive, ArchiveRestore, Check, ChevronDown, LogOut, RefreshCw, Search } from 'lucide-react'
import {
  type Application,
  type ApplicationFilters,
  type RequestType,
  ApiError,
  clearAdminToken,
  fetchApplications,
  getAdminToken,
  setAdminToken,
  setApplicationArchived,
  verifyAdminToken,
} from '@/lib/api'
import { Button, Eyebrow } from '@/components/ui/primitives'
import { cn } from '@/lib/utils'

const inputClass =
  'w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-200/50'

type TabKey = 'active' | 'archive'

const TYPE_OPTIONS: { value: RequestType | ''; label: string; hint: string }[] = [
  { value: '', label: 'Все типы', hint: 'Без фильтра по сценарию' },
  { value: 'idea', label: 'Есть идея', hint: 'Готовый замысел проекта' },
  { value: 'help', label: 'Нужна помощь', hint: 'Задача без точного решения' },
]

function formatDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value))
}

function typeLabel(type: Application['request_type']) {
  return type === 'idea' ? 'Есть идея' : 'Нужна помощь'
}

function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    const ok = await verifyAdminToken(token.trim())
    setLoading(false)
    if (!ok) {
      setError('Неверный токен администратора')
      return
    }
    setAdminToken(token.trim())
    onSuccess()
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-5 py-16">
      <Eyebrow>Admin</Eyebrow>
      <h1 className="text-4xl font-semibold tracking-[-.05em] text-white">Панель заявок</h1>
      <p className="mt-4 text-sm leading-6 text-zinc-400">Войдите с админ-токеном, чтобы просматривать заявки с сайта.</p>
      <form onSubmit={submit} className="mt-8 rounded-[1.75rem] border border-white/10 bg-white/[.025] p-6">
        <label className="block">
          <span className="text-sm text-zinc-300">Админ-токен</span>
          <input
            type="password"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            required
            className={`mt-2 ${inputClass}`}
            placeholder="Введите токен"
            autoComplete="current-password"
          />
        </label>
        {error && <p className="mt-4 text-sm text-rose-300">{error}</p>}
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Button type="submit" disabled={loading}>{loading ? 'Проверка…' : 'Войти'}</Button>
          <Link to="/" className="text-sm text-zinc-400 transition hover:text-white">На сайт</Link>
        </div>
      </form>
    </div>
  )
}

function TypeFilter({
  value,
  onChange,
}: {
  value: RequestType | ''
  onChange: (value: RequestType | '') => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const selected = TYPE_OPTIONS.find((option) => option.value === value) ?? TYPE_OPTIONS[0]

  useEffect(() => {
    if (!open) return
    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <span className="text-xs uppercase tracking-[.16em] text-zinc-500">Тип</span>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'mt-2 flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition',
          open
            ? 'border-cyan-200/50 bg-cyan-300/[.08] text-white'
            : 'border-white/10 bg-black/20 text-white hover:border-white/25',
        )}
      >
        <span>
          <span className="block text-sm font-medium">{selected.label}</span>
          <span className="mt-0.5 block text-xs text-zinc-500">{selected.hint}</span>
        </span>
        <ChevronDown className={cn('h-4 w-4 shrink-0 text-cyan-200/80 transition', open && 'rotate-180')} />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0c0f16]/95 p-1.5 shadow-[0_20px_60px_rgba(0,0,0,.45)] backdrop-blur-md"
        >
          {TYPE_OPTIONS.map((option) => {
            const active = option.value === value
            return (
              <li key={option.value || 'all'} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-start justify-between gap-3 rounded-xl px-3.5 py-3 text-left transition',
                    active
                      ? 'border border-cyan-200/40 bg-cyan-300/[.1] text-cyan-50'
                      : 'border border-transparent text-zinc-300 hover:border-white/10 hover:bg-white/[.04] hover:text-white',
                  )}
                >
                  <span>
                    <span className="block text-sm font-medium">{option.label}</span>
                    <span className="mt-0.5 block text-xs text-zinc-500">{option.hint}</span>
                  </span>
                  {active && <Check className="mt-0.5 h-4 w-4 shrink-0 text-cyan-200" />}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

function ApplicationCard({
  item,
  onToggleArchive,
  busy,
}: {
  item: Application
  onToggleArchive: (item: Application) => void
  busy: boolean
}) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/[.025] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[.18em] text-cyan-200/70">#{item.id} · {typeLabel(item.request_type)}</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-.03em] text-white">
            {item.project_name || item.challenge?.slice(0, 80) || 'Заявка без названия'}
          </h2>
        </div>
        <div className="flex flex-col items-end gap-2">
          <time className="text-sm text-zinc-500" dateTime={item.created_at}>{formatDate(item.created_at)}</time>
          <button
            type="button"
            disabled={busy}
            onClick={() => onToggleArchive(item)}
            className={cn(
              'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition disabled:opacity-50',
              item.is_archived
                ? 'border-cyan-200/35 bg-cyan-300/[.08] text-cyan-100 hover:border-cyan-200/60'
                : 'border-white/15 bg-white/[.035] text-zinc-300 hover:border-violet-300/40 hover:text-white',
            )}
          >
            {item.is_archived ? <ArchiveRestore className="h-3.5 w-3.5" /> : <Archive className="h-3.5 w-3.5" />}
            {item.is_archived ? 'В активные' : 'В архив'}
          </button>
        </div>
      </div>

      {item.organization && <p className="mt-3 text-sm text-zinc-400"><span className="text-zinc-500">Организация:</span> {item.organization}</p>}
      {item.idea && <p className="mt-3 text-sm leading-6 text-zinc-300">{item.idea}</p>}
      {item.challenge && <p className="mt-3 text-sm leading-6 text-zinc-300">{item.challenge}</p>}

      {!!item.services?.length && (
        <div className="mt-4 flex flex-wrap gap-2">
          {item.services.map((service) => (
            <span key={service} className="rounded-full border border-cyan-200/30 bg-cyan-300/10 px-3 py-1 text-xs text-cyan-100">{service}</span>
          ))}
        </div>
      )}
      {item.other_service && <p className="mt-3 text-sm text-zinc-400">Другое: {item.other_service}</p>}

      <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-4 text-sm text-zinc-300">
        {item.phone && <span>Тел: {item.phone}</span>}
        {item.email && <span>Email: {item.email}</span>}
        {item.telegram && <span>Telegram: {item.telegram}</span>}
        {item.archived_at && <span className="text-zinc-500">В архиве с {formatDate(item.archived_at)}</span>}
      </div>
    </article>
  )
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => Boolean(getAdminToken()))
  const [tab, setTab] = useState<TabKey>('active')
  const [filters, setFilters] = useState<ApplicationFilters>({ q: '', date_from: '', date_to: '', request_type: '' })
  const [applied, setApplied] = useState<ApplicationFilters>({ q: '', date_from: '', date_to: '', request_type: '' })
  const [items, setItems] = useState<Application[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<number | null>(null)
  const requestIdRef = useRef(0)

  const queryFilters = useMemo(
    () => ({
      ...applied,
      scope: tab === 'archive' ? ('archived' as const) : ('active' as const),
    }),
    [applied, tab],
  )

  const load = useCallback(async (nextFilters: ApplicationFilters, signal?: AbortSignal) => {
    const requestId = ++requestIdRef.current
    setLoading(true)
    setError('')
    try {
      const data = await fetchApplications(nextFilters, signal)
      if (requestId !== requestIdRef.current) return
      setItems(data.items)
      setTotal(data.total)
    } catch (err) {
      if (signal?.aborted || (err instanceof DOMException && err.name === 'AbortError')) return
      if (requestId !== requestIdRef.current) return
      const message = err instanceof Error ? err.message : 'Не удалось загрузить заявки'
      setError(message)
      if (err instanceof ApiError && err.status === 401) {
        clearAdminToken()
        setAuthed(false)
      }
    } finally {
      if (requestId === requestIdRef.current) setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authed) return
    const controller = new AbortController()
    void load(queryFilters, controller.signal)
    return () => controller.abort()
  }, [authed, queryFilters, load])

  const emptyMessage = useMemo(() => {
    if (loading) return 'Загрузка…'
    if (error) return error
    return tab === 'archive' ? 'Архив пуст' : 'Активных заявок пока нет'
  }, [loading, error, tab])

  const toggleArchive = async (item: Application) => {
    setBusyId(item.id)
    setError('')
    try {
      await setApplicationArchived(item.id, !item.is_archived)
      // Убираем карточку из текущего списка сразу — без гонки со старым reload
      setItems((prev) => prev.filter((row) => row.id !== item.id))
      setTotal((prev) => Math.max(0, prev - 1))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось обновить статус'
      setError(message)
      if (err instanceof ApiError && err.status === 401) {
        clearAdminToken()
        setAuthed(false)
      }
    } finally {
      setBusyId(null)
    }
  }

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />

  return (
    <div className="relative z-10 mx-auto min-h-screen max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Admin</Eyebrow>
          <h1 className="text-4xl font-semibold tracking-[-.05em] text-white sm:text-5xl">Заявки</h1>
          <p className="mt-3 text-sm text-zinc-400">
            {tab === 'archive' ? 'В архиве' : 'Активных'}: {total}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void load(queryFilters)}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.035] px-4 py-2.5 text-sm text-white transition hover:border-cyan-200/40"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Обновить
          </button>
          <button
            type="button"
            onClick={() => { clearAdminToken(); setAuthed(false) }}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[.035] px-4 py-2.5 text-sm text-white transition hover:border-rose-300/40"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
          <Link to="/" className="inline-flex items-center rounded-full border border-white/15 px-4 py-2.5 text-sm text-zinc-300 transition hover:text-white">На сайт</Link>
        </div>
      </div>

      <div className="mt-8 inline-flex rounded-full border border-white/10 bg-white/[.025] p-1">
        <button
          type="button"
          onClick={() => setTab('active')}
          className={cn(
            'rounded-full px-5 py-2.5 text-sm font-medium transition',
            tab === 'active'
              ? 'bg-gradient-to-r from-cyan-200 to-violet-300 text-zinc-950 shadow-[0_0_24px_rgba(0,212,255,.2)]'
              : 'text-zinc-400 hover:text-white',
          )}
        >
          Активные
        </button>
        <button
          type="button"
          onClick={() => setTab('archive')}
          className={cn(
            'rounded-full px-5 py-2.5 text-sm font-medium transition',
            tab === 'archive'
              ? 'bg-gradient-to-r from-cyan-200 to-violet-300 text-zinc-950 shadow-[0_0_24px_rgba(139,92,246,.25)]'
              : 'text-zinc-400 hover:text-white',
          )}
        >
          Архив
        </button>
      </div>

      <form
        className="mt-6 grid gap-3 rounded-[1.75rem] border border-white/10 bg-white/[.025] p-4 sm:grid-cols-2 lg:grid-cols-5 lg:p-5"
        onSubmit={(event) => {
          event.preventDefault()
          setApplied({ ...filters })
        }}
      >
        <label className="lg:col-span-2">
          <span className="text-xs uppercase tracking-[.16em] text-zinc-500">Поиск</span>
          <div className="relative mt-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              value={filters.q ?? ''}
              onChange={(event) => setFilters((prev) => ({ ...prev, q: event.target.value }))}
              className={`${inputClass} pl-10`}
              placeholder="Имя проекта, контакт, текст…"
            />
          </div>
        </label>
        <label>
          <span className="text-xs uppercase tracking-[.16em] text-zinc-500">С даты</span>
          <input
            type="date"
            value={filters.date_from ?? ''}
            onChange={(event) => setFilters((prev) => ({ ...prev, date_from: event.target.value }))}
            className={`mt-2 ${inputClass}`}
          />
        </label>
        <label>
          <span className="text-xs uppercase tracking-[.16em] text-zinc-500">По дату</span>
          <input
            type="date"
            value={filters.date_to ?? ''}
            onChange={(event) => setFilters((prev) => ({ ...prev, date_to: event.target.value }))}
            className={`mt-2 ${inputClass}`}
          />
        </label>
        <TypeFilter
          value={filters.request_type ?? ''}
          onChange={(request_type) => setFilters((prev) => ({ ...prev, request_type }))}
        />
        <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-5">
          <Button type="submit">Применить фильтры</Button>
          <button
            type="button"
            className="rounded-full border border-white/15 px-4 py-3 text-sm text-zinc-300 transition hover:text-white"
            onClick={() => {
              const empty = { q: '', date_from: '', date_to: '', request_type: '' as const }
              setFilters(empty)
              setApplied(empty)
            }}
          >
            Сбросить
          </button>
        </div>
      </form>

      <div className="mt-8 grid gap-4">
        {items.length === 0 ? (
          <div className="rounded-[1.75rem] border border-dashed border-white/10 px-6 py-16 text-center text-sm text-zinc-500">{emptyMessage}</div>
        ) : (
          items.map((item) => (
            <ApplicationCard
              key={item.id}
              item={item}
              busy={busyId === item.id}
              onToggleArchive={toggleArchive}
            />
          ))
        )}
      </div>
    </div>
  )
}
