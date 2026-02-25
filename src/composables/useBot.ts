import useAPI, { APIError, APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed } from 'vue'

export default function useBot(botId: string, scope: APIScope = APIScope.User) {
  const api = useAPI(scope)
  const store = useStore()

  const bot = computed(() => store.userBots.find((bot) => bot.botId === botId))

  async function remove() {
    await api.bots.deleteBot(botId)
    store.userBots = store.userBots.filter((bot) => bot.botId !== botId)
  }

  async function regenToken() {
    if (!bot.value) throw new APIError(404, 'Bot not found')
    return api.bots.regenToken(botId, bot.value.token)
  }

  async function toggleAdvancedStats() {
    if (!bot.value) throw new APIError(404, 'Bot not found')
    return api.bots.updateSettings(botId, { advanced_stats: !bot.value.advancedStats })
  }

  async function updateVotesWebhook(webhookUrl: string) {
    if (!bot.value) throw new APIError(404, 'Bot not found')
    return api.bots.updateVotesWebhook(botId, webhookUrl)
  }

  return { bot }
}
