import { type APIClient } from '@/utils/api/index.ts'
import type { OAuthSession } from '@/utils/types.ts'

export default class SessionsRessource {
  constructor(private readonly api: APIClient) {}

  getAll(): Promise<OAuthSession[]> {
    return this.api.request('GET', `/auth/sessions`)
  }

  revokeAll(): Promise<void> {
    return this.api.request('DELETE', `/auth/sessions`)
  }

  revoke(sessionId: string): Promise<void> {
    return this.api.request('DELETE', `/auth/sessions/${sessionId}`)
  }
}
