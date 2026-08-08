import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, RefreshCw, Search } from 'lucide-react'
import {
  type Application,
  type ApplicationFilters,
  ApiError,
  clearAdminToken,
  fetchApplications,
  getAdminToken,
  setAdminToken,
  verifyAdminToken,
} from '@/lib/api'
import { Button, Eyebrow } from '@/components/ui/primitives'

const inputClass =
  'w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-cyan-200/50'

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

function ApplicationCard({ item }: { item: Application }) {
  return (
    <article className="rounded-[1.75rem] border border-white/10 bg-white/[.025] p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[.18em] text-cyan-200/70">#{item.id} · {typeLabel(item.request_type)}</p>
          <h2 className="mt-2 text-xl font-semibold tracking-[-.03em] text-white">
            {item.project_name || item.challenge?.slice(0, 80) || 'Заявка без названия'}
          </h2>
        </div>
        <time className="text-sm text-zinc-500" dateTime={item.created_at}>{formatDate(item.created_at)}</time>
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
      </div>
    </article>
  )
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(() => Boolean(getAdminToken()))
  const [filters, setFilters] = useState<ApplicationFilters>({ q: '', date_from: '', date_to: '', request_type: '' })
  const [applied, setApplied] = useState<ApplicationFilters>({ q: '', date_from: '', date_to: '', request_type: '' })
  const [items, setItems] = useState<Application[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(async (nextFilters: ApplicationFilters) => {
    setLoading(true)
    setError('')
    try {
      const data = await fetchApplications(nextFilters)
      setItems(data.items)
      setTotal(data.total)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось загрузить заявки'
      setError(message)
      if (err instanceof ApiError && err.status === 401) {
        clearAdminToken()
        setAuthed(false)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authed) return
    void load(applied)
  }, [authed, applied, load])

  const emptyMessage = useMemo(() => {
    if (loading) return 'Загрузка…'
    if (error) return error
    return 'Заявок пока нет'
  }, [loading, error])

  if (!authed) return <AdminLogin onSuccess={() => setAuthed(true)} />

  return (
    <div className="relative z-10 mx-auto min-h-screen max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Eyebrow>Admin</Eyebrow>
          <h1 className="text-4xl font-semibold tracking-[-.05em] text-white sm:text-5xl">Заявки</h1>
          <p className="mt-3 text-sm text-zinc-400">Всего: {total}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => void load(applied)}
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

      <form
        className="mt-8 grid gap-3 rounded-[1.75rem] border border-white/10 bg-white/[.025] p-4 sm:grid-cols-2 lg:grid-cols-5 lg:p-5"
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
        <label>
          <span className="text-xs uppercase tracking-[.16em] text-zinc-500">Тип</span>
          <select
            value={filters.request_type ?? ''}
            onChange={(event) => setFilters((prev) => ({ ...prev, request_type: event.target.value as ApplicationFilters['request_type'] }))}
            className={`mt-2 ${inputClass}`}
          >
            <option value="">Все</option>
            <option value="idea">Есть идея</option>
            <option value="help">Нужна помощь</option>
          </select>
        </label>
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
          items.map((item) => <ApplicationCard key={item.id} item={item} />)
        )}
      </div>
    </div>
  )
}
