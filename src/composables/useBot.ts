import useAPI, { APIScope } from '@/utils/api'
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
    if (!bot.value) throw new Error('Bot not found')
    return api.bots.regenToken(botId)
  }

  async function toggleAdvancedStats() {
    if (!bot.value) throw new Error('Bot not found')
    await api.bots.updateSettings(botId, { advanced_stats: !bot.value.advancedStats })

    const botIndex = store.userBots.findIndex((b) => b.botId === botId)
    if (botIndex >= 0) store.userBots[botIndex]!.advancedStats = !bot.value.advancedStats
  }

  async function updateVotesWebhook(webhookUrl: string) {
    if (!bot.value) throw new Error('Bot not found')
    await api.bots.updateVotesWebhook(botId, webhookUrl)

    const botIndex = store.userBots.findIndex((b) => b.botId === botId)
    if (botIndex >= 0) store.userBots[botIndex]!.votesWebhookUrl = webhookUrl
  }

  return { bot, remove, regenToken, toggleAdvancedStats, updateVotesWebhook }
}
