import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Achievement, Bot, CustomEvent, StatsReport, Teammate, User } from '@/utils/types.ts'

export const useStore = defineStore('store', () => {
  const userInfos = ref<User | null>(null)
  const userBots = ref<Bot[]>([])
  const botAchievements = ref<{ [botId: string]: Achievement[] }>({})
  const botCustomEvents = ref<{ [botId: string]: CustomEvent[] }>({})
  const botTeams = ref<{ [botId: string]: Teammate[] }>({})
  const botEmailReports = ref<{ [botId: string]: StatsReport[] }>({})

  return { userInfos, userBots, botAchievements, botCustomEvents, botTeams, botEmailReports }
})
