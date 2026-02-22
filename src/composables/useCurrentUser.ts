import useAPI, { APIError, APIScope } from '@/utils/api'
import { useStore } from '@/stores'

export default function useCurrentUser() {
  const api = useAPI(APIScope.User)
  const store = useStore()

  async function fetch() {
    if (!api.userId) throw new APIError(401, 'Not Authenticated')
    store.userInfos = await api.users.get(api.userId)
    const { ownedBots, inBotTeam } = await api.users.getBots(api.userId)
    store.userBots = [...ownedBots, ...inBotTeam]
  }

  return { fetch }
}
