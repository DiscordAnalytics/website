import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed, type Ref } from 'vue'
import type { Achievement } from '@/utils/types.ts'
import { goal2Percent } from '@/utils/statsManager.ts'

export default function useBotAchievements(botId: Ref<string>, scope: APIScope = APIScope.User) {
  const api = useAPI(scope)
  const store = useStore()

  const achievements = computed(
    () =>
      store.botAchievements[botId.value]?.sort((a, b) => {
        const percentA = goal2Percent(a)
        const percentB = goal2Percent(b)

        if (percentA === percentB) return 0
        if (percentA === 100) return 1
        if (percentB === 100) return -1
        return percentB - percentA
      }) ?? [],
  )

  async function fetch() {
    if (!api.userId) throw new Error('Not authenticated')
    store.botAchievements[botId.value] = await api.bots.getAchievements(botId.value)
  }

  async function create(
    body: Pick<Achievement, 'objective' | 'title' | 'description' | 'shared' | 'from' | 'lang'>,
  ) {
    if (!api.userId) throw new Error('Not authenticated')
    const achievement = await api.bots.createAchievement(botId.value, body)
    if (!store.botAchievements[botId.value]) store.botAchievements[botId.value] = []
    store.botAchievements[botId.value]!.push(achievement)
  }

  async function update(
    body: Partial<Pick<Achievement, 'description' | 'title' | 'lang' | 'shared'>> & { id: string },
  ) {
    if (!api.userId) throw new Error('Not authenticated')
    const achievement = await api.bots.updateAchievement(botId.value, body)

    const list = store.botAchievements[botId.value] ?? []
    const index = list.findIndex((achv) => achv.id === body.id)

    if (index >= 0) list[index] = achievement
    else list.push(achievement)
  }

  async function remove(achievementId: string) {
    if (!api.userId) throw new Error('Not authenticated')
    await api.bots.deleteAchievement(botId.value, achievementId)
    const list = store.botAchievements[botId.value]
    if (!list) return

    const index = list.findIndex((achv) => achv.id === achievementId)
    if (index >= 0) list.splice(index, 1)
  }

  async function reset() {
    if (!api.userId) throw new Error('Not authenticated')
    await api.bots.resetAchievements(botId.value)
    store.botAchievements[botId.value] = []
  }

  return { achievements, fetch, create, update, remove, reset }
}
