import useAPI, { APIError, APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed } from 'vue'
import type { Achievement } from '@/utils/types.ts'

export default function useBotAchievements(botId: string) {
  const api = useAPI(APIScope.User)
  const store = useStore()

  const achievements = computed(() => store.botAchievements[botId] ?? [])

  async function fetch() {
    if (!api.userId) throw new APIError(401, 'Not authenticated')
    store.botAchievements[botId] = await api.bots.getAchievements(botId)
  }

  async function create(
    body: Pick<Achievement, 'objective' | 'title' | 'description' | 'shared' | 'from' | 'lang'>,
  ) {
    if (!api.userId) throw new APIError(401, 'Not authenticated')
    const achievement = await api.bots.createAchievement(botId, body)
    if (!store.botAchievements[botId]) store.botAchievements[botId] = []
    store.botAchievements[botId].push(achievement)
  }

  async function update(
    body: Pick<Achievement, 'description' | 'id' | 'title' | 'lang' | 'shared'>,
  ) {
    if (!api.userId) throw new APIError(401, 'Not authenticated')
    const achievement = await api.bots.updateAchievement(botId, body)

    const list = store.botAchievements[botId] ?? []
    const index = list.findIndex((achv) => achv.id === body.id)

    if (index >= 0) list[index] = achievement
    else list.push(achievement)
  }

  async function remove(achievementId: string) {
    if (!api.userId) throw new APIError(401, 'Not authenticated')
    await api.bots.deleteAchievement(botId, achievementId)
    const list = store.botAchievements[botId]
    if (!list) return

    const index = list.findIndex((achv) => achv.id === achievementId)
    if (index >= 0) list.splice(index, 1)
  }

  async function reset() {
    if (!api.userId) throw new APIError(401, 'Not authenticated')
    store.botAchievements[botId] = []
  }

  return { achievements, fetch, create, update, remove, reset }
}
