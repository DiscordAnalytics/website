import useAPI, { APIScope } from '@/utils/api'
import { type Ref, ref } from 'vue'
import type { TeamInvitationData } from '@/utils/types.ts'

export default function useTeamInvitation(
  invitationId: Ref<string>,
  scope: APIScope = APIScope.Guest,
) {
  const api = useAPI(scope)

  const invitation = ref<TeamInvitationData | null>(null)

  async function fetch() {
    invitation.value = await api.bots.invitations.fetch(invitationId.value)
  }

  async function accept() {
    if (!api.userId || scope === APIScope.Guest) throw new Error('Not authenticated')
    await api.bots.invitations.answer(invitationId.value, true)
  }

  async function reject() {
    if (!api.userId || scope === APIScope.Guest) throw new Error('Not authenticated')
    await api.bots.invitations.answer(invitationId.value, false)
  }

  return { invitation, fetch, accept, reject }
}
