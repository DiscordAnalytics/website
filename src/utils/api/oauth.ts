import { type APIClient } from '@/utils/api/index.ts'
import type { OAuthConfig } from '@/utils/types.ts'

export default class OAuthRessource {
  constructor(private readonly api: APIClient) {}

  getConfig(): Promise<OAuthConfig> {
    return this.api.request('GET', `/auth/config`)
  }
}
