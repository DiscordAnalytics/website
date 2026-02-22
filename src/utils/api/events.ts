import type { APIClient } from '@/utils/api/index.ts'

export default class EventsResource {
  constructor(private readonly api: APIClient) {}
}
