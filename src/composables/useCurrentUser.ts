import { ref } from 'vue'

import { useUser } from '@/composables'
import useAPI, { APIScope } from '@/utils/api'

export default function useCurrentUser() {
  const api = useAPI(APIScope.User)

  return useUser(APIScope.User, ref(api.userId))
}
