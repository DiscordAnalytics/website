import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import { computed, type ComputedRef, type Ref } from 'vue'
import useOAuthSessions from '@/composables/useOAuthSessions.ts'
import type { Bot } from '@/utils/types.ts'

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
      : [],
  )
  const ownedBots = computed(() => userBots.value.filter((bot) => bot.ownerId === userId.value))
  const notOwnedBots = computed(() =>
    userBots.value.filter((bot) => bot.team.includes(userId.value!)),
  )
  const accessibleBots = computed(() => [...ownedBots.value, ...notOwnedBots.value])

  async function fetch() {
    if (!userId.value) throw new Error('Not Authenticated')
    store.allUsers.push(await api.users.get(userId.value))
    const { ownedBots, teamBots } = await api.users.getBots(userId.value)
    const allUserBots = [...ownedBots, ...teamBots]
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
