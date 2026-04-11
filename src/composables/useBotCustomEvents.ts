import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed, type Ref } from 'vue'
import type { CustomEvent } from '@/utils/types.ts'

export default function useBotCustomEvents(botId: Ref<string>, scope: APIScope = APIScope.User) {
  const api = useAPI(scope)
  const store = useStore()

  const events = computed(() => store.botCustomEvents[botId.value] ?? [])

  async function fetch() {
    if (!api.userId) throw new Error('Not authenticated')
    store.botCustomEvents[botId.value] = await api.bots.getEvents(botId.value)
  }

  async function create(body: CustomEvent) {
    if (!api.userId) throw new Error('Not authenticated')
    const event = await api.bots.createEvent(botId.value, body)

    if (!store.botCustomEvents[botId.value]) store.botCustomEvents[botId.value] = []
    store.botCustomEvents[botId.value]?.push(event)
  }

  async function update(event_key: string, graph_name: string) {
    if (!api.userId) throw new Error('Not authenticated')
    const event = await api.bots.updateEvent(botId.value, event_key, graph_name)

    const list = store.botCustomEvents[botId.value] ?? []
    const eventIndex = list.findIndex((e) => e.eventKey === event_key)

    if (eventIndex >= 0) list[eventIndex] = event
    else list.push(event)
  }

  async function remove(event_key: string) {
    if (!api.userId) throw new Error('Not authenticated')
    await api.bots.deleteEvent(botId.value, event_key)

    const list = store.botCustomEvents[botId.value]
    if (!list) return

    const eventIndex = list.findIndex((e) => e.eventKey === event_key)
    if (eventIndex >= 0) list.splice(eventIndex, 1)
  }

  return { events, fetch, create, update, remove }
}
