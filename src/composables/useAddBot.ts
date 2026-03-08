import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'

export default function useAddBot(scope: APIScope = APIScope.User) {
  const api = useAPI(scope)
  const store = useStore()

  async function add(botId: string) {
    const res = await api.bots.add(botId, api.userId ?? '')
    store.userBots.push(res)
  }

  return { add }
}
