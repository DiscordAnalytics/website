import { computed, type Ref } from 'vue'
import type { VotesProvider } from '@/utils/types.ts'
import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'

export default function useBotVotesProvider(botId: Ref<string>, provider: VotesProvider) {
  const api = useAPI(APIScope.User)
  const store = useStore()

  const config = computed<{
    connectionId?: string
    webhookSecret?: string
  } | null>(() => store.bots[botId.value]?.webhooksConfig[provider] ?? null)

  async function update(token: string) {
    if (!api.userId) throw new Error('Not authenticated')
    await api.bots.votes.update(botId.value, provider, token)

    if (store.bots[botId.value]?.webhooksConfig[provider]) {
      store.bots[botId.value]!.webhooksConfig[provider]!.webhookSecret = token
    }
  }

  return { config, update }
}
