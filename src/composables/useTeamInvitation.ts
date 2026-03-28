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
    invitation.value = await api.bots.invitations.getInvitation(invitationId.value)
  }

  return { invitation, fetch }
}
