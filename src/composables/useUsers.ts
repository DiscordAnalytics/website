import useAPI, { APIScope } from '@/utils/api'
import { computed } from 'vue'
import { useStore } from '@/stores'

export default function useUsers() {
  const api = useAPI(APIScope.Admin)
  const store = useStore()

  const users = computed(() => store.allUsers)

  async function fetch() {
    if (!api.userId) throw new Error('Not authenticated')
    store.allUsers = await api.users.getAll()
  }

  async function updateLimits(userId: string, botsLimit: number) {
    if (!api.userId) throw new Error('Not authenticated')
    const index = store.allUsers.findIndex((user) => user.userId === userId)
    const updated = await api.users.updateLimits(userId, botsLimit)

    if (index !== -1) store.allUsers[index] = updated
    else store.allUsers.push(updated)
  }

  async function suspend(userId: string, reason: string) {
    if (!api.userId) throw new Error('Not authenticated')
    const index = store.allUsers.findIndex((user) => user.userId === userId)
    const updated = await api.users.suspend(userId, reason)

    if (index !== -1) store.allUsers[index] = updated
    else store.allUsers.push(updated)
  }

  async function remove(userId: string) {
    if (!api.userId) throw new Error('Not authenticated')
    await api.users.remove(userId)

    store.allUsers = store.allUsers.filter((user) => user.userId !== userId)
  }

  return { users, fetch, updateLimits, suspend, remove }
}
