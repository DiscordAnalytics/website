import type { APIClient } from '@/utils/api/index.ts'
import type { VotesProvider } from '@/utils/types.ts'

export default class VotesProviderResource {
  constructor(readonly api: APIClient) {}

  update(botId: string, provider: VotesProvider, webhookSecret: string): Promise<void> {
    return this.api.request(
      'POST',
      `/integrations/${provider}`,
      provider === 'topgg'
        ? {
            data: {
              project: {
                platform: 'discord',
                platform_id: botId,
                type: 'bot',
              },
              user: {
                platform_id: this.api.userId,
              },
              webhook_secret: webhookSecret,
            },
            type: 'integration.create',
          }
        : {
            botId,
            userId: this.api.userId!,
            webhookSecret,
          },
    )
  }
}
