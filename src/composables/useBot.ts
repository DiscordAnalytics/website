import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed, type Ref } from 'vue'

export default function useBot(botId: Ref<string>, scope: APIScope = APIScope.User) {
  const api = useAPI(scope)
  const store = useStore()

  const bot = computed(() => store.userBots.find((bot) => bot.botId === botId.value))

  async function fetch() {
    const index = store.userBots.findIndex((bot) => bot.botId === botId.value)
    const updated = await api.bots.get(botId.value)

    if (index !== -1) store.userBots[index] = updated
    else store.userBots.push(updated)
  }

  async function remove() {
    await api.bots.deleteBot(botId.value)
    store.userBots = store.userBots.filter((bot) => bot.botId !== botId.value)
  }

  async function regenToken() {
    if (!bot.value) throw new Error('Bot not found')
    return api.bots.regenToken(botId.value)
  }

  async function getToken() {
    if (!bot.value) throw new Error('Bot not found')
    return api.bots.getToken(botId.value)
  }

  async function toggleAdvancedStats() {
    if (!bot.value) throw new Error('Bot not found')
    await api.bots.updateSettings(botId.value, { advanced_stats: !bot.value.advancedStats })

    const botIndex = store.userBots.findIndex((b) => b.botId === botId.value)
    if (botIndex >= 0) store.userBots[botIndex]!.advancedStats = !bot.value.advancedStats
  }

  async function updateVotesWebhook(webhookUrl: string) {
    if (!bot.value) throw new Error('Bot not found')
    await api.bots.updateVotesWebhook(botId.value, webhookUrl)

    const botIndex = store.userBots.findIndex((b) => b.botId === botId.value)
    if (botIndex >= 0) store.userBots[botIndex]!.votesWebhookUrl = webhookUrl
  }

  return { bot, fetch, remove, regenToken, getToken, toggleAdvancedStats, updateVotesWebhook }
}
