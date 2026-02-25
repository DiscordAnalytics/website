import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Bot, User } from '@/utils/types.ts'

export const useStore = defineStore('store', () => {
  const userInfos = ref<User | null>(null)
  const userBots = ref<Bot[]>([])

  return { userInfos, userBots }
})
