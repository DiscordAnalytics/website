<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { useRouteParams } from '@vueuse/router'
import { useCurrentUser, useTeamInvitation } from '@/composables'
import PageLayout from '@/components/layouts/PageLayout.vue'
import DiscordAvatar from '@/components/DiscordAvatar.vue'
import { useRouter } from 'vue-router'
import { Skeleton } from '@/components/ui/skeleton'

const router = useRouter()
const invitationId = useRouteParams<string>('id')
const { userInfos } = useCurrentUser()
const { invitation, fetch: fetchInvitation } = useTeamInvitation(invitationId)

const isLoading = ref<boolean>(false)

onMounted(async () => {
  if (userInfos.value) await router.push('/dash/account/invitations')
  else {
    isLoading.value = true
    await fetchInvitation()
    isLoading.value = false
    if (!invitation.value) await router.push({ name: 'NotFound' })
  }
})
</script>

<template>
  <PageLayout>
    <div
      v-if="!isLoading && invitation"
      class="flex flex-col items-center justify-center gap-4 my-48"
    >
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
        {{
          $t('pages.team_invitation.message', {
            owner: invitation.ownerUsername,
            bot: invitation.botUsername,
          })
        }}
      </p>
      <div class="flex flex-col items-center gap-2">
        <p class="text-sm opacity-75">
          {{ $t('pages.team_invitation.logged_out') }}
        </p>
        <RouterLink :to="`/auth?redirect=${encodeURIComponent('/dash/account/invitations')}`">
          <Button>
            {{ $t('pages.team_invitation.login') }}
          </Button>
        </RouterLink>
      </div>
    </div>
    <div v-else class="flex flex-col items-center justify-center gap-4 my-48">
      <Skeleton class="h-42 w-42 rounded-full" />
      <Skeleton class="h-6 w-96" />
      <Skeleton class="h-4 w-56" />
      <div class="flex flex-col items-center gap-2">
        <p class="text-sm opacity-75">
          {{ $t('pages.team_invitation.logged_out') }}
        </p>
        <RouterLink :to="`/auth?redirect=${encodeURIComponent('/dash/account/invitations')}`">
          <Button>
            {{ $t('pages.team_invitation.login') }}
          </Button>
        </RouterLink>
      </div>
    </div>
  </PageLayout>
</template>
