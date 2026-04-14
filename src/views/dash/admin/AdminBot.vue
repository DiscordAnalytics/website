<script setup lang="ts">
import AdminDashLayout from '@/components/layouts/AdminDashLayout.vue'
import { useBot, useBotAchievements, useBotCustomEvents, useLoading, useUser } from '@/composables'
import { computed, onMounted, ref } from 'vue'
import EditBotsLimitsDialog from '@/components/dash/admin/EditBotsLimitsDialog.vue'
import SuspendBotsDialog from '@/components/dash/admin/SuspendBotsDialog.vue'
import DeleteBotsDialog from '@/components/dash/admin/DeleteBotsDialog.vue'
import { useRouteParams } from '@vueuse/router'
import { APIScope } from '@/utils/api'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DiscordAvatar from '@/components/DiscordAvatar.vue'
import { df } from '@/utils/dateTime.ts'
import { Input } from '@/components/ui/input'
import { Field, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Spinner } from '@/components/ui/spinner'

const botId = useRouteParams<string>('id')
const { bot, fetch: fetchBot, unsuspend: unsuspendBot } = useBot(botId, APIScope.Admin)
const { events, fetch: fetchCustomEvents } = useBotCustomEvents(botId, APIScope.Admin)
const { achievements, fetch: fetchAchievements } = useBotAchievements(botId, APIScope.Admin)

const ownerId = computed(() => bot.value?.ownerId ?? null)
const { userInfos: ownerInfos, fetch: fetchBotOwner } = useUser(APIScope.Admin, ownerId)

const { isLoading, withLoading } = useLoading()
const isEditLimitsModalOpen = ref<boolean>(false)
const isSuspendModalOpen = ref<boolean>(false)
const isDeleteModalOpen = ref<boolean>(false)

async function onBotUnsuspend() {
  await withLoading(async () => {
    await unsuspendBot()
  })
}

onMounted(async () => {
  await withLoading(async () => {
    if (!bot.value) await fetchBot()
    await fetchCustomEvents()
    await fetchAchievements()
    await fetchBotOwner()
  })
})
</script>

<template>
  <EditBotsLimitsDialog
    v-if="bot"
    :bots="[bot]"
    :open="isEditLimitsModalOpen"
    @update:open="(value) => (isEditLimitsModalOpen = value)"
  />

  <SuspendBotsDialog
    v-if="bot"
    :bots="[bot]"
    :open="isSuspendModalOpen"
    @update:open="(value) => (isSuspendModalOpen = value)"
  />

  <DeleteBotsDialog
    v-if="bot"
    :bots="[bot]"
    :open="isDeleteModalOpen"
    @update:open="(value) => (isDeleteModalOpen = value)"
  />

  <AdminDashLayout>
    <div v-if="bot && !isLoading" class="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>{{ $t('pages.dash.admin.bots.bot.identity.title') }}</CardTitle>
        </CardHeader>
        <CardContent class="flex items-center flex-col gap-4 flex-1">
          <DiscordAvatar :id="bot.botId" :alt="bot.username" :avatar="bot.avatar" size="xl" />
          <div class="flex items-center gap-2">
            <h1 class="text-4xl font-bold">{{ bot.username }}</h1>
          </div>
          <Field class="flex-1 w-full">
            <FieldLabel for="watchedSince">
              {{ $t('pages.dash.admin.bots.bot.identity.watchedSince') }}
            </FieldLabel>
            <Input
              id="watchedSince"
              :model-value="df.format(new Date(bot.watchedSince))"
              readonly
            />
          </Field>
          <Field v-if="bot.lastPush" class="flex-1 w-full">
            <FieldLabel for="lastPush">
              {{ $t('pages.dash.admin.bots.bot.identity.lastPush') }}
            </FieldLabel>
            <Input id="lastPush" :model-value="df.format(new Date(bot.lastPush))" readonly />
          </Field>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{{ $t('pages.dash.admin.bots.bot.limits.title') }}</CardTitle>
        </CardHeader>
        <CardContent class="flex flex-col gap-4">
          <Field>
            <div class="flex items-center gap-4 justify-between">
              <FieldLabel>
                {{ $t('pages.dash.admin.bots.fields.goalsLimit.label') }}
              </FieldLabel>
              <FieldLabel>{{ achievements.length }}/{{ bot.goalsLimit }}</FieldLabel>
            </div>
            <Progress :model-value="(achievements.length * 100) / bot.goalsLimit" />
          </Field>
          <Field>
            <div class="flex items-center gap-4 justify-between">
              <FieldLabel>
                {{ $t('pages.dash.admin.bots.fields.customEventsLimit.label') }}
              </FieldLabel>
              <FieldLabel>{{ events.length }}/{{ bot.customEventsLimit }}</FieldLabel>
            </div>
            <Progress :model-value="(events.length * 100) / bot.customEventsLimit" />
          </Field>
          <Field>
            <div class="flex items-center gap-4 justify-between">
              <FieldLabel>{{ $t('pages.dash.admin.bots.fields.teammatesLimit.label') }}</FieldLabel>
              <FieldLabel>{{ bot.team.length }}/{{ bot.teammatesLimit }}</FieldLabel>
            </div>
            <Progress :model-value="(bot.team.length * 100) / bot.teammatesLimit" />
          </Field>
        </CardContent>
      </Card>

      <RouterLink :to="`/dash/admin/users/${bot.ownerId}`">
        <Card>
          <CardHeader>
            <CardTitle>{{ $t('pages.dash.admin.users.user.identity.title') }}</CardTitle>
          </CardHeader>
          <CardContent class="flex items-center gap-4 flex-1">
            <DiscordAvatar
              v-if="ownerInfos"
              :id="ownerInfos.userId"
              :alt="ownerInfos.username"
              :avatar="ownerInfos.avatar"
              size="xl"
            />
            <div class="flex items-center gap-2">
              <h1 class="text-4xl font-bold">{{ ownerInfos?.username ?? ownerId }}</h1>
            </div>
          </CardContent>
        </Card>
      </RouterLink>
      <Card>
        <CardHeader>
          <CardTitle>{{ $t('pages.dash.admin.users.user.actions.title') }}</CardTitle>
        </CardHeader>
        <CardContent>
          <div class="flex items-center gap-2 py-4 justify-center">
            <Button variant="secondary" @click="isEditLimitsModalOpen = true">
              {{ $t('pages.dash.admin.bots.actions.editLimits') }}
            </Button>
            <Button v-if="!bot.suspended" variant="secondary" @click="isSuspendModalOpen = true">
              {{ $t('pages.dash.admin.bots.actions.suspend') }}
            </Button>
            <Button v-else variant="secondary" @click="onBotUnsuspend">
              {{ $t('pages.dash.admin.bots.actions.unsuspend') }}
            </Button>
            <Button variant="destructive" @click="isDeleteModalOpen = true">
              {{ $t('pages.dash.admin.bots.actions.delete') }}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
    <div v-else class="flex justify-center py-10">
      <Spinner />
    </div>
  </AdminDashLayout>
</template>
