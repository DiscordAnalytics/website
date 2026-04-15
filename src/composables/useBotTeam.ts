import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed, type Ref } from 'vue'
import type { Teammate } from '@/utils/types.ts'

export default function useBotTeam(botId: Ref<string>) {
  const api = useAPI(APIScope.User)
  const store = useStore()

  const team = computed(() => store.botTeams[botId.value] ?? [])

  async function fetch() {
    if (!api.userId) throw new Error('Not authenticated')
    store.botTeams[botId.value] = await api.bots.getTeammates(botId.value)
  }

  async function add(teammateId: string): Promise<{ sent: boolean; details: Teammate }> {
    if (!api.userId) throw new Error('Not authenticated')
    const result = await api.bots.addTeammate(botId.value, teammateId)
    await fetch()
    return result
  }

  async function remove(teammateId: string) {
    if (!api.userId) throw new Error('Not authenticated')
    await api.bots.deleteTeammate(botId.value, teammateId)

    const list = store.botTeams[botId.value]
    if (!list) return

    const eventIndex = list.findIndex((e) => e.userId === teammateId)
    if (eventIndex >= 0) list.splice(eventIndex, 1)
  }

  return { team, fetch, add, remove }
}
