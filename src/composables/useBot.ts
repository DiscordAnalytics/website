import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed, ref, type Ref } from 'vue'

export default function useBot(
  botId: Ref<string>,
  ownerId: Ref<string | null> = ref(null),
  scope: APIScope = APIScope.User,
) {
  const api = useAPI(scope)
  const store = useStore()
  if (!ownerId.value) ownerId = ref(api.userId)

  const bot = computed(() =>
    ownerId.value
      ? (store.userBots[ownerId.value]?.find((bot) => bot.botId === botId.value) ?? null)
      : null,
  )

  async function fetch() {
    const index =
      store.userBots[ownerId.value!]?.findIndex((bot) => bot.botId === botId.value) ?? -1
    const updated = await api.bots.get(botId.value)

    if (index !== -1) store.userBots[ownerId.value!]![index] = updated
    else store.userBots[ownerId.value!]!.push(updated)
  }

  async function remove() {
    await api.bots.deleteBot(botId.value)
    store.userBots[ownerId.value!]! = store.userBots[ownerId.value!]!.filter(
      (bot) => bot.botId !== botId.value,
    )
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

    const botIndex = store.userBots[ownerId.value!]!.findIndex((b) => b.botId === botId.value)
    if (botIndex >= 0)
      store.userBots[ownerId.value!]![botIndex]!.advancedStats = !bot.value.advancedStats
  }

  async function updateVotesWebhook(webhookUrl: string) {
    if (!bot.value) throw new Error('Bot not found')
    await api.bots.updateVotesWebhook(botId.value, webhookUrl)

    const botIndex = store.userBots[ownerId.value!]!.findIndex((b) => b.botId === botId.value)
    if (botIndex >= 0)
      store.userBots[ownerId.value!]![botIndex]!.webhooksConfig.webhookUrl = webhookUrl
  }

  async function testVotesWebhook() {
    if (!api.userId) throw new Error('Not authenticated')
    await api.bots.votes.test(botId.value)
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
  }
}
