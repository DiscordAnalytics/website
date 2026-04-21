<script setup lang="ts">
import AccountDashLayout from '@/components/layouts/AccountDashLayout.vue'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { CheckIcon, FrownIcon, XIcon } from '@lucide/vue'
import { useLoading, useTeamInvitations } from '@/composables'
import { onMounted } from 'vue'
import DiscordAvatar from '@/components/DiscordAvatar.vue'
import { Spinner } from '@/components/ui/spinner'
import { Item, ItemActions, ItemContent, ItemMedia, ItemTitle } from '@/components/ui/item'
import { Button } from '@/components/ui/button'
import { toast } from 'vue-sonner'
import { useI18n } from 'vue-i18n'

const { invitations, fetch: fetchInvitations, accept, reject } = useTeamInvitations()
const i18n = useI18n()
const { isLoading, withLoading } = useLoading()

async function acceptInvitation(invitationId: string) {
  await withLoading(async () => {
    await accept(invitationId)
      .then(async () => {
        toast.success(i18n.t('pages.dash.account.invitations.toast.accepted'))
      })
      .catch((err) => toast.error(err.message))
  })
}

async function rejectInvitation(invitationId: string) {
  await withLoading(async () => {
    await reject(invitationId)
      .then(() => {
        toast.success(i18n.t('pages.dash.account.invitations.toast.rejected'))
      })
      .catch((err) => toast.error(err.message))
  })
}

onMounted(async () => {
  await withLoading(async () => {
    await fetchInvitations()
  })
})
</script>

<template>
  <AccountDashLayout>
    <main v-if="invitations.length > 0" class="grid grid-cols-1 gap-4 my-8">
      <Item
        v-for="invitation in invitations"
        :key="invitation.invitation.invitationId"
        variant="outline"
        class="flex-col md:flex-row items-start md:items-center justify-between flex-nowrap"
      >
        <ItemMedia>
          <DiscordAvatar
            :id="invitation.invitation.botId"
            :alt="invitation.botUsername"
            :avatar="invitation.botAvatar"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>{{ invitation.botUsername }}</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="icon" @click="acceptInvitation(invitation.invitation.invitationId)">
            <Spinner v-if="isLoading" />
            <CheckIcon v-else />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            @click="rejectInvitation(invitation.invitation.invitationId)"
          >
            <Spinner v-if="isLoading" />
            <XIcon v-else />
          </Button>
        </ItemActions>
      </Item>
    </main>
    <Empty v-else-if="isLoading" class="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
      </EmptyHeader>
    </Empty>
    <Empty v-else class="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FrownIcon />
        </EmptyMedia>
        <EmptyTitle>{{ $t('pages.dash.account.invitations.empty.title') }}</EmptyTitle>
        <EmptyDescription>
          {{ $t('pages.dash.account.invitations.empty.description') }}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  </AccountDashLayout>
</template>
