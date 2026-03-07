import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed } from 'vue'

export default function useBlogArticles() {
  const api = useAPI(APIScope.Guest)
  const store = useStore()

  const articles = computed(() => store.blogArticles ?? [])
  const tags = computed(() => {
    return [...new Set(articles.value.flatMap((article) => article.tags))]
  })

  async function fetch() {
    store.blogArticles = (await api.articles.get()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  }

  return { articles, tags, fetch }
}
