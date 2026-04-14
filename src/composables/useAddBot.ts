import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'

export default function useAddBot(scope: APIScope = APIScope.User) {
  const api = useAPI(scope)
  const store = useStore()

  async function add(botId: string) {
    const res = await api.bots.add(botId, api.userId ?? '')
    store.bots[res.botId] = res
    if (store.userBotIds[api.userId!]) {
      store.userBotIds[api.userId!]!.push(res.botId)
    } else {
      store.userBotIds[api.userId!] = [res.botId]
    }
  }

  return { add }
}
