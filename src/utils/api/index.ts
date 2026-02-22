import UsersResource from '@/utils/api/users.ts'
import { useCookies } from '@vueuse/integrations'
import BotsResource from '@/utils/api/bots.ts'

export enum APIScope {
  User,
  Admin,
}

export class APIError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export class APIClient {
  private readonly baseUrl: string
  private readonly headers: { [key: string]: string } = {}
  readonly scope: APIScope
  readonly userId: string | null

  constructor(userId: string | null, token: string | null, scope: APIScope) {
    const baseUrl = import.meta.env.VITE_API_URL
    if (!baseUrl) throw new Error('Missing VITE_API_URL env variable')

    this.baseUrl = baseUrl
    this.userId = userId
    this.scope = scope

    switch (scope) {
      case APIScope.User:
        this.headers = { Authorization: `User ${token}` }
        break
      case APIScope.Admin:
        this.headers = { Authorization: `Admin ${token}` }
        break
    }
  }

  // ─── Low-level fetch wrapper ────────────────────────────────────────────────

  async request<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    path: string,
    body?: unknown,
    contentType: string = 'application/json',
  ): Promise<T> {
    const headers = {
      ...this.headers,
      'Content-Type': contentType,
    }

    // eslint-disable no-invalid-fetch-options
    const response = await fetch(`${this.baseUrl}${path}`, {
      method,
      headers,
      keepalive: true,
      body: body !== undefined && method != 'GET' ? JSON.stringify(body) : undefined,
    })
    // eslint-enable no-invalid-fetch-options

    if (!response.ok) {
      const message = await response.text().catch(() => response.statusText)
      throw new APIError(response.status, message)
    }

    return response.json() as Promise<T>
  }

  get users(): UsersResource {
    return new UsersResource(this)
  }

  get bots(): BotsResource {
    return new BotsResource(this)
  }
}

export function useAuthToken(): { userId: string | null; token: string | null } {
  const cookies = useCookies()
  const raw: string | undefined = cookies.get('token')
  if (!raw) return { userId: null, token: null }
  const [userId, token] = raw.split(' ')
  return { userId: userId ?? null, token: token ?? null }
}

export default function useAPI(scope: APIScope): APIClient {
  const { userId, token } = useAuthToken()
  return new APIClient(userId, token, scope)
}
