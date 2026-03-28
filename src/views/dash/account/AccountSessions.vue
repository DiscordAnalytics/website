<script setup lang="ts">
import AccountDashLayout from '@/components/layouts/AccountDashLayout.vue'
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty'
import { BrushCleaningIcon, FrownIcon } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { Spinner } from '@/components/ui/spinner'
import useOAuthSessions from '@/composables/useOAuthSessions.ts'
import AccountSessionCard from '@/components/dash/AccountSessionCard.vue'
import { toast } from 'vue-sonner'
import { Button } from '@/components/ui/button'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const { sessions, fetch: fetchSessions, revokeAll, revokeSession } = useOAuthSessions()

const isLoading = ref<boolean>(false)

async function onRevokeAllSessions() {
  isLoading.value = false
  await revokeAll()
    .then(() => toast.success(t('pages.dash.account.sessions.toasts.revokedAll')))
    .catch((err) => toast.error(err.message))
  isLoading.value = false
}

async function onRevokeSession(sessionId: string) {
  isLoading.value = false
  await revokeSession(sessionId)
    .then(() => toast.success(t('pages.dash.account.sessions.toasts.revoked')))
    .catch((err) => toast.error(err.message))
  isLoading.value = false
}

onMounted(async () => {
  isLoading.value = true
  await fetchSessions()
  isLoading.value = false
})
</script>

<template>
  <AccountDashLayout>
    <main v-if="sessions.length > 0" class="grid grid-cols-1 gap-4 my-8">
      <header class="mx-8">
        <h1 class="text-2xl font-bold">{{ $t('pages.dash.account.sessions.current') }}</h1>
      </header>
      <AccountSessionCard
        :session="sessions.find((s) => s.current)!"
        :is-loading="isLoading"
        current
      />

      <header
        v-if="sessions.filter((s) => !s.current && s.active).length > 0"
        class="mx-8 mt-4 flex items-center justify-between flex-col md:flex-row gap-4"
      >
        <h1 class="text-2xl font-bold">{{ $t('pages.dash.account.sessions.others') }}</h1>

        <Button
          variant="destructive"
          :disabled="isLoading"
          class="w-full md:w-fit"
          @click="onRevokeAllSessions()"
        >
          <Spinner v-if="isLoading" />
          <BrushCleaningIcon v-else />
          {{ $t('pages.dash.account.sessions.revokeAll') }}
        </Button>
      </header>
      <AccountSessionCard
        v-for="session in sessions
          .filter((s) => !s.current && s.active)
          .sort((a, b) => new Date(b.lastUsedAt).getTime() - new Date(a.lastUsedAt).getTime())"
        :key="session.sessionId"
        :session="session"
        :is-loading="isLoading"
        @revoke="onRevokeSession"
      />
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
        <EmptyTitle>{{ $t('pages.dash.account.sessions.empty.title') }}</EmptyTitle>
        <EmptyDescription>
          {{ $t('pages.dash.account.sessions.empty.description') }}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  </AccountDashLayout>
</template>
