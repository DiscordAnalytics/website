import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed, type Ref } from 'vue'
import type { DateRange } from 'reka-ui'

export default function useBotStats(botId: Ref<string>) {
  const api = useAPI(APIScope.User)
  const store = useStore()

  const stats = computed(() => store.botStats[botId.value] ?? null)

  async function fetch(range: DateRange) {
    store.botStats[botId.value] = await api.bots.getStats(botId.value, range)
  }

  return { stats, fetch }
}
