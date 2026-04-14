import useAPI, { APIScope } from '@/utils/api'
import { useUser } from '@/composables/index.ts'
import { ref } from 'vue'

export default function useCurrentUser() {
  const api = useAPI(APIScope.User)

  return useUser(APIScope.User, ref(api.userId))
}
