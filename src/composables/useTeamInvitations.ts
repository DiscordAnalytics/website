import useAPI, { APIScope } from '@/utils/api'
import { computed } from 'vue'
import { useStore } from '@/stores'

export default function useTeamInvitations(scope: APIScope = APIScope.User) {
  const api = useAPI(scope)
  const store = useStore()

  const invitations = computed(() => store.teamInvitations ?? [])

  async function fetch() {
    if (api.scope === APIScope.Admin)
      store.teamInvitations = await api.bots.invitations
        .getAll()
        .then((invites) => invites.filter((invite) => !invite.invitation.accepted))
    else store.teamInvitations = await api.bots.invitations.getAllForCurrentUser()
  }

  async function accept(invitationId: string) {
    if (!api.userId) throw new Error('Not authenticated')
    await api.bots.invitations.answer(invitationId, true)
    store.teamInvitations = store.teamInvitations.filter(
      (invitation) => invitation.invitation.invitationId !== invitationId,
    )
  }

  async function reject(invitationId: string) {
    if (!api.userId) throw new Error('Not authenticated')
    await api.bots.invitations.answer(invitationId, false)
    store.teamInvitations = store.teamInvitations.filter(
      (invitation) => invitation.invitation.invitationId !== invitationId,
    )
  }

  return { invitations, fetch, accept, reject }
}
