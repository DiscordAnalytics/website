import type { APIClient } from '@/utils/api/index.ts'
import type { TeamInvitationData } from '@/utils/types.ts'

export default class InvitationsResource {
  constructor(private readonly api: APIClient) {}

  fetch(invitationId: string): Promise<TeamInvitationData> {
    return this.api.request('GET', `/invitations/${invitationId}`)
  }

  answer(invitationId: string, accept: boolean): Promise<{ accepted: boolean }> {
    return this.api.request('POST', `/invitations/${invitationId}`, { accept })
  }
}
