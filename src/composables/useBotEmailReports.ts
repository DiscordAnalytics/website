import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed, type Ref } from 'vue'

export default function useBotEmailReports(botId: Ref<string>) {
  const api = useAPI(APIScope.User)
  const store = useStore()

  const reports = computed(() => store.botEmailReports[botId.value] ?? [])

  async function fetch() {
    if (!api.userId) throw new Error('Not authenticated')
    store.botEmailReports[botId.value] = await api.bots.getEmailReports(botId.value)
  }

  async function create(frequency: 'weekly' | 'monthly') {
    if (!api.userId) throw new Error('Not authenticated')
    const report = await api.bots.createEmailReport(botId.value, frequency)

    if (!store.botEmailReports[botId.value]) store.botEmailReports[botId.value] = []
    store.botEmailReports[botId.value]!.push(report)
  }

  async function remove(frequency: 'weekly' | 'monthly') {
    if (!api.userId) throw new Error('Not authenticated')
    await api.bots.deleteEmailReport(botId.value, frequency)

    const list = store.botEmailReports[botId.value] ?? []
    const eventIndex = list.findIndex((r) => r.userId === api.userId && r.frequency === frequency)

    if (eventIndex >= 0) list.splice(eventIndex, 1)
  }

  return { reports, fetch, create, remove }
}
