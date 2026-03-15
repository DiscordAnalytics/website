import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed } from 'vue'

export default function useBotTeam(botId: string) {
  const api = useAPI(APIScope.User)
  const store = useStore()

  const team = computed(() => store.botTeams[botId] ?? [])

  async function fetch() {
    if (!api.userId) throw new Error('Not authenticated')
    store.botTeams[botId] = (await api.bots.getTeammates(botId)).team
  }

  async function add(
    teammateId: string,
    sendMethod?: 'mail',
  ): Promise<{ invitationId: string; message: string }> {
    if (!api.userId) throw new Error('Not authenticated')
    const result = await api.bots.addTeammate(botId, teammateId, sendMethod)
    await fetch()
    return result
  }

  async function remove(teammateId: string) {
    if (!api.userId) throw new Error('Not authenticated')
    await api.bots.deleteTeammate(botId, teammateId)

    const list = store.botTeams[botId]
    if (!list) return

    const eventIndex = list.findIndex((e) => e.userId === teammateId)
    if (eventIndex >= 0) list.splice(eventIndex, 1)
  }

  return { team, fetch, add, remove }
}
