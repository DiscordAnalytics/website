import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed, ref } from 'vue'
import { useBotAchievements } from '@/composables'

export default function useAchievementsStore(scope: APIScope = APIScope.User) {
  const api = useAPI(scope)
  const store = useStore()

  const achievements = computed(() => store.achievementsStore ?? [])

  async function fetch() {
    store.achievementsStore = await api.bots.getAchievements()
  }

  async function copy(botId: string, achievementId: string) {
    if (!api.userId) throw new Error('Not authenticated')
    const achievement = achievements.value.find((achv) => achv.id === achievementId)
    if (!achievement) throw new Error('Achievement not found.')
    const { create: createAchievement } = useBotAchievements(ref(botId))
    await createAchievement({
      ...achievement,
      from: achievementId,
      shared: false,
    })
  }

  return { achievements, fetch, copy }
}
