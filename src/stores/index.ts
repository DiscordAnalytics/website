import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Achievement, Bot, CustomEvent, User } from '@/utils/types.ts'

export const useStore = defineStore('store', () => {
  const userInfos = ref<User | null>(null)
  const userBots = ref<Bot[]>([])
  const botAchievements = ref<{ [botId: string]: Achievement[] }>({})
  const botCustomEvents = ref<{ [botId: string]: CustomEvent[] }>({})

  return { userInfos, userBots, botAchievements, botCustomEvents }
})
