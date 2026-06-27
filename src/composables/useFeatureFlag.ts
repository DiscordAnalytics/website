import posthog from 'posthog-js'
import { onMounted, ref } from 'vue'

export default function useFeatureFlag(key: string) {
  const flagValue = ref<string | boolean | undefined>(posthog.getFeatureFlag(key))

  onMounted(() => {
    posthog.onFeatureFlags(() => {
      flagValue.value = posthog.getFeatureFlag(key)
    })
  })

  return flagValue
}
