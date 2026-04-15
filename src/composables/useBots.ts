import useAPI, { APIScope } from '@/utils/api'
import { computed } from 'vue'
import { useStore } from '@/stores'
import type { Bot } from '@/utils/types.ts'

export default function useBots() {
  const api = useAPI(APIScope.Admin)
  const store = useStore()

  const bots = computed(() => Object.values(store.bots))

  async function fetch() {
    if (!api.userId) throw new Error('Not authenticated')
    const allBots = await api.bots.getAll()
    for (const bot of allBots) {
      store.bots[bot.botId] = bot
    }
  }

  async function updateLimits(
    botId: string,
    goalsLimit: number,
    customEventsLimit: number,
    teammatesLimit: number,
  ) {
    if (!api.userId) throw new Error('Not authenticated')

    await api.bots.updateLimits(botId, goalsLimit, customEventsLimit, teammatesLimit)

    store.bots[botId] = {
      ...store.bots[botId],
      goalsLimit,
      customEventsLimit,
      teammatesLimit,
    } as Bot
  }

  async function suspend(botId: string, reason: string) {
    if (!api.userId) throw new Error('Not authenticated')
    await api.bots.suspend(botId, reason)

    store.bots[botId]!.suspended = true
  }

  async function remove(botId: string) {
    if (!api.userId) throw new Error('Not authenticated')
    await api.bots.deleteBot(botId)
    delete store.bots[botId]
  }

  return { bots, fetch, updateLimits, suspend, remove }
}
