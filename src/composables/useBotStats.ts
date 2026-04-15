import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed, type Ref } from 'vue'
import type { DateRange } from 'reka-ui'
import posthog from 'posthog-js'

export default function useBotStats(botId: Ref<string>) {
  const api = useAPI(APIScope.User)
  const store = useStore()

  const stats = computed(() => store.botStats[botId.value] ?? null)

  async function fetch(range: DateRange) {
    store.botStats[botId.value] = await api.bots.getStats(botId.value, range)
    if (range.start && range.end) {
      posthog.capture('stats_range_changed', {
        bot_id: botId.value,
        start: range.start.toString(),
        end: range.end.toString(),
      })
    }
  }

  return { stats, fetch }
}
