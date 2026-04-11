import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed, type Ref } from 'vue'

export default function useBot(botId: Ref<string>, scope: APIScope = APIScope.User) {
  const api = useAPI(scope)
  const store = useStore()

  const bot = computed(() => store.bots[botId.value] ?? null)

  async function fetch() {
    store.bots[botId.value] = await api.bots.get(botId.value)
  }

  async function remove() {
    const ownerId = store.bots[botId.value]?.ownerId
    await api.bots.deleteBot(botId.value)
    delete store.bots[botId.value]
    if (ownerId && store.userBotIds[ownerId]) {
      store.userBotIds[ownerId] = store.userBotIds[ownerId]!.filter((id) => id !== botId.value)
    }
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
    await api.bots.updateSettings(botId.value, !bot.value.advancedStats)
    store.bots[botId.value]!.advancedStats = !bot.value.advancedStats
  }

  async function updateVotesWebhook(webhookUrl: string) {
    if (!bot.value) throw new Error('Bot not found')
    await api.bots.updateVotesWebhook(botId.value, webhookUrl)
    store.bots[botId.value]!.webhooksConfig.webhookUrl = webhookUrl
  }

  async function testVotesWebhook() {
    if (!api.userId) throw new Error('Not authenticated')
    await api.bots.votes.test(botId.value)
  }

  async function unsuspend() {
    if (!api.userId) throw new Error('Not authenticated')
    await api.bots.unsuspend(botId.value)

    store.bots[botId.value]!.suspended = false
  }

  return {
    bot,
    fetch,
    remove,
    regenToken,
    getToken,
    toggleAdvancedStats,
    updateVotesWebhook,
    testVotesWebhook,
    unsuspend,
  }
}
