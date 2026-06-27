import { type APIClient, SessionsRessource } from '@/utils/api'
import type { OAuthConfig } from '@/utils/types'

export default class OAuthRessource {
  constructor(private readonly api: APIClient) {}

  get sessions(): SessionsRessource {
    return new SessionsRessource(this.api)
  }

  getConfig(): Promise<OAuthConfig> {
    return this.api.request('GET', `/auth/config`)
  }
}
