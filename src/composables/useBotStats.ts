import type { DateRange } from 'reka-ui'
import { type Ref, computed, watch } from 'vue'

import { useStore } from '@/stores'
import useAPI, { APIScope } from '@/utils/api'

import useLoading from './useLoading'

export default function useBotStats(botId: Ref<string>) {
  const api = useAPI(APIScope.User)
  const store = useStore()
  const { isLoading, withLoading } = useLoading()

  const stats = computed(() => store.botStats[botId.value] ?? null)

  async function fetch(range: DateRange) {
    if (!range.start || !range.end) return

    const id = botId.value
    const data = await api.bots.getStats(id, range)

    // The bot may have changed while the request was in flight — discard the stale response
    if (id !== botId.value) return
    store.botStats[id] = data
  }

  // Refetch whenever the bot or the range changes. `StatsRangeSelector` always assigns a brand-new
  // range object, so ranges are compared by value to avoid fetching twice for the same data.
  let lastKey = ''
  watch(
    [botId, () => store.statsRange as DateRange],
    async ([id, range]) => {
      if (!id || !range.start || !range.end) return

      const key = `${id}:${range.start}:${range.end}`
      if (key === lastKey) return
      lastKey = key

      await withLoading(() => fetch(range))
    },
    { immediate: true },
  )

  return { stats, isLoading, fetch }
}
