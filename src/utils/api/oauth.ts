import { type APIClient } from '@/utils/api/index.ts'
import SessionsRessource from '@/utils/api/sessions.ts'
import type { OAuthConfig } from '@/utils/types.ts'

export default class OAuthRessource {
  constructor(private readonly api: APIClient) {}

  get sessions(): SessionsRessource {
    return new SessionsRessource(this.api)
  }

  getConfig(): Promise<OAuthConfig> {
    return this.api.request('GET', `/auth/config`)
  }
}
