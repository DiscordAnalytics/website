import { ref } from 'vue'
import { defineStore } from 'pinia'
import type {
  Achievement,
  Bot,
  Color,
  CustomEvent,
  RawStats,
  RawVotes,
  StatsReport,
  Teammate,
  User,
} from '@/utils/types.ts'

export const useStore = defineStore('store', () => {
  const userInfos = ref<User | null>(null)
  const userBots = ref<Bot[]>([])
  const botAchievements = ref<{ [botId: string]: Achievement[] }>({})
  const botCustomEvents = ref<{ [botId: string]: CustomEvent[] }>({})
  const botTeams = ref<{ [botId: string]: Teammate[] }>({})
  const botEmailReports = ref<{ [botId: string]: StatsReport[] }>({})
  const botStats = ref<{ [botId: string]: { stats: RawStats[]; votes: RawVotes[] } }>({})

  const theme = ref<Color>('zinc')

  function setTheme(newTheme: Color) {
    theme.value = newTheme

    const allColors: Color[] = ['zinc', 'orange', 'red', 'blue', 'green']

    document.documentElement.classList.remove(...allColors.map((color) => `theme-${color}`))
    document.documentElement.classList.add(`theme-${newTheme}`)

    localStorage.setItem('theme', newTheme)
  }

  function clear() {
    userInfos.value = null
    userBots.value = []
    botAchievements.value = {}
    botCustomEvents.value = {}
    botTeams.value = {}
    botEmailReports.value = {}
    botStats.value = {}
  }

  return {
    userInfos,
    userBots,
    botAchievements,
    botCustomEvents,
    botTeams,
    botEmailReports,
    botStats,
    theme,
    setTheme,
    clear,
  }
})
