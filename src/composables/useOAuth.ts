import useAPI, { APIScope } from '@/utils/api'
import { ref } from 'vue'
import type { OAuthConfig } from '@/utils/types.ts'

export default function useOAuth(scope: APIScope = APIScope.Guest) {
  const api = useAPI(scope)

  const config = ref<OAuthConfig | null>(null)

  async function fetch() {
    config.value = await api.oauth.getConfig()
  }

  return { config, fetch }
}
