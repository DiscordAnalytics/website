import UsersResource from '@/utils/api/users.ts'
import { useCookies } from '@vueuse/integrations/useCookies'
import BotsResource from '@/utils/api/bots.ts'
import { useConfig } from '@/composables'
import { computed, reactive } from 'vue'
import { oneMonthInSec } from '@/utils/dateTime.ts'
import OAuthRessource from '@/utils/api/oauth.ts'
import ArticlesResource from '@/utils/api/articles.ts'

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
  Guest,
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
  readonly scope: APIScope
  private readonly authTokens = useAuthToken()

  constructor(scope: APIScope) {
    const { apiBaseUrl } = useConfig()

    this.baseUrl = apiBaseUrl
    this.scope = scope
  }

  private async getHeaders(): Promise<HeadersInit> {
    const accesToken = await this.authTokens.getAccessToken()
    switch (this.scope) {
      case APIScope.User:
        return { Authorization: `User ${accesToken}` }
      case APIScope.Admin:
        return { Authorization: `Admin ${accesToken}` }
      default:
        return {}
    }
  }

  public get userId(): string | null {
    return this.authTokens.userId.value
  }

  public clearTokens() {
    this.authTokens.clearTokens()
  }

  async request<T>(
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    path: string,
    body?: unknown,
    contentType: string = 'application/json',
  ): Promise<T> {
    const headers = {
      ...(await this.getHeaders()),
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
      const message = await response.json().catch(() => response.statusText)
      throw new APIError(response.status, message.error)
    }

    return response.json() as Promise<T>
  }

  get users(): UsersResource {
    return new UsersResource(this)
  }

  get bots(): BotsResource {
    return new BotsResource(this)
  }

  get oauth(): OAuthRessource {
    return new OAuthRessource(this)
  }

  get articles(): ArticlesResource {
    return new ArticlesResource(this)
  }
}

export function useAuthToken() {
  const cookies = useCookies()
  const refreshToken = cookies.get('refresh_token')
  const userId = cookies.get('user_id', { doNotParse: true })

  if (userId) authState.userId = userId

  function setTokens(tokens: {
    accessToken: string
    expiresIn: number
    refreshToken: string
    userId?: string
  }) {
    authState.accessToken = tokens.accessToken
    // Add 30s buffer to refresh before actual expiration
    authState.accessTokenExpiration = Date.now() + (tokens.expiresIn - 30) * 1000

    cookies.set('refresh_token', tokens.refreshToken, {
      secure: true,
      sameSite: 'strict',
      maxAge: oneMonthInSec,
      path: '/',
    })

    if (tokens.userId) {
      authState.userId = tokens.userId
      cookies.set('user_id', tokens.userId, {
        secure: true,
        sameSite: 'strict',
        maxAge: oneMonthInSec,
        path: '/',
      })
    }
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
    return Date.now() >= authState.accessTokenExpiration
  }

  async function getAccessToken(): Promise<string | null> {
    if (authState.accessToken && !isAccessTokenExpired()) {
      return authState.accessToken
    }
    await refreshAccessToken()
    return authState.accessToken
  }

  async function refreshAccessToken() {
    if (!refreshToken) {
      clearTokens()
      return
    }

    try {
      const response = await fetch(`${window.CONFIG.apiBaseUrl}/auth/refresh`, {
        method: 'POST',
        body: JSON.stringify({ refreshToken }),
        headers: {
          'Content-Type': 'application/json',
        },
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
  return new APIClient(scope)
}
