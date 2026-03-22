<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { useI18n } from 'vue-i18n'
import { useRouteParams } from '@vueuse/router'
import { useCurrentUser, useTeamInvitation } from '@/composables'
import { APIScope } from '@/utils/api'
import { toast } from 'vue-sonner'
import PageLayout from '@/components/layouts/PageLayout.vue'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { FrownIcon } from 'lucide-vue-next'
import DiscordAvatar from '@/components/DiscordAvatar.vue'
import { Spinner } from '@/components/ui/spinner'

const i18n = useI18n()
const invitationId = useRouteParams<string>('id')
const { userInfos, fetch: fetchUser } = useCurrentUser()
const {
  invitation,
  fetch: fetchInvitation,
  accept,
  reject,
} = useTeamInvitation(invitationId, userInfos ? APIScope.User : APIScope.Guest)

const error = ref<string | null>(null)
const answered = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const isAccepted = ref<boolean>(false)

async function acceptInvitation() {
  isLoading.value = true
  await accept()
    .then(async () => {
      await fetchUser()
      toast.success(i18n.t('pages.team_invitation.toast.accepted'))
      isAccepted.value = true
      answered.value = true
    })
    .catch((err) => toast.error(err.message))
  isLoading.value = false
}

async function rejectInvitation() {
  isLoading.value = true
  await reject()
    .then(() => {
      toast.success(i18n.t('pages.team_invitation.toast.rejected'))
      isAccepted.value = false
      answered.value = true
    })
    .catch((err) => toast.error(err.message))
  isLoading.value = false
}

onBeforeMount(async () => {
  isLoading.value = true
  await fetchInvitation()
  isLoading.value = false

  if (
    invitation.value &&
    userInfos.value &&
    userInfos.value.userId !== invitation.value.invitation.userId
  )
    return (error.value = 'Unauthorized')
})
</script>

<template>
  <PageLayout>
    <div v-if="invitation && !error" class="flex flex-col items-center justify-center gap-4 my-48">
      <DiscordAvatar
        :id="invitation.invitation.botId"
        :alt="invitation.botUsername"
        :avatar="invitation.botAvatar"
        size="3xl"
      />
      <h1 class="font-bold text-2xl">
        {{ $t('pages.team_invitation.title', { username: invitation.botUsername }) }}
      </h1>
      <p>
        <!--        <DiscordAvatar
          :id="invitation.ownerId"
          :alt="invitation.ownerUsername"
          :avatar="invitation.ownerAvatar"
          :avatar-decoration="invitation.ownerAvatarDecoration"
          size="sm"
        />-->
        {{
          $t('pages.team_invitation.message', {
            owner: invitation.ownerUsername,
            bot: invitation.botUsername,
          })
        }}
      </p>
      <div v-if="!userInfos" class="flex flex-col items-center gap-2">
        <p class="text-sm opacity-75">
          {{ $t('pages.team_invitation.logged_out') }}
        </p>
        <RouterLink :to="`/auth?redirect=${encodeURIComponent('/invitation/' + invitationId)}`">
          <Button>
            {{ $t('pages.team_invitation.login') }}
          </Button>
        </RouterLink>
      </div>
      <div v-else-if="!answered || isLoading" class="flex gap-2">
        <Button :disabled="answered || isLoading" @click="acceptInvitation">
          <Spinner v-if="isLoading" class="mr-2" />
          {{ $t('pages.team_invitation.accept') }}
        </Button>
        <Button :disabled="answered || isLoading" variant="ghost" @click="rejectInvitation">
          <Spinner v-if="isLoading" class="mr-2" />
          {{ $t('pages.team_invitation.decline') }}
        </Button>
      </div>
      <div v-else-if="answered" class="flex flex-col items-center gap-2">
        <p v-if="isAccepted" class="text-sm opacity-75">
          {{ $t('pages.team_invitation.accepted', { username: invitation.ownerUsername }) }}
        </p>
        <p v-else class="text-sm opacity-75">
          {{ $t('pages.team_invitation.declined', { username: invitation.ownerUsername }) }}
        </p>
        <RouterLink v-if="isAccepted" :to="`/dash/bots/${invitation.invitation.botId}`">
          <Button>
            {{ $t('pages.team_invitation.bot_dashboard', { bot: invitation.botUsername }) }}
          </Button>
        </RouterLink>
        <RouterLink v-else to="/dash">
          <Button>
            {{ $t('pages.team_invitation.dashboard') }}
          </Button>
        </RouterLink>
      </div>
    </div>
    <Empty v-else-if="error">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <FrownIcon />
        </EmptyMedia>
        <EmptyTitle>{{ $t('pages.team_invitation.error') }}</EmptyTitle>
        <EmptyDescription>{{ error }}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  </PageLayout>
</template>
