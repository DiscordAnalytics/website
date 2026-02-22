import { type APIClient } from '@/utils/api/index.ts'
import type {
  Achievement,
  Bot,
  CustomEvent,
  RawStats,
  RawVotes,
  StatsReport,
  Teammate,
} from '@/utils/types.ts'
import type { DateRange } from 'reka-ui'
import { dateToUTCDateTime } from '@/utils/dateTime.ts'
import EventsResource from '@/utils/api/events.ts'

export default class BotsResource {
  constructor(private readonly api: APIClient) {}

  get events(): EventsResource {
    return new EventsResource(this.api)
  }

  get(botId: string): Promise<Bot> {
    return this.api.request('GET', `/bots/${botId}`)
  }

  getStats(botId: string, range: DateRange): Promise<{ stats: RawStats[]; votes: RawVotes[] }> {
    const start = dateToUTCDateTime(range.start!).split('T')[0]
    const end = dateToUTCDateTime(range.end!).split('T')[0]
    return this.api.request(
      'GET',
      `/bots/${botId}/stats?start=${start}&end=${end}`,
      undefined,
      'application/www-form-urlencoded',
    )
  }

  deleteBot(botId: string): Promise<void> {
    return this.api.request('DELETE', `/bots/${botId}`)
  }

  regenToken(botId: string, token: string): Promise<void> {
    return this.api.request('PATCH', `/bots/${botId}/token`, { token })
  }

  getEvents(botId: string): Promise<CustomEvent[]> {
    return this.api.request('GET', `/bots/${botId}/events`)
  }

  createEvent(botId: string, body: { event_key: string; graph_name: string }): Promise<void> {
    return this.api.request('POST', `/bots/${botId}/events`, body)
  }

  getTeammates(botId: string): Promise<{ team: Teammate[] }> {
    return this.api.request('GET', `/bots/${botId}/team`)
  }

  addTeammate(
    botId: string,
    teammateId: string,
    sendMethod?: 'mail',
  ): Promise<{ invitationId: string; message: string }> {
    return this.api.request(
      'POST',
      `/bots/${botId}/team${sendMethod ? `send_method=${sendMethod}` : ''}`,
      { userId: teammateId },
    )
  }

  deleteTeammate(botId: string, teammateId: string): Promise<void> {
    return this.api.request('POST', `/bots/${botId}/team`, { userId: teammateId })
  }

  updateSettings(botId: string, settings: { advanced_stats: boolean }): Promise<void> {
    return this.api.request('PATCH', `/bots/${botId}/settings`, { settings })
  }

  getAchievements(botId: string): Promise<Achievement[]> {
    return this.api.request('GET', `/bots/${botId}/achievements`)
  }

  createAchievement(
    botId: string,
    body: Pick<Achievement, 'objective' | 'title' | 'description' | 'shared' | 'from' | 'lang'>,
  ): Promise<Achievement> {
    return this.api.request('POST', `/bots/${botId}/achievements`, body)
  }

  deleteAchievement(botId: string, achievementId: string): Promise<void> {
    return this.api.request('DELETE', `/bots/${botId}/achievements`, {
      id: achievementId,
    })
  }

  updateAchievement(
    botId: string,
    body: Pick<Achievement, 'description' | 'id' | 'title' | 'lang' | 'shared'>,
  ): Promise<void> {
    return this.api.request('PATCH', `/bots/${botId}/achievements`, body)
  }

  resetAchievements(botId: string): Promise<void> {
    return this.api.request('POST', `/bots/${botId}/achievements/reset`)
  }

  getEmailReports(botId: string): Promise<StatsReport[]> {
    return this.api.request('GET', `/bots/${botId}/reports`)
  }

  createEmailReport(botId: string, frequency: 'weekly' | 'monthly'): Promise<void> {
    return this.api.request('POST', `/bots/${botId}/reports`, { frequency })
  }

  deleteEmailReport(botId: string, frequency: 'weekly' | 'monthly'): Promise<void> {
    return this.api.request('DELETE', `/bots/${botId}/reports`, { frequency })
  }

  updateVotesWebhook(botId: string, webhookUrl: string): Promise<void> {
    return this.api.request('PATCH', `/bots/${botId}/votes/webhooks`, { webhookUrl })
  }
}
