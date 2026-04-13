import type { APIClient } from '@/utils/api/index.ts'
import type { TeamInvitationData } from '@/utils/types.ts'

export default class InvitationsResource {
  constructor(private readonly api: APIClient) {}

  getAllForCurrentUser(): Promise<TeamInvitationData[]> {
    return this.api.request('GET', `/users/${this.api.userId}/invitations`)
  }

  getAll(): Promise<TeamInvitationData[]> {
    return this.api.request('GET', `/invitations`)
  }

  get(invitationId: string): Promise<TeamInvitationData> {
    return this.api.request('GET', `/invitations/${invitationId}`)
  }

  answer(invitationId: string, accept: boolean): Promise<{ accepted: boolean }> {
    return this.api.request('POST', `/invitations/${invitationId}`, { accept })
  }
}
