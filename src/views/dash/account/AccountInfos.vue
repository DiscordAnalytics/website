<script lang="ts" setup>
import AccountDashLayout from '@/components/layouts/AccountDashLayout.vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DiscordAvatar from '@/components/DiscordAvatar.vue'
import { useBotAchievements, useBotCustomEvents, useCurrentUser, useLoading } from '@/composables'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { df } from '@/utils/dateTime.ts'
import { Progress } from '@/components/ui/progress'
import { onMounted, ref } from 'vue'
import { Empty, EmptyHeader, EmptyMedia } from '@/components/ui/empty'
import { Spinner } from '@/components/ui/spinner'

const { userInfos, ownedBots, notOwnedBots, accessibleBots: userBots } = useCurrentUser()

const goalsCount = ref<{ [botId: string]: number }>({})
const eventsCount = ref<{ [botId: string]: number }>({})
const { isLoading, withLoading } = useLoading()

async function getGoalsCount() {
  for (const bot of userBots.value) {
    const { achievements, fetch: fetchAchievements } = useBotAchievements(ref(bot.botId))
    if (achievements.value.length === 0) await fetchAchievements()
    goalsCount.value[bot.botId] = achievements.value.length
  }
}

async function getEventsCount() {
  for (const bot of userBots.value) {
    const { events, fetch: fetchEvents } = useBotCustomEvents(ref(bot.botId))
    if (events.value.length === 0) await fetchEvents()
    eventsCount.value[bot.botId] = events.value.length
  }
}

onMounted(async () => {
  await withLoading(async () => {
    await getGoalsCount()
    await getEventsCount()
  })
})
</script>

<template>
  <AccountDashLayout>
    <main v-if="userInfos && !isLoading" class="grid grid-cols-1 gap-4 my-8">
      <Card class="flex flex-col lg:flex-row items-center">
        <CardHeader class="flex items-center flex-row gap-4 flex-1">
          <DiscordAvatar
            :id="userInfos.userId"
            :alt="userInfos.username"
            :avatar="userInfos.avatar"
            :avatar-decoration="userInfos.avatarDecoration"
            size="xl"
          />
          <h1 class="text-4xl font-bold">{{ userInfos.username }}</h1>
        </CardHeader>
        <CardContent class="flex items-center flex-row lg:flex-col gap-4 flex-1 mt-4">
          <Field class="flex-1">
            <FieldLabel for="joinedAt">{{ $t('pages.dash.account.infos.joinedAt') }}</FieldLabel>
            <Input id="joinedAt" :model-value="df.format(new Date(userInfos.joinedAt))" readonly />
          </Field>
          <Field class="flex-1">
            <FieldLabel for="createdAt">{{ $t('pages.dash.account.infos.createdAt') }}</FieldLabel>
            <Input
              id="createdAt"
              :model-value="df.format(new Date(userInfos.createdAt))"
              readonly
            />
          </Field>
        </CardContent>
      </Card>

      <header class="m-8">
        <h1 class="text-4xl font-bold mb-2">{{ $t('pages.dash.account.infos.usage.title') }}</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle class="text-lg">
            {{ $t('pages.dash.account.infos.usage.globalUsage') }}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Field>
            <div class="flex items-center gap-4 justify-between">
              <FieldLabel>{{ $t('pages.dash.account.infos.usage.bots') }}</FieldLabel>
              <FieldLabel>{{ ownedBots.length }}/{{ userInfos.botsLimit }}</FieldLabel>
            </div>
            <Progress :model-value="(ownedBots.length * 100) / userInfos.botsLimit" />
          </Field>
        </CardContent>
      </Card>

      <div v-for="(bots, i) in [ownedBots, notOwnedBots]" :key="i">
        <Card v-if="bots.length > 0">
          <CardHeader>
            <CardTitle v-if="i" class="text-lg">
              {{ $t('pages.dash.account.infos.usage.sharedWithMe') }}
            </CardTitle>
            <CardTitle v-else class="text-lg">
              {{ $t('pages.dash.account.infos.usage.myBots') }}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              v-for="bot in bots"
              class="mb-8 last:mb-0 border-b pb-4 last:border-none last:pb-0"
              :key="bot.botId"
            >
              <RouterLink :to="`/dash/bots/${bot.botId}`">
                <CardTitle class="flex items-center gap-2 mb-4">
                  <DiscordAvatar
                    :id="bot.botId"
                    :alt="bot.username"
                    :avatar="bot.avatar"
                    size="sm"
                  />
                  {{ bot.username }}
                </CardTitle>
              </RouterLink>
              <div class="flex flex-col lg:flex-row gap-8">
                <Field>
                  <div class="flex items-center gap-4 justify-between">
                    <FieldLabel>{{ $t('pages.dash.account.infos.usage.goals') }}</FieldLabel>
                    <FieldLabel>{{ goalsCount[bot.botId] ?? 0 }}/{{ bot.goalsLimit }}</FieldLabel>
                  </div>
                  <Progress :model-value="((goalsCount[bot.botId] ?? 0) * 100) / bot.goalsLimit" />
                </Field>
                <Field>
                  <div class="flex items-center gap-4 justify-between">
                    <FieldLabel>{{ $t('pages.dash.account.infos.usage.teammates') }}</FieldLabel>
                    <FieldLabel>{{ bot.team.length }}/{{ bot.teammatesLimit }}</FieldLabel>
                  </div>
                  <Progress :model-value="(bot.team.length * 100) / bot.teammatesLimit" />
                </Field>
                <Field>
                  <div class="flex items-center gap-4 justify-between">
                    <FieldLabel>{{ $t('pages.dash.account.infos.usage.customEvents') }}</FieldLabel>
                    <FieldLabel>
                      {{ eventsCount[bot.botId] ?? 0 }}/{{ bot.customEventsLimit }}
                    </FieldLabel>
                  </div>
                  <Progress
                    :model-value="((eventsCount[bot.botId] ?? 0) * 100) / bot.customEventsLimit"
                  />
                </Field>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
    <Empty v-else class="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Spinner />
        </EmptyMedia>
      </EmptyHeader>
    </Empty>
  </AccountDashLayout>
</template>
