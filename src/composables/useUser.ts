import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { useRoute, useRouter } from 'vue-router'
import { computed, type Ref } from 'vue'
import useOAuthSessions from '@/composables/useOAuthSessions.ts'

export default function useUser(scope: APIScope, userId: Ref<string | null>) {
  const api = useAPI(scope)
  const store = useStore()
  const router = useRouter()
  const route = useRoute()

  const userInfos = computed(() => store.allUsers.find((user) => user.userId === userId.value))
  const userBots = computed(() => (userId.value ? (store.userBots[userId.value] ?? []) : []))
  const ownedBots = computed(() => userBots.value.filter((bot) => bot.ownerId === api.userId))
  const notOwnedBots = computed(() =>
    userBots.value.filter((bot) => bot.team.includes(api.userId!)),
  )
  const accessibleBots = computed(() => [...ownedBots.value, ...notOwnedBots.value])

  async function fetch() {
    if (!userId.value) throw new Error('Not Authenticated')
    store.allUsers.push(await api.users.get(userId.value))
    const { ownedBots, teamBots } = await api.users.getBots(userId.value)
    store.userBots[userId.value] = [...ownedBots, ...teamBots]
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

  return { userInfos, accessibleBots, ownedBots, notOwnedBots, fetch, logout, remove }
}
