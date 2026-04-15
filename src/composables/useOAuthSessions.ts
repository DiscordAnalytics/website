import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed } from 'vue'

export default function useOAuthSessions() {
  const api = useAPI(APIScope.User)
  const store = useStore()

  const sessions = computed(() => store.userSessions)

  async function fetch() {
    if (!api.userId) throw new Error('Not authenticated')
    store.userSessions = await api.oauth.sessions.getAll()
  }

  async function revokeAll() {
    if (!api.userId) throw new Error('Not authenticated')
    await api.oauth.sessions.revokeAll()
    await fetch()
  }

  async function revokeSession(sessionId: string) {
    if (!api.userId) throw new Error('Not authenticated')
    await api.oauth.sessions.revoke(sessionId)
    store.userSessions = store.userSessions.filter((session) => session.sessionId !== sessionId)
  }

  return { sessions, fetch, revokeAll, revokeSession }
}
