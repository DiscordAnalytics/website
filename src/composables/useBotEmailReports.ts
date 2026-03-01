import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed } from 'vue'

export default function useBotEmailReports(botId: string) {
  const api = useAPI(APIScope.User)
  const store = useStore()

  const reports = computed(() => store.botEmailReports[botId] ?? [])

  async function fetch() {
    if (!api.userId) throw new Error('Not authenticated')
    store.botEmailReports[botId] = await api.bots.getEmailReports(botId)
  }

  async function create(frequency: 'weekly' | 'monthly') {
    if (!api.userId) throw new Error('Not authenticated')
    const report = await api.bots.createEmailReport(botId, frequency)

    if (!store.botEmailReports[botId]) store.botEmailReports[botId] = []
    store.botEmailReports[botId].push(report)
  }

  async function remove(frequency: 'weekly' | 'monthly') {
    if (!api.userId) throw new Error('Not authenticated')
    await api.bots.deleteEmailReport(botId, frequency)

    const list = store.botEmailReports[botId] ?? []
    const eventIndex = list.findIndex((r) => r.user_id === api.userId && r.frequency === frequency)

    if (eventIndex >= 0) list.splice(eventIndex, 1)
  }

  return { reports, fetch, create, remove }
}
