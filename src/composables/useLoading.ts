import { ref } from 'vue'

export default function useLoading() {
  const isLoading = ref<boolean>(false)

  async function withLoading(callback: () => Promise<void>): Promise<void> {
    isLoading.value = true
    try {
      await callback()
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, withLoading }
}
