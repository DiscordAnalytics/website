<script setup lang="ts">
import { Spinner } from '@/components/ui/spinner'
import { toast } from 'vue-sonner'
import { ref } from 'vue'
import type { TeamInvitationData } from '@/utils/types.ts'
import { useTeamInvitations } from '@/composables'
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

const emit = defineEmits<{
  (e: 'update:open', value: boolean): void
}>()

const { t } = useI18n()
const { accept: acceptInvitation, reject: rejectInvitation } = useTeamInvitations(APIScope.Admin)

const isLoading = ref<boolean>(false)

async function onSubmit() {
  isLoading.value = true
  try {
    await Promise.all(
      props.invitations.map((invite) =>
        props.accept
          ? acceptInvitation(invite.invitation.invitationId)
          : rejectInvitation(invite.invitation.invitationId),
      ),
    )
    const toastKey = props.accept
      ? 'pages.dash.admin.invitations.answer.toastAccept'
      : 'pages.dash.admin.invitations.answer.toastReject'
    toast.success(t(toastKey))
  } catch (e: any) {
    toast.error(e.message)
  }
  isLoading.value = false
  emit('update:open', false)
}
</script>

<template>
  <AlertDialog :open="props.open" @update:open="$emit('update:open', $event)">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {{
            $t(
              $props.accept
                ? 'pages.dash.admin.invitations.answer.titleAccept'
                : 'pages.dash.admin.invitations.answer.titleReject',
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
              $props.accept
                ? 'pages.dash.admin.invitations.answer.descriptionAccept'
                : 'pages.dash.admin.invitations.answer.descriptionReject',
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
              $props.accept
                ? 'pages.dash.admin.invitations.answer.submitAccept'
                : 'pages.dash.admin.invitations.answer.submitReject',
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
