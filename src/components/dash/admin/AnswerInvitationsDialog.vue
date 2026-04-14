<script setup lang="ts">
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'vue-sonner'
import type { TeamInvitationData } from '@/utils/types.ts'
import { useLoading, useTeamInvitations } from '@/composables'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useI18n } from 'vue-i18n'
import { APIScope } from '@/utils/api'

const props = defineProps<{
  invitations: TeamInvitationData[]
  open: boolean
  accept: boolean
}>()

defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { t } = useI18n()
const { accept: acceptInvitation, reject: rejectInvitation } = useTeamInvitations(APIScope.Admin)
const { isLoading, withLoading } = useLoading()

async function onSubmit() {
  await withLoading(async () => {
    try {
      await Promise.all(
        props.invitations.map((invite) =>
          props.accept
            ? acceptInvitation(invite.invitation.invitationId)
            : rejectInvitation(invite.invitation.invitationId),
        ),
      )
      toast.success(
        t(`pages.dash.admin.invitations.answer.toast${props.accept ? 'Accept' : 'Reject'}`),
      )
    } catch (e: any) {
      toast.error(e.message)
    }
  })
}
</script>

<template>
  <AlertDialog :open="props.open" @update:open="$emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {{
            $t(
              `pages.dash.admin.invitations.answer.title${$props.accept ? 'Accept' : 'Reject'}`,
              $props.invitations.length,
              {
                named: {
                  username: $props.invitations[0]?.userUsername,
                },
              },
            )
          }}
        </AlertDialogTitle>
        <AlertDialogDescription>
          {{
            $t(
              `pages.dash.admin.invitations.answer.description${$props.accept ? 'Accept' : 'Reject'}`,
              $props.invitations.length,
              {
                named: {
                  username: $props.invitations[0]?.userUsername,
                },
              },
            )
          }}
        </AlertDialogDescription>
      </AlertDialogHeader>

      <AlertDialogFooter>
        <AlertDialogCancel :disabled="isLoading">
          <Spinner v-if="isLoading" />
          {{ $t('pages.dash.admin.invitations.answer.cancel') }}
        </AlertDialogCancel>
        <AlertDialogAction variant="destructive" :disabled="isLoading" @click="onSubmit">
          <Spinner v-if="isLoading" />
          {{
            $t(
              `pages.dash.admin.invitations.answer.submit${$props.accept ? 'Accept' : 'Reject'}`,
              $props.invitations.length,
              {
                named: {
                  username: $props.invitations[0]?.userUsername,
                },
              },
            )
          }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
