import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed } from 'vue'

export default function useBotCustomEvents(botId: string) {
  const api = useAPI(APIScope.User)
  const store = useStore()

  const events = computed(() => store.botCustomEvents[botId] ?? [])

  async function fetch() {
    if (!api.userId) throw new Error('Not authenticated')
    store.botCustomEvents[botId] = await api.bots.getEvents(botId)
  }

  async function create(body: { eventKey: string; graphName: string }) {
    if (!api.userId) throw new Error('Not authenticated')
    const event = await api.bots.createEvent(botId, body)

    if (!store.botCustomEvents[botId]) store.botCustomEvents[botId] = []
    store.botCustomEvents[botId].push(event)
  }

  async function update(event_key: string, graph_name: string) {
    if (!api.userId) throw new Error('Not authenticated')
    const event = await api.bots.updateEvent(botId, event_key, graph_name)

    const list = store.botCustomEvents[botId] ?? []
    const eventIndex = list.findIndex((e) => e.eventKey === event_key)

    if (eventIndex >= 0) list[eventIndex] = event
    else list.push(event)
  }

  async function remove(event_key: string) {
    if (!api.userId) throw new Error('Not authenticated')
    await api.bots.deleteEvent(botId, event_key)

    const list = store.botCustomEvents[botId]
    if (!list) return

    const eventIndex = list.findIndex((e) => e.eventKey === event_key)
    if (eventIndex >= 0) list.splice(eventIndex, 1)
  }

  return { events, fetch, create, update, remove }
}
