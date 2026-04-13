import useAPI, { APIScope } from '@/utils/api'
import { useStore } from '@/stores'
import { computed } from 'vue'
import type { BlogArticle } from '@/utils/types.ts'

export default function useBlogArticles(scope: APIScope = APIScope.Guest) {
  const api = useAPI(scope)
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

  async function getArticle(articleId: string) {
    return await api.articles.getArticle(articleId)
  }

  async function update(articleId: string, body: Partial<BlogArticle>) {
    if (api.scope !== APIScope.Admin) throw new Error('Unauthorized')
    return await api.articles.update(articleId, body)
  }

  async function publish(articleId: string) {
    if (api.scope !== APIScope.Admin) throw new Error('Unauthorized')
    return await api.articles.publish(articleId)
  }

  async function remove(articleId: string) {
    if (api.scope !== APIScope.Admin) throw new Error('Unauthorized')
    return await api.articles.remove(articleId)
  }

  return { articles, tags, fetch, getArticle, update, publish, remove }
}
