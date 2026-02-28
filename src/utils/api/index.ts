import UsersResource from '@/utils/api/users.ts'
import { useCookies } from '@vueuse/integrations'
import BotsResource from '@/utils/api/bots.ts'
import { useConfig } from '@/composables/useConfig.ts'
import { computed, reactive } from 'vue'

const authState = reactive<{
  userId: string | null
  accessToken: string | null
  accessTokenExpiration: number | null
}>({
  userId: null,
  accessToken: null,
  accessTokenExpiration: null,
})

export enum APIScope {
  User,
  Admin,
}

export class APIError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(`${status} - ${message}`)
    this.name = 'APIError'
  }
}

export class APIClient {
  private readonly baseUrl: string
  private readonly headers: { [key: string]: string } = {}
  readonly scope: APIScope
  readonly userId: string | null

  constructor(userId: string | null, token: string | null, scope: APIScope) {
    const { apiBaseUrl } = useConfig()

    this.baseUrl = apiBaseUrl
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

export function useAuthToken() {
  const cookies = useCookies()
  const refreshToken = cookies.get('refresh_token')
  const userId = cookies.get('user_id')

  if (userId) authState.userId = userId

  if (refreshToken && !authState.accessToken) refreshAccessToken()

  function setTokens(tokens: {
    accessToken: string
    accessTokenExpiration: number
    refreshToken: string
    userId: string
  }) {
    authState.accessToken = tokens.accessToken
    authState.accessTokenExpiration = tokens.accessTokenExpiration
    authState.userId = tokens.userId

    cookies.set('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })

    cookies.set('user_id', tokens.userId, {
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    })
  }

  function clearTokens() {
    authState.accessToken = null
    authState.accessTokenExpiration = null
    authState.userId = null
    cookies.remove('refresh_token')
    cookies.remove('user_id')
  }

  function isAccessTokenExpired(): boolean {
    if (!authState.accessTokenExpiration) return true
    // Add 60s buffer to refresh before actual expiration
    return Date.now() >= authState.accessTokenExpiration - 60000
  }

  async function getAccessToken(): Promise<string | null> {
    if (authState.accessToken && !isAccessTokenExpired()) {
      return authState.accessToken
    }
    await refreshAccessToken()
    return authState.accessToken
  }

  async function refreshAccessToken() {
    const refreshToken = cookies.get('refresh_token')
    if (!refreshToken) {
      clearTokens()
      return
    }

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include', // Send cookies
      })

      if (!response.ok) throw new Error('Refresh failed')

      const data = await response.json()
      setTokens(data)
    } catch (error) {
      console.error('Token refresh failed:', error)
      clearTokens()
    }
  }

  return {
    userId: computed(() => authState.userId),
    accessToken: computed(() => authState.accessToken),
    setTokens,
    clearTokens,
    getAccessToken,
    refreshAccessToken,
    isAuthenticated: computed(() => !!authState.userId && !!authState.accessToken),
  }
}

export default function useAPI(scope: APIScope): APIClient {
  const { userId, accessToken } = useAuthToken()
  return new APIClient(userId.value, accessToken.value, scope)
}
