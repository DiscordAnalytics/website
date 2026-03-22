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
  } | null>(
    () => store.userBots.find((bot) => bot.botId === botId.value)?.webhooksConfig[provider] ?? null,
  )

  async function update(token: string) {
    if (!api.userId) throw new Error('Not authenticated')
    await api.bots.votes.update(botId.value, provider, token)

    const botIndex = store.userBots.findIndex((b) => b.botId === botId.value)
    if (botIndex >= 0) store.userBots[botIndex]!.webhooksConfig[provider]!.webhookSecret = token
  }

  return { config, update }
}
