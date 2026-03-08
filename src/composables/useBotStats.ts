import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed } from 'vue'
import type { DateRange } from 'reka-ui'

export default function useBotStats(botId: string) {
  const api = useAPI(APIScope.User)
  const store = useStore()

  const stats = computed(() => store.botStats[botId] ?? null)

  async function fetch(range: DateRange) {
    store.botStats[botId] = await api.bots.getStats(botId, range)
  }

  return { stats, fetch }
}
