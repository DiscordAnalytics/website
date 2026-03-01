import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed } from 'vue'

export default function useCurrentUser() {
  const api = useAPI(APIScope.User)
  const store = useStore()

  const userInfos = computed(() => store.userInfos)

  async function fetch() {
    if (!api.userId) throw new Error('Not Authenticated')
    store.userInfos = await api.users.get(api.userId)
    const { ownedBots, inBotTeam } = await api.users.getBots(api.userId)
    store.userBots = [...ownedBots, ...inBotTeam]
  }

  return { fetch, userInfos }
}
