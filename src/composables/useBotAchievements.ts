import useAPI, { APIError, APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed } from 'vue'
import type { Achievement } from '@/utils/types.ts'

export default function useBotAchievements(botId: string) {
  const api = useAPI(APIScope.User)
  const store = useStore()

  const achievements = computed(() => store.botAchievements[botId])

  async function fetch() {
    if (!api.userId) throw new APIError(401, 'Not authenticated')
    store.botAchievements[botId] = await api.bots.getAchievements(botId)
  }

  async function create(
    body: Pick<Achievement, 'objective' | 'title' | 'description' | 'shared' | 'from' | 'lang'>,
  ) {
    if (!api.userId) throw new APIError(401, 'Not authenticated')
    return api.bots.createAchievement(botId, body)
  }

  async function update(
    body: Pick<Achievement, 'description' | 'id' | 'title' | 'lang' | 'shared'>,
  ) {
    if (!api.userId) throw new APIError(401, 'Not authenticated')
    return api.bots.updateAchievement(botId, body)
  }

  async function remove(achievementId: string) {
    if (!api.userId) throw new APIError(401, 'Not authenticated')
    return api.bots.deleteAchievement(botId, achievementId)
  }

  async function reset() {
    if (!api.userId) throw new APIError(401, 'Not authenticated')
    return api.bots.resetAchievements(botId)
  }

  return { achievements, fetch, create, update, remove, reset }
}
