import { useLocalStorage } from '@vueuse/core'
import { type ComputedRef, type Ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { useStore } from '@/stores'
import useAPI, { APIScope, getDemoBot } from '@/utils/api'
import type { Bot } from '@/utils/types'

import { useAnalytics, useOAuthSessions } from '.'

export default function useUser(
  scope: APIScope,
  userId: Ref<string | null> | ComputedRef<string | null>,
) {
  const api = useAPI(scope)
  const store = useStore()
  const router = useRouter()
  const route = useRoute()

  const userInfos = computed(() => store.allUsers.find((user) => user.userId === userId.value))
  const userBots = computed(() =>
    userId.value
      ? (store.userBotIds[userId.value] ?? [])
          .map((id) => store.bots[id])
          .filter((b): b is Bot => !!b)
          .filter((b) => {
            if (b.botId === 'demo-bot') {
              return window.location.pathname.includes('/bots/demo-bot')
            }
            return true
          })
      : [],
  )
  const ownedBots = computed(() => userBots.value.filter((bot) => bot.ownerId === userId.value))
  const notOwnedBots = computed(() => userBots.value.filter((bot) => bot.ownerId !== userId.value))
  const accessibleBots = computed(() => [...ownedBots.value, ...notOwnedBots.value])

  async function fetch() {
    if (!userId.value) throw new Error('Not Authenticated')
    store.allUsers.push(await api.users.get(userId.value))
    const { ownedBots, teamBots } = await api.users.getBots(userId.value)
    let allUserBots = [...ownedBots, ...teamBots]
    if (useLocalStorage('sandbox_demo', false).value) {
      const demoBot = getDemoBot(userId.value)
      if (!allUserBots.some((b) => b.botId === 'demo-bot')) {
        allUserBots.push(demoBot as Bot)
      }
    } else {
      allUserBots = allUserBots.filter((b) => b.botId !== 'demo-bot')
      delete store.bots['demo-bot']
    }
    for (const bot of allUserBots) {
      store.bots[bot.botId] = bot
    }
    store.userBotIds[userId.value] = allUserBots.map((b) => b.botId)
  }

  async function logout(revoke: boolean = true) {
    if (api.userId !== userId.value) throw new Error('Cannot perform logout action on this user')
    if (revoke) {
      const { sessions, fetch: fetchSessions, revokeSession } = useOAuthSessions()
      if (sessions.value.length === 0) await fetchSessions()
      const session = sessions.value.find((s) => s.current && s.active)
      if (session) await revokeSession(session.sessionId)
    }
    api.clearTokens()
    store.clear()

    useAnalytics().capture('user_logged_out')
    useAnalytics().reset()

    setTimeout(async () => {
      if (route.path.startsWith('/dash') || route.path.startsWith('/auth')) await router.push('/')
    }, 500)
  }

  async function remove() {
    if (!userId.value) throw new Error('Not Authenticated')
    await api.users.remove(userId.value)
    await logout(false)
  }

  async function unsuspend() {
    if (!api.userId) throw new Error('Not authenticated')
    const index = store.allUsers.findIndex((user) => user.userId === userId.value)
    await api.users.unsuspend(userId.value!)

    if (index !== -1) store.allUsers[index]!.suspended = false
  }

  return { userInfos, accessibleBots, ownedBots, notOwnedBots, fetch, logout, remove, unsuspend }
}
