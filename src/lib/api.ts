export type RequestType = 'idea' | 'help'

export type ApplicationPayload = {
  request_type: RequestType
  project_name?: string | null
  organization?: string | null
  idea?: string | null
  services?: string[]
  other_service?: string | null
  challenge?: string | null
  phone?: string | null
  email?: string | null
  telegram?: string | null
}

export type Application = ApplicationPayload & {
  id: number
  created_at: string
  services: string[] | null
}

export type ApplicationListResponse = {
  items: Application[]
  total: number
}

export type ApplicationFilters = {
  q?: string
  date_from?: string
  date_to?: string
  request_type?: RequestType | ''
}

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'
const ADMIN_TOKEN_KEY = 'hatoms_admin_token'

export function getAdminToken(): string | null {
  return sessionStorage.getItem(ADMIN_TOKEN_KEY)
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(ADMIN_TOKEN_KEY, token)
}

export function clearAdminToken() {
  sessionStorage.removeItem(ADMIN_TOKEN_KEY)
}

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

async function parseError(response: Response): Promise<string> {
  try {
    const data = await response.json()
    if (typeof data.detail === 'string') return data.detail
    if (Array.isArray(data.detail)) {
      return data.detail.map((item: { msg?: string }) => item.msg ?? JSON.stringify(item)).join('; ')
    }
  } catch {
    /* ignore */
  }
  return `Ошибка запроса (${response.status})`
}

export async function createApplication(payload: ApplicationPayload): Promise<Application> {
  const response = await fetch(`${API_BASE}/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!response.ok) throw new ApiError(await parseError(response), response.status)
  return response.json()
}

export async function fetchApplications(filters: ApplicationFilters = {}): Promise<ApplicationListResponse> {
  const token = getAdminToken()
  if (!token) throw new ApiError('Нет токена администратора', 401)

  const params = new URLSearchParams()
  if (filters.q?.trim()) params.set('q', filters.q.trim())
  if (filters.date_from) params.set('date_from', filters.date_from)
  if (filters.date_to) params.set('date_to', filters.date_to)
  if (filters.request_type) params.set('request_type', filters.request_type)

  const query = params.toString()
  const response = await fetch(`${API_BASE}/applications${query ? `?${query}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new ApiError(await parseError(response), response.status)
  return response.json()
}

export async function verifyAdminToken(token: string): Promise<boolean> {
  const response = await fetch(`${API_BASE}/applications?limit=1`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.ok
}
