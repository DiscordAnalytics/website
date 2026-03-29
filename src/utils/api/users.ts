import { type APIClient, APIError, APIScope } from '@/utils/api/index.ts'
import type { Bot, User } from '@/utils/types.ts'

export default class UsersResource {
  constructor(private readonly api: APIClient) {}

  getAll(): Promise<User[]> {
    if (this.api.scope !== APIScope.Admin) throw new APIError(401, 'Unauthorized')

    return this.api.request('GET', `/users`)
  }

  get(userId: string): Promise<User> {
    if (userId !== this.api.userId && this.api.scope !== APIScope.Admin)
      throw new APIError(401, 'Unauthorized')

    return this.api.request('GET', `/users/${userId}`)
  }

  getBots(userId: string): Promise<{ ownedBots: Bot[]; teamBots: Bot[] }> {
    return this.api.request('GET', `/users/${userId}/bots`)
  }

  remove(userId: string): Promise<void> {
    return this.api.request('DELETE', `/users/${userId}`)
  }

  updateLimits(userId: string, botsLimit: number): Promise<User> {
    return this.api.request('PATCH', `/users/${userId}`, { botsLimit })
  }

  suspend(userId: string, reason: string): Promise<User> {
    return this.api.request('POST', `/users/${userId}/suspend`, { reason })
  }
}
