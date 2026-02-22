import { type APIClient, APIError, APIScope } from '@/utils/api/index.ts'
import type { Bot, User } from '@/utils/types.ts'

export default class UsersResource {
  constructor(private readonly api: APIClient) {}

  get(userId: string): Promise<User> {
    if (userId !== this.api.userId && this.api.scope !== APIScope.User)
      throw new APIError(401, 'Unauthorized')

    return this.api.request('GET', `/users/${userId}`)
  }

  getBots(userId: string): Promise<{ ownedBots: Bot[]; inBotTeam: Bot[] }> {
    return this.api.request('GET', `/users/${userId}/bots`)
  }
}
