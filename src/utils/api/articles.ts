import { type APIClient } from '@/utils/api/index.ts'
import type { BlogArticle } from '@/utils/types.ts'

export default class ArticlesResource {
  constructor(private readonly api: APIClient) {}

  get(): Promise<Omit<BlogArticle, 'content'>[]> {
    return this.api.request('GET', `/articles`)
  }

  getArticle(articleId: string): Promise<BlogArticle> {
    return this.api.request('GET', `/articles/${articleId}`)
  }
}
