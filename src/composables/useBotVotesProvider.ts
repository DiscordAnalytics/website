import { type Ref, computed } from 'vue'

import { useStore } from '@/stores'
import useAPI, { APIScope } from '@/utils/api'
import type { VotesProvider } from '@/utils/types'

export default function useBotVotesProvider(botId: Ref<string>, provider: VotesProvider) {
  const api = useAPI(APIScope.User)
  const store = useStore()

  const config = computed<{
    connectionId?: string
    webhookSecret?: string
  } | null>(() => store.bots[botId.value]?.webhooksConfig?.providers?.[provider] ?? null)

  async function update(token: string) {
    if (!api.userId) throw new Error('Not authenticated')
    await api.bots.votes.update(botId.value, provider, token)

    const bot = store.bots[botId.value]
    if (!bot) return

    // The provider has no entry yet on a first-time configuration
    bot.webhooksConfig = {
      ...bot.webhooksConfig,
      providers: {
        ...bot.webhooksConfig?.providers,
        [provider]: { ...bot.webhooksConfig?.providers?.[provider], webhookSecret: token },
      },
    }
  }

  return { config, update }
}
