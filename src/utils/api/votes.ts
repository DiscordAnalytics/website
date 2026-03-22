import type { APIClient } from '@/utils/api/index.ts'
import type { VotesProvider } from '@/utils/types.ts'

export default class VotesProviderResource {
  constructor(readonly api: APIClient) {}

  update(botId: string, provider: VotesProvider, token: string): Promise<void> {
    //return this.api.request('PATCH', `/bots/${botId}/providers/${provider}`, { token })
    // TODO: Implement vote providers
    throw new Error('Not implemented')
  }
}
