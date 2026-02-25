import useAPI, { APIError, APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed } from 'vue'

export default function useBotCustomEvents(botId: string) {
  const api = useAPI(APIScope.User)
  const store = useStore()

  const events = computed(() => store.botCustomEvents[botId])

  async function fetch() {
    if (!api.userId) throw new APIError(401, 'Not authenticated')
    store.botCustomEvents[botId] = await api.bots.getEvents(botId)
  }

  async function create(body: { event_key: string; graph_name: string }) {
    if (!api.userId) throw new APIError(401, 'Not authenticated')
    const event = await api.bots.createEvent(botId, body)
    events.value?.push(event)
  }

  async function update(event_key: string, graph_name: string) {
    if (!api.userId) throw new APIError(401, 'Not authenticated')
    const event = await api.bots.updateEvent(botId, event_key, graph_name)
    const eventIndex = events.value?.findIndex((event) => event.event_key === event_key) ?? -1
    if (eventIndex >= 0) {
      events.value![eventIndex]!.graph_name = event.graph_name
    } else events.value?.push(event)
  }

  async function remove(event_key: string) {
    if (!api.userId) throw new APIError(401, 'Not authenticated')
    await api.bots.deleteEvent(botId, event_key)
    const eventIndex = events.value?.findIndex((event) => event.event_key === event_key) ?? -1
    if (eventIndex >= 0) events.value?.pop()
  }

  return { events, fetch, create, update, remove }
}
