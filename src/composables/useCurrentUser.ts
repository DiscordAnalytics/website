import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import useOAuthSessions from '@/composables/useOAuthSessions.ts'

export default function useCurrentUser() {
  const api = useAPI(APIScope.User)
  const store = useStore()
  const router = useRouter()
  const route = useRoute()

  const userInfos = computed(() => store.userInfos)
  const userBots = computed(() => store.userBots)
  const ownedBots = computed(() => store.userBots.filter((bot) => bot.ownerId === api.userId))
  const notOwnedBots = computed(() => store.userBots.filter((bot) => bot.ownerId !== api.userId))

  async function fetch() {
    if (!api.userId) throw new Error('Not Authenticated')
    store.userInfos = await api.users.get(api.userId)
    const { ownedBots, teamBots } = await api.users.getBots(api.userId)
    store.userBots = [...ownedBots, ...teamBots]
  }

  async function logout(revoke: boolean = true) {
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
    if (!api.userId) throw new Error('Not Authenticated')
    await api.users.remove(api.userId)
    await logout(false)
  }

  return { userInfos, userBots, ownedBots, notOwnedBots, fetch, logout, remove }
}
