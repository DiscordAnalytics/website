import { type APIClient } from '@/utils/api/index.ts'
import type { BlogArticle } from '@/utils/types.ts'

export default class ArticlesResource {
  constructor(private readonly api: APIClient) {}

  get(): Promise<BlogArticle[]> {
    return this.api.request('GET', `/articles`)
  }
}
