import type {APIClient} from "@/utils/api/index.ts";
import type {Bot, User} from "@/utils/types.ts";

export default class UsersResource {
  constructor(private readonly api: APIClient) {}

  get(userId: string): Promise<User> {
    return this.api.request("GET", `/users/${userId}`);
  }

  getBots(userId: string): Promise<{ ownedBots: Bot[]; inBotTeam: Bot[] }> {
    return this.api.request("GET", `/users/${userId}/bots`);
  }
}
